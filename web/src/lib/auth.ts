import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from './firebase'

export type SignUpInput = {
  name: string
  email: string
  password: string
}

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const signUp = async ({ name, email, password }: SignUpInput) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName: name })
  return credential
}

export const signOut = () => firebaseSignOut(auth)

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
  'auth/network-request-failed': 'Falha de rede. Verifique sua conexão.',
}

export const getAuthErrorMessage = (error: unknown): string =>
  (error instanceof FirebaseError && AUTH_ERROR_MESSAGES[error.code]) ||
  'Não foi possível concluir a operação. Tente novamente.'
