import { useSubscription } from '../../hooks/useSubscription'
import { subscribeMessages } from '../../lib/firestore/messages'
import { useCurrentUser } from '../auth/useAuth'

export const useMessages = (connectionId: string) => {
  const { uid } = useCurrentUser()
  const { data, ...rest } = useSubscription(
    `${uid}/${connectionId}`,
    subscribeMessages(uid, connectionId),
  )
  return { messages: data ?? [], ...rest }
}
