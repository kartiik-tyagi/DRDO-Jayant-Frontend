import { createTheme } from '@mui/material/styles'

export function createAppTheme(themeConfig = {}) {
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
      h4: { fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)', fontWeight: 600 },
      h5: { fontSize: 'clamp(1.25rem, 1.8vw, 1.75rem)', fontWeight: 600 },
      h6: { fontSize: 'clamp(1.05rem, 1.3vw, 1.25rem)', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: { root: { minHeight: 44, textTransform: 'none' } },
      },
      MuiIconButton: {
        styleOverrides: { root: { minHeight: 44, minWidth: 44 } },
      },
      MuiListItemButton: {
        styleOverrides: { root: { minHeight: 44 } },
      },
    },
  })
}
