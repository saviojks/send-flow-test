import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import { Alert, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { EmptyState } from '../../components/EmptyState'
import { getErrorMessage } from '../../lib/errors'
import { deleteMessage } from '../../lib/firestore/messages'
import type { Message, MessageStatus } from '../../types'
import { skeletonArray } from '../../utils'
import { useContacts } from '../contacts/useContacts'
import { MessageCard } from './MessageCard'
import { MessageComposer } from './MessageComposer'
import { MessageEditDialog } from './MessageEditDialog'
import { useMessages } from './useMessages'

type StatusFilter = 'all' | MessageStatus

type DialogState = { type: 'edit' | 'delete'; messageId: string } | null

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'Todas',
  scheduled: 'Agendadas',
  sent: 'Enviadas',
}

const EMPTY_FILTER_TEXT: Record<StatusFilter, string> = {
  all: 'As mensagens enviadas e agendadas desta conexão aparecerão aqui.',
  scheduled: 'Nenhuma mensagem aguardando envio.',
  sent: 'Nenhuma mensagem enviada ainda.',
}

export const BroadcastPanel = ({ connectionId }: { connectionId: string }) => {
  const { contacts, loading: contactsLoading } = useContacts(connectionId)
  const { messages, loading: messagesLoading, error } = useMessages(connectionId)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [dialog, setDialog] = useState<DialogState>(null)
  const closeDialog = () => setDialog(null)

  const contactsById = new Map(contacts.map((contact) => [contact.id, contact]))
  const counts: Record<StatusFilter, number> = {
    all: messages.length,
    scheduled: messages.filter((message) => message.status === 'scheduled').length,
    sent: messages.filter((message) => message.status === 'sent').length,
  }
  const visibleMessages =
    filter === 'all' ? messages : messages.filter((message) => message.status === filter)
  const dialogMessage: Message | undefined = dialog
    ? messages.find((message) => message.id === dialog.messageId)
    : undefined

  const renderMessages = () => {
    if (messagesLoading) {
      return skeletonArray().map((item) => <Skeleton key={item} variant="rounded" height={110} />)
    }
    if (error) return <Alert severity="error">{getErrorMessage(error)}</Alert>
    if (visibleMessages.length === 0) {
      return (
        <EmptyState
          icon={<ForumOutlinedIcon fontSize="large" />}
          title="Nenhuma mensagem"
          description={EMPTY_FILTER_TEXT[filter]}
        />
      )
    }
    return visibleMessages.map((message) => (
      <MessageCard
        key={message.id}
        message={message}
        contactsById={contactsById}
        onEdit={() => setDialog({ type: 'edit', messageId: message.id })}
        onDelete={() => setDialog({ type: 'delete', messageId: message.id })}
      />
    ))
  }

  return (
    <div className="flex flex-col gap-6">
      {contactsLoading ? (
        <Skeleton variant="rounded" height={260} />
      ) : contacts.length === 0 ? (
        <Alert severity="info">
          Cadastre contatos na aba <strong>Contatos</strong> para enviar mensagens por esta conexão.
        </Alert>
      ) : (
        <MessageComposer connectionId={connectionId} contacts={contacts} />
      )}

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography variant="subtitle1" component="h2" className="font-semibold">
            Mensagens
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            color="primary"
            value={filter}
            onChange={(_, value: StatusFilter | null) => value && setFilter(value)}
            aria-label="Filtrar mensagens por status"
          >
            {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((value) => (
              <ToggleButton key={value} value={value} className="px-3">
                {FILTER_LABELS[value]} ({counts[value]})
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        {renderMessages()}
      </section>

      {dialog?.type === 'edit' && dialogMessage && (
        <MessageEditDialog message={dialogMessage} contacts={contacts} onClose={closeDialog} />
      )}
      {dialog?.type === 'delete' && dialogMessage && (
        <ConfirmDialog
          title="Excluir mensagem?"
          description={
            dialogMessage.status === 'scheduled'
              ? 'O agendamento será cancelado e a mensagem removida.'
              : 'A mensagem será removida do histórico.'
          }
          successMessage="Mensagem excluída"
          onConfirm={() => deleteMessage(dialogMessage.id)}
          onClose={closeDialog}
        />
      )}
    </div>
  )
}
