import { models } from 'cozy-client'

const {
  getFullname,
  getIndexByFamilyNameGivenNameEmailCozyUrl,
  getDisplayName
} = models.contact

export const updateContact = contact => {
  return {
    ...contact,
    fullname: getFullname(contact),
    displayName: getDisplayName(contact),
    indexes: {
      byFamilyNameGivenNameEmailCozyUrl: getIndexByFamilyNameGivenNameEmailCozyUrl(
        contact
      )
    }
  }
}
