import AddIcon from '@mui/icons-material/Add'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import { Alert, Button, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { useCurrentUser } from '../features/auth/useAuth'
import { ConnectionCard } from '../features/connections/ConnectionCard'
import { ConnectionFormDialog } from '../features/connections/ConnectionFormDialog'
import { useConnections } from '../features/connections/useConnections'
import { getErrorMessage } from '../lib/errors'
import { deleteConnection } from '../lib/firestore/connections'
import type { Connection } from '../types'
import { skeletonArray } from '../utils'

type DialogState =
  | { type: 'create' }
  | { type: 'edit'; connection: Connection }
  | { type: 'delete'; connection: Connection }
  | null

export const ConnectionsPage = () => {
  const { uid } = useCurrentUser()
  const { connections, loading, error } = useConnections()
  const [dialog, setDialog] = useState<DialogState>(null)
  const closeDialog = () => setDialog(null)

  const createButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ type: 'create' })}>
      Nova conexão
    </Button>
  )

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Typography variant="h5" component="h1" className="font-bold">
            Conexões
          </Typography>
        </div>
        {connections.length > 0 && createButton}
      </header>

      {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {skeletonArray(6).map((item) => (
            <Skeleton key={item} variant="rounded" height={76} />
          ))}
        </div>
      ) : connections.length === 0 && !error ? (
        <EmptyState
          icon={<HubOutlinedIcon fontSize="large" />}
          title="Nenhuma conexão ainda"
          description="Crie sua primeira conexão"
          action={createButton}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onEdit={() => setDialog({ type: 'edit', connection })}
              onDelete={() => setDialog({ type: 'delete', connection })}
            />
          ))}
        </div>
      )}

      {dialog?.type === 'create' && <ConnectionFormDialog onClose={closeDialog} />}
      {dialog?.type === 'edit' && (
        <ConnectionFormDialog connection={dialog.connection} onClose={closeDialog} />
      )}
      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Excluir conexão?"
          description={
            <>
              A conexão <strong>{dialog.connection.name}</strong> será excluída junto com todos os seus
              contatos e mensagens. Esta ação não pode ser desfeita.
            </>
          }
          successMessage="Conexão excluída"
          onConfirm={() => deleteConnection(uid, dialog.connection.id)}
          onClose={closeDialog}
        />
      )}
    </div>
  )
}
