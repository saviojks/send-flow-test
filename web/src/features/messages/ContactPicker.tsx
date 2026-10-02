import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { Autocomplete, Button, Checkbox, TextField, Typography } from '@mui/material'
import { formatPhone } from '../../lib/phone'
import type { Contact } from '../../types'

type ContactPickerProps = {
  contacts: Contact[]
  selectedIds: string[]
  onChange: (contactIds: string[]) => void
}

export const ContactPicker = ({ contacts, selectedIds, onChange }: ContactPickerProps) => {
  const selected = contacts.filter((contact) => selectedIds.includes(contact.id))
  const allSelected = contacts.length > 0 && selected.length === contacts.length

  return (
    <div className="flex flex-col gap-1">
      <Autocomplete
        multiple
        disableCloseOnSelect
        limitTags={4}
        options={contacts}
        value={selected}
        onChange={(_, value) => onChange(value.map((contact) => contact.id))}
        getOptionLabel={(contact) => contact.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        noOptionsText="Nenhum contato encontrado"
        renderOption={({ key, ...props }, contact, { selected: isSelected }) => (
          <li key={key} {...props}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              checked={isSelected}
              className="mr-2"
            />
            <div className="flex flex-col">
              <span>{contact.name}</span>
              <Typography variant="caption" color="text.secondary">
                {formatPhone(contact.phone)}
              </Typography>
            </div>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Contatos" placeholder={selected.length ? '' : 'Selecione'} />
        )}
      />
      <div className="flex items-center justify-between">
        <Typography variant="caption" color="text.secondary">
          {selected.length} de {contacts.length} selecionado(s)
        </Typography>
        <Button
          size="small"
          onClick={() => onChange(allSelected ? [] : contacts.map((contact) => contact.id))}
        >
          {allSelected ? 'Limpar seleção' : 'Selecionar todos'}
        </Button>
      </div>
    </div>
  )
}
