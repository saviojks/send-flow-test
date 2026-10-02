import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Card, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import { formatDateTime, pluralize } from '../../lib/format'
import type { Contact, Message, MessageStatus } from '../../types'

const STATUS_CHIP: Record<MessageStatus, { label: string; color: 'warning' | 'success' }> = {
  scheduled: { label: 'Agendada', color: 'warning' },
  sent: { label: 'Enviada', color: 'success' },
}

const MAX_VISIBLE_RECIPIENTS = 3

const describeDelivery = (message: Message) =>
  message.status === 'sent'
    ? `Enviada em ${formatDateTime(message.sentAt ?? message.updatedAt)}`
    : `Agendada para ${message.scheduledAt ? formatDateTime(message.scheduledAt) : '—'}`

const describeRecipients = (message: Message, contactsById: Map<string, Contact>) => {
  const names = message.contactIds.map((id) => contactsById.get(id)?.name ?? 'Contato removido')
  const visible = names.slice(0, MAX_VISIBLE_RECIPIENTS).join(', ')
  const hidden = names.length - MAX_VISIBLE_RECIPIENTS
  return hidden > 0 ? `${visible} e mais ${hidden}` : visible
}

type MessageCardProps = {
  message: Message
  contactsById: Map<string, Contact>
  onEdit: () => void
  onDelete: () => void
}

export const MessageCard = ({ message, contactsById, onEdit, onDelete }: MessageCardProps) => {
  const status = STATUS_CHIP[message.status]

  return (
    <Card className="flex flex-col gap-3 border border-slate-200 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Chip size="small" label={status.label} color={status.color} variant="outlined" />
        <Typography variant="caption" color="text.secondary">
          {describeDelivery(message)}
        </Typography>
        <div className="ml-auto flex">
          <Tooltip title="Editar">
            <IconButton size="small" onClick={onEdit} aria-label="Editar mensagem">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" onClick={onDelete} aria-label="Excluir mensagem">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <Typography className="whitespace-pre-wrap wrap-break-word">{message.body}</Typography>

      <Typography variant="caption" color="text.secondary">
        {pluralize(message.contactIds.length, 'destinatário', 'destinatários')}:{' '}
        {describeRecipients(message, contactsById)}
      </Typography>
    </Card>
  )
}
