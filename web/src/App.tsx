import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './components/AppLayout'
import { FullScreenLoader } from './components/FullScreenLoader'
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards'
import { ROUTES } from './routes'

const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const SignUpPage = lazy(() => import('./pages/SignUpPage').then((m) => ({ default: m.SignUpPage })))
const ConnectionsPage = lazy(() =>
  import('./pages/ConnectionsPage').then((m) => ({ default: m.ConnectionsPage })),
)
const ConnectionDetailPage = lazy(() =>
  import('./pages/ConnectionDetailPage').then((m) => ({ default: m.ConnectionDetailPage })),
)

const App = () => (
  <Suspense fallback={<FullScreenLoader />}>
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.signUp} element={<SignUpPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.connections} element={<ConnectionsPage />} />
          <Route path={`${ROUTES.connections}/:connectionId`} element={<ConnectionDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.connections} replace />} />
    </Routes>
  </Suspense>
)

export default App
