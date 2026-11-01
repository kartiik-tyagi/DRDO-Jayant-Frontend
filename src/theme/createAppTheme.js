import { createTheme } from '@mui/material/styles'

export function createAppTheme(themeConfig) {
  return createTheme({
    palette: {
      mode: themeConfig.mode === 'light' ? 'light' : 'dark',
      primary: { main: themeConfig.primary || '#1f6b45' },
      secondary: { main: themeConfig.secondary || '#d4b15a' },
      background: {
        default: themeConfig.backgroundDefault || '#0d1411',
        paper: themeConfig.backgroundPaper || '#16211c',
      },
    },
    shape: {
      borderRadius: Number(themeConfig.borderRadius) || 8,
    },
    typography: {
      fontFamily: themeConfig.fontFamily || '"Roboto", "Segoe UI", sans-serif',
    },
  })
}
