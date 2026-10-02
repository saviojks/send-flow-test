import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../features/auth/useAuth'
import { ROUTES } from '../routes'
import { FullScreenLoader } from './FullScreenLoader'

type RedirectState = { from?: string } | null

export const ProtectedRoute = () => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  return <Outlet />
}

export const PublicOnlyRoute = () => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const from = (location.state as RedirectState)?.from

  if (loading) return <FullScreenLoader />
  if (user) return <Navigate to={from ?? ROUTES.connections} replace />
  return <Outlet />
}
