import CozyClient from 'cozy-client'
import {
  schema,
  DOCTYPE_CONTACTS_VERSION,
  DOCTYPE_CONTACTS
} from '../../helpers/doctypes'
import log from 'cozy-logger'

const client = CozyClient.fromEnv(null, { schema })

export const getContactsToUpdate = async () => {
  const queryDef = client
    .find(DOCTYPE_CONTACTS)
    .where({
      trashed: {
        $exists: false
      },
      $or: [
        {
          'cozyMetadata.doctypeVersion': { $exists: false }
        },
        {
          'cozyMetadata.doctypeVersion': { $lt: DOCTYPE_CONTACTS_VERSION }
        }
      ]
    })
    .indexFields(['_id'])
    .limitBy(1000)

  try {
    const data = await client.queryAll(queryDef)
    log('info', `${Object.keys(data).length} contact(s) found`)
    return data
  } catch (e) {
    log('error', `Can't find elements : ${e}`)
    return
  }
}

export const updateContactDoctype = oldContact => {
  const { email, cozy, cozyMetadata } = oldContact
  const { givenName, familyName } = oldContact.name

  // create doctype 'fullname'
  const fullname = ((givenName || '') + ' ' + (familyName || '')).trim()

  // update cozyMetadata.doctypeVersion
  const newCozyMetadata = {
    ...cozyMetadata,
    doctypeVersion: DOCTYPE_CONTACTS_VERSION
  }

  const fieldsForIndexAndDisplay = [
    fullname,
    (email && email[0] && email[0].address) || '',
    (cozy && cozy[0] && cozy[0].url) || ''
  ]

  // create doctype 'index'
  const index = fieldsForIndexAndDisplay
    .reduce((prev, curr) => {
      if (curr !== '') return prev + ' ' + curr
      return prev
    })
    .trim()

  // create doctype 'displayName'
  const displayName = fieldsForIndexAndDisplay.find(x => x !== '')

  return {
    ...oldContact,
    cozyMetadata: newCozyMetadata,
    fullname,
    index,
    displayName
  }
}

const checkAndUpdateContacts = async () => {
  try {
    const contactsToUpdate = await getContactsToUpdate()
    contactsToUpdate.map(async contact => {
      const updatedContact = updateContactDoctype(contact)
      await client.save(updatedContact)
      log('info', `Contact successfully updated`)
    })
  } catch (e) {
    log('error', `Contact not updated : ${e}`)
  }
}

checkAndUpdateContacts().catch(e => {
  log('critical', e)
  process.exit(1)
})
