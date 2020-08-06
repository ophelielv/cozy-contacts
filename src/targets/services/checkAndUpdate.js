import CozyClient from 'cozy-client'
// import { normalizeDoc } from 'cozy-stack-client/dist/DocumentCollection'
import {
  schema,
  DOCTYPE_CONTACTS
  // DOCTYPE_CONTACTS_VERSION
} from '../../helpers/doctypes'
import log from 'cozy-logger'
import { updateContact } from '../../helpers/updateContact'
import pLimit from 'p-limit'
import { isEqual } from 'lodash'

const client = CozyClient.fromEnv(process.env, { schema })

export const getLastSuccessOfService = async (client, serviceName) => {
  try {
    const triggersResult = await client.query(
      client.find('io.cozy.triggers', {
        'message.name': serviceName
      })
    )
    const trigger = await client.query(
      client.get('io.cozy.triggers', triggersResult.data[0].id)
    )

    return trigger.data.current_state.last_success
  } catch (e) {
    throw new Error(`Can't find last exectution of ${serviceName} : ${e}`)
  }
}

export const getContactsToUpdate = async client => {
  try {
    const lastSuccess = await getLastSuccessOfService(client, 'checkAndUpdate')
    const lastSuccessUTCForced = new Date(lastSuccess).toISOString()
    const contactsToUpdate = []
    // const lastExecution = new Date(lastSuccess[1]).toISOString()

    // log('info', `lastSuccess UTC : ${lastSuccessUTCForced}`)
    // log('info', `lastExecution UTC : ${lastExecution}`)

    const queryDef = client
      .find(DOCTYPE_CONTACTS)
      .where({
        trashed: {
          $exists: false
        },
        $or: [
          {
            cozyMetadata: { $exists: false }
          },
          {
            'cozyMetadata.updatedAt': { $gt: lastSuccessUTCForced }
          }
        ]
      })
      .indexFields(['_id'])
      .limitBy(1000)

    const result = await client.queryAll(queryDef)
    // log('info', `${result.length} result(s) found`)

    // result.length &&
    //   log(
    //     'info',
    //     `${result[0].name && result[0].name.givenName} ${result[0].name &&
    //       result[0].name.familyName} updated at ${result[0].cozyMetadata &&
    //       result[0].cozyMetadata.updatedAt}`
    //   )

    const expected = result.map(contact => updateContact(contact))

    // log('info', `result[0] : ${JSON.stringify(result[0])}`)
    // log('info', `********************`)
    // log('info', `expected[0] : ${JSON.stringify(expected[0])}`)

    result.map((contact, index) => {
      if (!isEqual(contact, expected[index]))
        return contactsToUpdate.push(contact)
    })

    log('info', `found ${contactsToUpdate.length} contact(s) to update`)

    return contactsToUpdate
  } catch (e) {
    throw new Error(`Can't find elements : ${e}`)
  }
}

const service = async client => {
  log('info', `Executing checkAndUpdate service`)

  try {
    const contactsToUpdate = await getContactsToUpdate(client)

    // METHOD PROMISES
    const limit = pLimit(100)
    const promiseToUpdateAllContacts = contactsToUpdate.map(contact =>
      limit(() => client.save(updateContact(contact)))
    )

    // METHOD COZY.CLIENT
    // FetchError: {"error":"doc_validation","reason":"Bad special document member: _type"}
    // log('info', `All contacts  : ${JSON.stringify(contactsToUpdate.toUpdate)}`)
    // contactsToUpdate.toUpdate.length &&
    //   (await client
    //     .collection('io.cozy.contacts')
    //     .updateAll(contactsToUpdate.toUpdate))

    if (contactsToUpdate.length) {
      await Promise.all(promiseToUpdateAllContacts)
      log('info', `All contacts successfully updated`)
    } else {
      // TODO remove 'else' before final PR
      log('info', `Nothing happened`)
    }
  } catch (e) {
    log('error', `Contact not updated : ${e}`)
  }
  // OLD - processing only one contact
  // if (process.env.COZY_COUCH_DOC) {
  //   const contact = JSON.parse(process.env.COZY_COUCH_DOC)
  //   const normalizedContact = normalizeDoc(contact, DOCTYPE_CONTACTS)
  //   const updatedContact = updateContact(normalizedContact)
  //   await client.save(updatedContact)
  //   log('info', `Contact ${updatedContact.id} successfully updated`)
  // }
}

service(client).catch(e => {
  log('critical', e)
  process.exit(1)
})
