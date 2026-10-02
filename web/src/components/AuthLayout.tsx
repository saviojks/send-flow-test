import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => (
  <div className="flex min-h-screen items-center justify-center bg-linear-to-br to-teal-50 px-4">
    <Paper className="w-full max-w-md border border-slate-200 p-8">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <ConnectWithoutContactIcon color="primary" fontSize="large" />
        <Typography variant="h5" component="h1" className="font-bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </div>
      {children}
      <div className="mt-6 text-center">{footer}</div>
    </Paper>
  </div>
)
