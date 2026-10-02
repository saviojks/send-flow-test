import { Alert, Button, Link, TextField, Typography } from '@mui/material'
import { useState, type SubmitEvent } from 'react'
import { Link as RouterLink } from 'react-router'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../components/PasswordField'
import { getAuthErrorMessage, signIn } from '../lib/auth'
import { ROUTES } from '../routes'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch (error) {
      setError(getAuthErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Gerencie suas mensagens"
      footer={
        <Typography variant="body2">
          Ainda não tem conta?{' '}
          <Link component={RouterLink} to={ROUTES.signUp}>
            Cadastre-se
          </Link>
        </Typography>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoFocus
        />
        <PasswordField
          label="Senha"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={submitting}
          disabled={!email || !password}
        >
          Entrar
        </Button>
      </form>
    </AuthLayout>
  )
}
