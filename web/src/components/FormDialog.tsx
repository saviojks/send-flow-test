import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useState, type ReactNode, type SubmitEvent } from 'react'
import { getErrorMessage } from '../lib/errors'
import { useNotify } from './notifications'

type FormDialogProps = {
  title: string
  submitLabel: string
  successMessage: string
  canSubmit: boolean
  onSubmit: () => Promise<unknown>
  onClose: () => void
  children: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md'
}

export const FormDialog = ({
  title,
  submitLabel,
  successMessage,
  canSubmit,
  onSubmit,
  onClose,
  children,
  maxWidth = 'xs',
}: FormDialogProps) => {
  const notify = useNotify()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await onSubmit()
      notify(successMessage)
      onClose()
    } catch (error) {
      notify(getErrorMessage(error), 'error')
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onClose={submitting ? undefined : onClose} maxWidth={maxWidth} fullWidth>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 pt-2">{children}</div>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" loading={submitting} disabled={!canSubmit}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
