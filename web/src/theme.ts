import { ptBR } from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'
import { ptBR as datePickersPtBR } from '@mui/x-date-pickers/locales'

export const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: { main: '#b3b31b' },
      secondary: { main: '#2dd4e3' },
      background: { default: '#f5f5f5' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiPaper: { defaultProps: { elevation: 0 } },
      MuiTextField: { defaultProps: { fullWidth: true } },
    },
  },
  ptBR,
  datePickersPtBR,
)
