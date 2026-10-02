export const ROUTES = {
  login: '/login',
  signUp: '/sign-up',
  connections: '/connections',
}

export const connectionPath = (connectionId: string) => `${ROUTES.connections}/${connectionId}`
