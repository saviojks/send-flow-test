import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type DocumentSnapshot,
} from 'firebase/firestore'
import type { Message, MessageInput, Subscriber } from '../../types'
import { db } from '../firebase'
import { COLLECTIONS, createdStamps, readData, toDate, toRequiredDate, updatedStamp } from './shared'

const messagesRef = collection(db, COLLECTIONS.messages)

const toMessage = (snapshot: DocumentSnapshot): Message => {
  const data = readData(snapshot)
  return {
    id: snapshot.id,
    clientId: data.clientId,
    connectionId: data.connectionId,
    body: data.body,
    contactIds: data.contactIds ?? [],
    status: data.status,
    scheduledAt: toDate(data.scheduledAt),
    sentAt: toDate(data.sentAt),
    createdAt: toRequiredDate(data.createdAt),
    updatedAt: toRequiredDate(data.updatedAt),
  }
}

const toContentFields = (input: MessageInput) => ({
  body: input.body,
  contactIds: [...new Set(input.contactIds)],
})

/** Sending is simulated: an immediate message is stored as already sent. */
const toDeliveryFields = (scheduledAt: Date | null) =>
  scheduledAt
    ? { status: 'scheduled', scheduledAt: Timestamp.fromDate(scheduledAt), sentAt: null }
    : { status: 'sent', scheduledAt: null, sentAt: serverTimestamp() }

export const subscribeMessages =
  (clientId: string, connectionId: string): Subscriber<Message[]> =>
    (onNext, onError) =>
      onSnapshot(
        query(
          messagesRef,
          where('clientId', '==', clientId),
          where('connectionId', '==', connectionId),
          orderBy('createdAt', 'desc'),
        ),
        (snapshot) => onNext(snapshot.docs.map(toMessage)),
        onError,
      )

export const createMessage = (clientId: string, connectionId: string, input: MessageInput) =>
  addDoc(messagesRef, {
    clientId,
    connectionId,
    ...toContentFields(input),
    ...toDeliveryFields(input.scheduledAt),
    ...createdStamps(),
  })

/** A sent message only allows content edits; a scheduled one can be rescheduled or sent now. */
export const updateMessage = (message: Message, input: MessageInput) =>
  updateDoc(doc(messagesRef, message.id), {
    ...toContentFields(input),
    ...(message.status === 'scheduled' ? toDeliveryFields(input.scheduledAt) : {}),
    ...updatedStamp(),
  })

export const deleteMessage = (messageId: string) => deleteDoc(doc(messagesRef, messageId))
