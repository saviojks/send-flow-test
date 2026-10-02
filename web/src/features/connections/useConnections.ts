import { useSubscription } from '../../hooks/useSubscription'
import { getConnection, getConnections } from '../../lib/firestore/connections'
import { useCurrentUser } from '../auth/useAuth'

export const useConnections = () => {
  const { uid } = useCurrentUser()
  const { data, loading, error } = useSubscription(uid, getConnections(uid))
  return { connections: data ?? [], loading, error }
}

export const useConnection = (connectionId: string) => {
  const { uid } = useCurrentUser()
  const { data, loading, error } = useSubscription(`${uid}/${connectionId}`, getConnection(connectionId))
  return { connection: data ?? null, loading, error }
}
