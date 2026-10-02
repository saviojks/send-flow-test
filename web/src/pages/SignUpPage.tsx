import { Alert, Button, Link, TextField, Typography } from '@mui/material'
import { useState, type SubmitEvent } from 'react'
import { Link as RouterLink } from 'react-router'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../components/PasswordField'
import { getAuthErrorMessage, signUp } from '../lib/auth'
import { ROUTES } from '../routes'

const MIN_PASSWORD_LENGTH = 6

export const SignUpPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH
  const passwordsDiffer = confirmation.length > 0 && confirmation !== password
  const canSubmit =
    name && email && password.length >= MIN_PASSWORD_LENGTH && confirmation === password

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    setError(null)
    setSubmitting(true)
    try {
      await signUp({ name, email, password })
    } catch (caught) {
      setError(getAuthErrorMessage(caught))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Gerencie suas mensagens"
      footer={
        <Typography variant="body2">
          Já tem conta?{' '}
          <Link component={RouterLink} to={ROUTES.login}>
            Entrar
          </Link>
        </Typography>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Nome"
          autoComplete="organization"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoFocus
        />
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <PasswordField
          id="password"
          label="Senha"
          placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordTooShort}
          required
        />
        <PasswordField
          id="confirmation"
          placeholder="Confirme a senha"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          error={passwordsDiffer}
          helperText="As senhas precisam ser iguais"
          required
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={submitting}
          disabled={!canSubmit}
        >
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  )
}
