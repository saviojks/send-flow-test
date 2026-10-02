import ScheduleSendIcon from '@mui/icons-material/ScheduleSend'
import SendIcon from '@mui/icons-material/Send'
import { Button, Paper, Typography } from '@mui/material'
import { useState, type SubmitEvent } from 'react'
import { useNotify } from '../../components/notifications'
import { getErrorMessage } from '../../lib/errors'
import { createMessage } from '../../lib/firestore/messages'
import type { Contact } from '../../types'
import { useCurrentUser } from '../auth/useAuth'
import { emptyDraft, isDraftComplete, toMessageInput } from './draft'
import { MessageFields } from './MessageFields'

type MessageComposerProps = {
  connectionId: string
  contacts: Contact[]
}

export const MessageComposer = ({ connectionId, contacts }: MessageComposerProps) => {
  const { uid } = useCurrentUser()
  const notify = useNotify()
  const [draft, setDraft] = useState(emptyDraft)
  const [submitting, setSubmitting] = useState(false)
  const isScheduling = draft.mode === 'schedule'

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await createMessage(uid, connectionId, toMessageInput(draft))
      notify(isScheduling ? 'Mensagem agendada' : 'Mensagem enviada')
      setDraft(emptyDraft())
    } catch (error) {
      notify(getErrorMessage(error), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 border border-slate-200 p-4 sm:p-6"
    >
      <Typography variant="subtitle1" component="h2" className="font-semibold">
        Nova mensagem
      </Typography>

      <MessageFields draft={draft} contacts={contacts} onChange={setDraft} />

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={submitting}
          disabled={!isDraftComplete(draft)}
          startIcon={isScheduling ? <ScheduleSendIcon /> : <SendIcon />}
        >
          {isScheduling ? 'Agendar envio' : 'Enviar agora'}
        </Button>
      </div>
    </Paper>
  )
}
