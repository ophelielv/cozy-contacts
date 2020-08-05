import get from 'lodash/get'

export const updateDoctypeToV3 = oldContact => {
  console.info('oldcontact', oldContact)

  const { email, cozy } = oldContact
  const { givenName, familyName } = oldContact.name
  const fullname = ((givenName || '') + ' ' + (familyName || '')).trim()
  const fieldsForIndexAndDisplay = [
    fullname,
    (email && email[0] && email[0].address) || '',
    (cozy && cozy[0] && cozy[0].url) || ''
  ]

  const index = fieldsForIndexAndDisplay
    .reduce((prev, curr) => {
      if (curr !== '') return prev + ' ' + curr
      return prev
    })
    .trim()
  const displayName = fieldsForIndexAndDisplay.find(x => x !== '')

  const newContact = {
    ...oldContact,
    fullname,
    index,
    displayName
  }

  // console.info('newContact', newContact)

  return newContact
}

/*
const formValuesToContact = (data, oldContact) => {
  // console.log('data', data)
  // console.log('oldContact', oldContact)
  const {
    givenName,
    familyName,
    phone,
    email,
    address,
    cozy,
    company,
    jobTitle,
    birthday,
    note
  } = data

  const formatedEmail = email
    .filter(val => val && val.email)
    .map(({ email, emailLabel }, index) => ({
      address: email,
      type: emailLabel,
      primary: index === 0
    }))

  const firstEmailAddress = (formatedEmail[0] && formatedEmail[0].address) || ''

  const formatedAddress =
    address &&
    address
      .filter(val => val && val.address)
      .map(({ address, addressLabel }, index) => ({
        formattedAddress: address,
        type: addressLabel,
        primary: index === 0
      }))

  const formatedPhone =
    phone &&
    phone
      .filter(val => val && val.phone)
      .map(({ phone, phoneLabel }, index) => ({
        number: phone,
        type: phoneLabel,
        primary: index === 0
      }))

  const formatedCozy = cozy
    ? [
        {
          url: cozy,
          label: data['cozyLabel'],
          primary: true
        }
      ]
    : []

  const formatedMetadata = {
    ...get(oldContact, 'metadata', {}),
    version: 2,
    cozy: true
  }

  // If we don't create the relationships field manually, cozy-client doesn't create it automatically when needed
  const formatedRelationships = {
    groups: {
      data: []
    }
  }

  const formatedName = {
    givenName,
    familyName
  }

  const formatedCompany = company || ''
  const formatedJobTitle = jobTitle || ''
  const formatedNote = note || ''
  const fullname = ((givenName || '') + ' ' + (familyName || '')).trim()

  const displayNames = [fullname, firstEmailAddress, cozy || '']
  const index = displayNames
    .reduce((prev, curr) => {
      if (curr !== '') return prev + ' ' + curr
      return prev
    })
    .trim()
  const displayName = displayNames.find(x => x !== '')

  return {
    index,
    displayName,
    fullname,
    name: formatedName,
    email: formatedEmail,
    address: formatedAddress,
    phone: formatedPhone,
    cozy: formatedCozy,
    company: formatedCompany,
    jobTitle: formatedJobTitle,
    birthday,
    note: formatedNote,
    relationships: formatedRelationships,
    metadata: formatedMetadata
  }
}
*/

const formValuesToContact = (data, oldContact) => {
  const {
    givenName,
    familyName,
    phone,
    email,
    address,
    cozy,
    company,
    jobTitle,
    birthday,
    note
  } = data

  return {
    name: {
      givenName,
      familyName
    },
    email: email
      .filter(val => val && val.email)
      .map(({ email, emailLabel }, index) => ({
        address: email,
        type: emailLabel,
        primary: index === 0
      })),
    address:
      address &&
      address
        .filter(val => val && val.address)
        .map(({ address, addressLabel }, index) => ({
          formattedAddress: address,
          type: addressLabel,
          primary: index === 0
        })),
    phone:
      phone &&
      phone
        .filter(val => val && val.phone)
        .map(({ phone, phoneLabel }, index) => ({
          number: phone,
          type: phoneLabel,
          primary: index === 0
        })),
    cozy: cozy
      ? [
          {
            url: cozy,
            label: data['cozyLabel'],
            primary: true
          }
        ]
      : [],
    company: company || '',
    jobTitle: jobTitle || '',
    birthday,
    note: note || '',
    // If we don't create the relationships field manually, cozy-client doesn't create it automatically when needed
    relationships: {
      groups: {
        data: []
      }
    },
    metadata: {
      ...get(oldContact, 'metadata', {}),
      version: 1,
      cozy: true
    }
  }
}

export default formValuesToContact
