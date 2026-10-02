import { Typography } from '@mui/material'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
    <div className="text-slate-400">{icon}</div>
    <Typography variant="subtitle1" className="font-semibold">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" className="max-w-sm">
      {description}
    </Typography>
    {action && <div className="mt-2">{action}</div>}
  </div>
)
