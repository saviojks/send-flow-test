import AddIcon from '@mui/icons-material/Add'
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchIcon from '@mui/icons-material/Search'
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import { useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { EmptyState } from '../../components/EmptyState'
import { getErrorMessage } from '../../lib/errors'
import { deleteContact } from '../../lib/firestore/contacts'
import { formatPhone } from '../../lib/phone'
import type { Contact } from '../../types'
import { ContactFormDialog } from './ContactFormDialog'
import { useContacts } from './useContacts'

type DialogState =
  | { type: 'create' }
  | { type: 'edit'; contact: Contact }
  | { type: 'delete'; contact: Contact }
  | null

const matchesSearch = (contact: Contact, search: string) => {
  const term = search.toLowerCase()
  if (!term) return true
  const digits = term.replace(/\D/g, '')
  return contact.name.toLowerCase().includes(term) || (digits !== '' && contact.phone.includes(digits))
}

export const ContactsPanel = ({ connectionId }: { connectionId: string }) => {
  const { contacts, loading, error } = useContacts(connectionId)
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<DialogState>(null)
  const closeDialog = () => setDialog(null)
  const visibleContacts = contacts.filter((contact) => matchesSearch(contact, search))

  const createButton = (
    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ type: 'create' })}>
      Novo contato
    </Button>
  )

  const renderContent = () => {
    if (loading) return <Skeleton variant="rounded" height={200} />
    if (error) return <Alert severity="error">{getErrorMessage(error)}</Alert>
    if (contacts.length === 0) {
      return (
        <EmptyState
          icon={<ContactsOutlinedIcon fontSize="large" />}
          title="Nenhum contato encontrado"
          description="Adicione contatos"
          action={createButton}
        />
      )
    }
    return (
      <TableContainer component={Paper} className="border border-slate-200">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleContacts.map((contact) => (
              <TableRow key={contact.id} hover>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="whitespace-nowrap">{formatPhone(contact.phone)}</TableCell>
                <TableCell align="right" className="whitespace-nowrap">
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => setDialog({ type: 'edit', contact })}
                      aria-label={`Editar ${contact.name}`}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      size="small"
                      onClick={() => setDialog({ type: 'delete', contact })}
                      aria-label={`Excluir ${contact.name}`}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {visibleContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" className="py-6 text-slate-500">
                  Nenhum contato encontrado para “{search}”.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {contacts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <TextField
            size="small"
            placeholder="Buscar por nome ou telefone"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-sm flex-1"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <div className="ml-auto">{createButton}</div>
        </div>
      )}

      {renderContent()}

      {dialog?.type === 'create' && (
        <ContactFormDialog connectionId={connectionId} onClose={closeDialog} />
      )}
      {dialog?.type === 'edit' && (
        <ContactFormDialog connectionId={connectionId} contact={dialog?.contact} onClose={closeDialog} />
      )}
      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Excluir contato?"
          description={
            <>
              O contato <strong>{dialog?.contact?.name}</strong> será removido desta conexão.
            </>
          }
          successMessage="Contato excluído"
          onConfirm={() => deleteContact(dialog?.contact?.id)}
          onClose={closeDialog}
        />
      )}
    </div>
  )
}
