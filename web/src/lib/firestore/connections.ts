import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentSnapshot,
} from 'firebase/firestore'
import type { Connection, ConnectionInput, Subscriber } from '../../types'
import { db } from '../firebase'
import {
  COLLECTIONS,
  createdStamps,
  deleteInBatches,
  findConnectionChildren,
  readData,
  toRequiredDate,
  updatedStamp,
} from './shared'

const connectionsRef = collection(db, COLLECTIONS.connections)

const toConnection = (snapshot: DocumentSnapshot): Connection => {
  const data = readData(snapshot)
  return {
    id: snapshot.id,
    clientId: data.clientId,
    name: data.name,
    createdAt: toRequiredDate(data.createdAt),
    updatedAt: toRequiredDate(data.updatedAt),
  }
}

export const getConnections =
  (clientId: string): Subscriber<Connection[]> =>
    (onNext, onError) =>
      onSnapshot(
        query(connectionsRef, where('clientId', '==', clientId), orderBy('createdAt', 'desc')),
        (snapshot) => onNext(snapshot.docs.map(toConnection)),
        onError,
      )

export const getConnection =
  (connectionId: string): Subscriber<Connection | null> =>
    (onNext, onError) =>
      onSnapshot(
        doc(connectionsRef, connectionId),
        (snapshot) => onNext(snapshot.exists() ? toConnection(snapshot) : null),
        onError,
      )

export const createConnection = (clientId: string, input: ConnectionInput) =>
  addDoc(connectionsRef, { clientId, name: input.name, ...createdStamps() })

export const updateConnection = (connectionId: string, input: ConnectionInput) =>
  updateDoc(doc(connectionsRef, connectionId), { name: input.name, ...updatedStamp() })

export const deleteConnection = async (clientId: string, connectionId: string) => {
  const [contacts, messages] = await Promise.all([
    findConnectionChildren(COLLECTIONS.contacts, clientId, connectionId),
    findConnectionChildren(COLLECTIONS.messages, clientId, connectionId),
  ])
  await deleteInBatches([...messages, ...contacts, doc(connectionsRef, connectionId)])
}
