// import { createMockClient } from 'cozy-client'
// // import CozyClient from 'cozy-client'
// // import { schema } from '../../helpers/doctypes'
// import { updateContact } from './checkAndUpdate'
// import { johnDoeContact } from '../../helpers/testData'

// // CozyClient.fromEnv = jest.fn()
// // const client = new CozyClient({})
// const client = createMockClient({})
// // client.save = jest.fn(() => Promise.resolve({ data: {} }))
// // console.info('client', client)

// describe('checkAndUpdate', () => {
//   it('do something', () => {
//     const expected = {
//       ...johnDoeContact,
//       displayName: 'John Doe',
//       fullname: 'John Doe',
//       indexes: {
//         byFamilyNameGivenNameEmailCozyUrl:
//           'DoeJohnjohn.doe@cozycloud.ccjohndoe.mycozy.cloud'
//       }
//     }
//     // CozyClient.fromEnv = jest.fn()
//     // expect(johnDoeContact).toEqual(expected)
//     expect(updateContact(johnDoeContact)).toEqual(expected)
//   })
// })
