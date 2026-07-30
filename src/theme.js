import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0A0E12', // Dark background chuẩn Figma
      paper: '#121920',
      sidebar: '#0C1217',
    },
    primary: {
      main: '#00F2FF', // Cyan Accent
      contrastText: '#000000',
    },
    secondary: {
      main: '#F47D20', // Orange Accent
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#64748B',
      active: '#00F2FF',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A0E12',
          color: '#E2E8F0',
          scrollbarWidth: 'thin',
        },
      },
    },
  },
})

export default theme