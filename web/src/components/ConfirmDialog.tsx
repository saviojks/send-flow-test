import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useState, type ReactNode } from 'react'
import { getErrorMessage } from '../lib/errors'
import { useNotify } from './notifications'

type ConfirmDialogProps = {
  title: string
  description: ReactNode
  confirmLabel?: string
  successMessage: string
  onConfirm: () => Promise<unknown>
  onClose: () => void
}

export const ConfirmDialog = ({
  title,
  description,
  confirmLabel = 'Excluir',
  successMessage,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  const notify = useNotify()
  const [running, setRunning] = useState(false)

  const handleConfirm = async () => {
    setRunning(true)
    try {
      await onConfirm()
      notify(successMessage)
      onClose()
    } catch (error) {
      notify(getErrorMessage(error), 'error')
      setRunning(false)
    }
  }

  return (
    <Dialog open onClose={running ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{description}</DialogContentText>
      </DialogContent>
      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose} disabled={running} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} loading={running} variant="contained" color="error">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
