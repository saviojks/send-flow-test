import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../firebase'

export const COLLECTIONS = {
  connections: 'connections',
  contacts: 'contacts',
  messages: 'messages',
} as const

const BATCH_LIMIT = 500

export const readData = (snapshot: DocumentSnapshot): DocumentData =>
  snapshot.data({ serverTimestamps: 'estimate' }) ?? {}

export const toDate = (value: unknown): Date | null =>
  value instanceof Timestamp ? value.toDate() : null

export const toRequiredDate = (value: unknown): Date => toDate(value) ?? new Date()

export const createdStamps = () => ({
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})

export const updatedStamp = () => ({ updatedAt: serverTimestamp() })

export const findConnectionChildren = async (
  collectionName: typeof COLLECTIONS.contacts | typeof COLLECTIONS.messages,
  clientId: string,
  connectionId: string,
): Promise<DocumentReference[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, collectionName),
      where('clientId', '==', clientId),
      where('connectionId', '==', connectionId),
    ),
  )
  return snapshot.docs.map((document) => document.ref)
}

const chunk = <T>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  )

export const deleteInBatches = async (refs: DocumentReference[]): Promise<void> => {
  for (const refsChunk of chunk(refs, BATCH_LIMIT)) {
    const batch = writeBatch(db)
    refsChunk.forEach((ref) => batch.delete(ref))
    await batch.commit()
  }
}
