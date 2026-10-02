import {
  FieldValue,
  QueryDocumentSnapshot,
  Timestamp,
  type Firestore
} from 'firebase-admin/firestore'

const PAGE_SIZE = 3

export interface IScheduledMessagesResult {
  promoted: number
  skipped: number
}

const getScheduledMessages = async (db: Firestore) =>
  db
    .collection('messages')
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', Timestamp.now())
    .orderBy('scheduledAt')
    .limit(PAGE_SIZE)
    .get()

const EMPTY_RESULT: IScheduledMessagesResult = { promoted: 0, skipped: 0 }


const scheduledPerPage = async (
  db: Firestore,
  docs: QueryDocumentSnapshot[],
): Promise<IScheduledMessagesResult> => {
  const writer = db.bulkWriter()
  writer.onWriteError(() => false)

  const writes = docs.map((doc) =>
    writer.update(
      doc.ref,
      {
        status: 'sent',
        sentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { lastUpdateTime: doc.updateTime },
    ),
  )

  await writer.close()
  const results = await Promise.allSettled(writes)
  const promoted = results.filter((result) => result.status === 'fulfilled').length
  return { promoted, skipped: results.length - promoted }
}


const paginationScheduledMessages = async (db: Firestore, date: Timestamp, page: number) => {
  const res = await getScheduledMessages(db)
  if (res.empty) return EMPTY_RESULT

  const resulte = await scheduledPerPage(db, res.docs)
  if (res.size < PAGE_SIZE) return resulte

  return paginationScheduledMessages(db, date, page + 1)
}

export const RunScheduledMessages = async (db: Firestore): Promise<IScheduledMessagesResult> => paginationScheduledMessages(db, Timestamp.now(), 0)