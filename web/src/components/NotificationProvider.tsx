import { Alert, Snackbar, type AlertColor } from '@mui/material'
import { useCallback, useState, type ReactNode } from 'react'
import { NotificationContext, type Notify } from './notifications'

type Notification = {
  id: number
  message: string
  severity: AlertColor
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null)
  const [open, setOpen] = useState(false)

  const notify = useCallback<Notify>((message, severity = 'success') => {
    setNotification({ id: Date.now(), message, severity })
    setOpen(true)
  }, [])

  return (
    <NotificationContext value={notify}>
      {children}
      <Snackbar
        key={notification?.id}
        open={open}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          variant="filled"
          severity={notification?.severity ?? 'info'}
          onClose={() => setOpen(false)}
          className="w-full"
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext>
  )
}
