import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import { useState } from 'react'

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'slotProps'>

export const PasswordField = (props: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setVisible((current) => !current)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
