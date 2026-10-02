import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentSnapshot,
} from 'firebase/firestore'
import type { Contact, ContactInput, Subscriber } from '../../types'
import { db } from '../firebase'
import { normalizePhone } from '../phone'
import { COLLECTIONS, createdStamps, readData, toRequiredDate, updatedStamp } from './shared'

const contactsRef = collection(db, COLLECTIONS.contacts)

const toContact = (snapshot: DocumentSnapshot): Contact => {
  const data = readData(snapshot)
  return {
    id: snapshot.id,
    clientId: data.clientId,
    connectionId: data.connectionId,
    name: data.name,
    phone: data.phone,
    createdAt: toRequiredDate(data.createdAt),
    updatedAt: toRequiredDate(data.updatedAt),
  }
}

const toContactFields = (input: ContactInput) => ({
  name: input.name,
  phone: normalizePhone(input.phone),
})

export const getContacts =
  (clientId: string, connectionId: string): Subscriber<Contact[]> =>
    (onNext, onError) =>
      onSnapshot(
        query(
          contactsRef,
          where('clientId', '==', clientId),
          where('connectionId', '==', connectionId),
          orderBy('name'),
        ),
        (snapshot) => onNext(snapshot.docs.map(toContact)),
        onError,
      )

export const createContact = (clientId: string, connectionId: string, input: ContactInput) =>
  addDoc(contactsRef, { clientId, connectionId, ...toContactFields(input), ...createdStamps() })

export const updateContact = (contactId: string, input: ContactInput) =>
  updateDoc(doc(contactsRef, contactId), { ...toContactFields(input), ...updatedStamp() })

export const deleteContact = (contactId: string) => deleteDoc(doc(contactsRef, contactId))
