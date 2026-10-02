import { Alert } from '@mui/material'
import { useState } from 'react'
import { FormDialog } from '../../components/FormDialog'
import { updateMessage } from '../../lib/firestore/messages'
import type { Contact, Message } from '../../types'
import { draftFromMessage, isDraftComplete, toMessageInput } from './draft'
import { MessageFields } from './MessageFields'

type MessageEditDialogProps = {
  message: Message
  contacts: Contact[]
  onClose: () => void
}

const getSuccessMessage = (message: Message, sendsNow: boolean) => {
  if (message.status === 'sent') return 'Mensagem atualizada'
  return sendsNow ? 'Mensagem enviada' : 'Agendamento atualizado'
}

export const MessageEditDialog = ({ message, contacts, onClose }: MessageEditDialogProps) => {
  const [draft, setDraft] = useState(() => draftFromMessage(message))
  const isSent = message.status === 'sent'
  const sendsNow = !isSent && draft.mode === 'now'
  const knownContactIds = new Set(contacts.map((contact) => contact.id))
  const visibleDraft = {
    ...draft,
    contactIds: draft.contactIds.filter((id) => knownContactIds.has(id)),
  }

  return (
    <FormDialog
      title="Editar mensagem"
      submitLabel={sendsNow ? 'Enviar agora' : 'Salvar'}
      successMessage={getSuccessMessage(message, sendsNow)}
      canSubmit={isDraftComplete(visibleDraft)}
      onSubmit={() => updateMessage(message, toMessageInput(visibleDraft))}
      onClose={onClose}
      maxWidth="sm"
    >
      {isSent && (
        <Alert severity="info">
          Esta mensagem já foi enviada. Você pode ajustar o texto e os destinatários do registro.
        </Alert>
      )}
      <MessageFields
        draft={visibleDraft}
        contacts={contacts}
        onChange={setDraft}
        lockDelivery={isSent}
      />
    </FormDialog>
  )
}
