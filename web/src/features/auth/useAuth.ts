import type { User } from 'firebase/auth'
import { use } from 'react'
import { AuthContext } from './AuthContext'

export const useAuth = () => use(AuthContext)

export const useCurrentUser = (): User => {
  const { user } = useAuth()
  if (!user) throw new Error('useCurrentUser must be used inside a protected route')
  return user
}
