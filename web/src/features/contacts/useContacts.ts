import { useSubscription } from '../../hooks/useSubscription'
import { getContacts } from '../../lib/firestore/contacts'
import { useCurrentUser } from '../auth/useAuth'

export const useContacts = (connectionId: string) => {
  const { uid } = useCurrentUser()
  const { data, loading, error } = useSubscription(
    `${uid}/${connectionId}`,
    getContacts(uid, connectionId),
  )
  return { contacts: data ?? [], loading, error }
}
