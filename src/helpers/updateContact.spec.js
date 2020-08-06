import { updateContact } from './updateContact'
import { johnDoeContact } from './testData'

describe('checkAndUpdate', () => {
  it('should returns contact with new attributes', () => {
    const expected = {
      _id: '9ecfbf4b-20e7-4bac-87f1-eea53350857d',
      _rev: '1-19c313536e8b27473aa26bf105b03269',
      _type: 'io.cozy.contacts',
      address: [
        {
          formattedAddress: '94 Hinton Road 05034 Fresno, Singapore',
          primary: true,
          type: 'Home'
        },
        {
          city: 'Port Easter',
          country: 'Cocos (Keeling) Islands',
          postcode: '84573',
          street: '426 Runolfsson Knolls',
          type: 'Work'
        }
      ],
      birthday: '1999-5-1',
      company: 'Cozy cloud',
      cozy: [
        { label: 'MyCozy', primary: true, url: 'https://johndoe.mycozy.cloud' }
      ],
      displayName: 'John Doe',
      email: [
        { address: 'john.doe@posteo.net', primary: false, type: 'personal' },
        { address: 'john.doe@cozycloud.cc', primary: true }
      ],
      fullname: 'John Doe',
      id: '9ecfbf4b-20e7-4bac-87f1-eea53350857d',
      indexes: {
        byFamilyNameGivenNameEmailCozyUrl:
          'DoeJohnjohn.doe@cozycloud.ccjohndoe.mycozy.cloud'
      },
      jobTitle: 'Dreamer',
      metadata: { cozy: true, version: 1 },
      name: { familyName: 'Doe', givenName: 'John' },
      note:
        'Atque cupiditate saepe omnis quos ut molestiae labore voluptates omnis.',
      phone: [
        { number: '+33 (2)0 90 00 54 04', primary: true },
        { number: '+33 6 77 11 22 33', primary: false }
      ]
    }
    expect(updateContact(johnDoeContact)).toEqual(expected)
  })
})
