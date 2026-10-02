import { FirebaseError } from 'firebase/app'

const FIRESTORE_ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'Permissão negada',
  unavailable: 'Serviço indisponível!',
  'failed-precondition': 'Operação não permitida!',
  'not-found': 'Registro não encontrado!',
}

const VALIDATION_ERROR = 'ValidationError'

export const validationError = (message: string): Error =>
  Object.assign(new Error(message), { name: VALIDATION_ERROR })

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.name === VALIDATION_ERROR) return error.message
  return (
    (error instanceof FirebaseError && FIRESTORE_ERROR_MESSAGES[error.code]) ||
    'Algo deu errado! Tente novamente.'
  )
}
