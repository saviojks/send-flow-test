import { TextField } from '@mui/material'
import { useState } from 'react'
import { FormDialog } from '../../components/FormDialog'
import { createContact, updateContact } from '../../lib/firestore/contacts'
import { formatPhone, isValidPhone } from '../../lib/phone'
import type { Contact } from '../../types'
import { useCurrentUser } from '../auth/useAuth'

const MAX_NAME_LENGTH = 80

type ContactFormDialogProps = {
  connectionId: string
  contact?: Contact
  onClose: () => void
}

export const ContactFormDialog = ({ connectionId, contact, onClose }: ContactFormDialogProps) => {
  const { uid } = useCurrentUser()
  const [name, setName] = useState(contact?.name ?? '')
  const [phone, setPhone] = useState(contact ? formatPhone(contact.phone) : '')
  const isEditing = Boolean(contact)
  const phoneInvalid = phone.length > 0 && !isValidPhone(phone)

  const submit = () => {
    const input = { name, phone }
    return contact ? updateContact(contact.id, input) : createContact(uid, connectionId, input)
  }
  const canSubmit = name.length > 0 && isValidPhone(phone)

  return (
    <FormDialog
      title={isEditing ? 'Editar contato' : 'Novo contato'}
      submitLabel={isEditing ? 'Salvar' : 'Adicionar'}
      successMessage={isEditing ? 'Contato atualizado' : 'Contato adicionado'}
      canSubmit={canSubmit}
      onSubmit={submit}
      onClose={onClose}
    >
      <TextField
        label="Nome"
        value={name}
        onChange={(event) => setName(event.target.value)}
        slotProps={{ htmlInput: { maxLength: MAX_NAME_LENGTH } }}
        autoFocus
        required
      />
      <TextField
        label="Telefone"
        placeholder="(11) 91234-5678 ou +5511912345678"
        type="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        error={phoneInvalid}
        helperText={phoneInvalid ? 'Informe de 8 a 15 dígitos, com DDI opcional (+)' : ' '}
        required
      />
    </FormDialog>
  )
}
