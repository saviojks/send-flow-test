import ScheduleIcon from '@mui/icons-material/Schedule'
import SendIcon from '@mui/icons-material/Send'
import { TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import type { Contact } from '../../types'
import { ContactPicker } from './ContactPicker'
import { MAX_BODY_LENGTH, type DeliveryMode, type MessageDraft } from './draft'

type MessageFieldsProps = {
  draft: MessageDraft
  contacts: Contact[]
  onChange: (draft: MessageDraft) => void
  /** Sent messages keep their delivery data; only the content can change. */
  lockDelivery?: boolean
}

export const MessageFields = ({ draft, contacts, onChange, lockDelivery = false }: MessageFieldsProps) => {
  const update = (changes: Partial<MessageDraft>) => onChange({ ...draft, ...changes })

  return (
    <div className="flex flex-col gap-4">
      <ContactPicker
        contacts={contacts}
        selectedIds={draft.contactIds}
        onChange={(contactIds) => update({ contactIds })}
      />

      <TextField
        label="Mensagem"
        multiline
        minRows={3}
        maxRows={10}
        value={draft.body}
        onChange={(event) => update({ body: event.target.value })}
        slotProps={{ htmlInput: { maxLength: MAX_BODY_LENGTH } }}
        helperText={`${draft.body.length}/${MAX_BODY_LENGTH}`}
        required
      />

      {!lockDelivery && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <ToggleButtonGroup
            exclusive
            size="small"
            color="primary"
            value={draft.mode}
            onChange={(_, mode: DeliveryMode | null) => mode && update({ mode })}
            className="shrink-0"
          >
            <ToggleButton value="now" className="gap-1 px-3">
              <SendIcon fontSize="small" /> Enviar agora
            </ToggleButton>
            <ToggleButton value="schedule" className="gap-1 px-3">
              <ScheduleIcon fontSize="small" /> Agendar
            </ToggleButton>
          </ToggleButtonGroup>

          {draft.mode === 'schedule' && (
            <DateTimePicker
              label="Data e horário do envio"
              value={draft.scheduledAt}
              onChange={(scheduledAt) => update({ scheduledAt })}
              disablePast
              ampm={false}
              className="w-full sm:max-w-xs"
              slotProps={{ textField: { size: 'small', required: true } }}
            />
          )}
        </div>
      )}
    </div>
  )
}
