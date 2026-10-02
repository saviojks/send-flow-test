import { TextField } from '@mui/material'
import { useState } from 'react'
import { FormDialog } from '../../components/FormDialog'
import { createConnection, updateConnection } from '../../lib/firestore/connections'
import type { Connection } from '../../types'
import { useCurrentUser } from '../auth/useAuth'

type ConnectionFormDialogProps = {
  connection?: Connection
  onClose: () => void
}

export const ConnectionFormDialog = ({ connection, onClose }: ConnectionFormDialogProps) => {
  const { uid } = useCurrentUser()
  const [name, setName] = useState(connection?.name ?? '')
  const isEditing = Boolean(connection)

  const submit = () =>
    connection ? updateConnection(connection.id, { name }) : createConnection(uid, { name })

  const canSubmit = name.length > 0 && name !== connection?.name

  return (
    <FormDialog
      title={isEditing ? 'Editar conexão' : 'Nova conexão'}
      submitLabel={isEditing ? 'Salvar' : 'Criar'}
      successMessage={isEditing ? 'Conexão atualizada' : 'Conexão criada'}
      canSubmit={canSubmit}
      onSubmit={submit}
      onClose={onClose}
    >
      <TextField
        label="Nome"
        placeholder="Ex.: WhatsApp"
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoFocus
        required
      />
    </FormDialog>
  )
}
