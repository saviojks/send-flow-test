import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'
import LogoutIcon from '@mui/icons-material/Logout'
import { AppBar, Avatar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { Link, Outlet } from 'react-router'
import { useCurrentUser } from '../features/auth/useAuth'
import { signOut } from '../lib/auth'
import { ROUTES } from '../routes'

const getInitial = (value: string | null) => (value?.[0] ?? '?').toUpperCase()

export const AppLayout = () => {
  const user = useCurrentUser()
  const label = user.displayName || user.email

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar position="sticky" color="inherit" className="border-b border-slate-200">
        <Toolbar className="mx-auto w-full max-w-5xl gap-3">
          <Link to={ROUTES.connections} className="flex items-center gap-2 text-inherit no-underline">
            <ConnectWithoutContactIcon color="primary" />
            <Typography variant="h6" component="span" className="font-bold">
              Send Flow Test
            </Typography>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Avatar className="h-8 w-8 text-sm">{getInitial(label)}</Avatar>
            <Typography variant="body2" className="hidden sm:block" color="text.secondary">
              {label}
            </Typography>
            <Tooltip title="Sair">
              <IconButton onClick={signOut} aria-label="Sair">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
