import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onSchedule } from 'firebase-functions/scheduler'
import { RunScheduledMessages } from './messages/promoteDueMessages.js'

initializeApp()


const runScheduledMessages = async () => {
  logger.info('Running scheduled messages')
  return await RunScheduledMessages(getFirestore())
}


export const sendScheduledMessages = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'America/Sao_Paulo',
    retryCount: 0,
  },
  async () => {
    logger.info('Sending scheduled messages every minute', new Date().toISOString())
    await runScheduledMessages()
  },
)
