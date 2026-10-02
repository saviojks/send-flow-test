import dayjs, { type Dayjs } from 'dayjs'
import { validationError } from '../../lib/errors'
import type { Message, MessageInput } from '../../types'

export const MAX_BODY_LENGTH = 2000

export type DeliveryMode = 'now' | 'schedule'

export type MessageDraft = {
  body: string
  contactIds: string[]
  mode: DeliveryMode
  scheduledAt: Dayjs | null
}

export const emptyDraft = (): MessageDraft => ({
  body: '',
  contactIds: [],
  mode: 'now',
  scheduledAt: null,
})

export const draftFromMessage = (message: Message): MessageDraft => ({
  body: message.body,
  contactIds: message.contactIds,
  mode: message.status === 'scheduled' ? 'schedule' : 'now',
  scheduledAt: message.scheduledAt ? dayjs(message.scheduledAt) : null,
})

export const isDraftComplete = (draft: MessageDraft): boolean =>
  draft.body.length > 0 &&
  draft.contactIds.length > 0 &&
  (draft.mode === 'now' || Boolean(draft.scheduledAt?.isValid()))

export const toMessageInput = (draft: MessageDraft): MessageInput => {
  if (!isDraftComplete(draft)) {
    throw validationError('Selecione contatos, escreva a mensagem e defina o envio.')
  }
  const scheduledAt = draft.mode === 'schedule' ? draft.scheduledAt : null
  if (scheduledAt && !scheduledAt.isAfter(dayjs())) {
    throw validationError('Escolha uma data e horário no futuro para o agendamento.')
  }
  return {
    body: draft.body,
    contactIds: draft.contactIds,
    scheduledAt: scheduledAt?.toDate() ?? null,
  }
}
