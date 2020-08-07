import CozyClient from 'cozy-client'
import { checkAndUpdate } from './checkAndUpdate'

CozyClient.fromEnv = jest.fn()
const client = new CozyClient({})
client.save = jest.fn(() => Promise.resolve({ data: {} }))

describe('checkAndUpdate', () => {
  it('do something', async () => {})
})
