import type { AlertColor } from '@mui/material'
import { createContext, use } from 'react'

export type Notify = (message: string, severity?: AlertColor) => void

export const NotificationContext = createContext<Notify>(() => {})

export const useNotify = () => use(NotificationContext)
