import { createTheme } from '@mui/material/styles'

export function createAppTheme(themeConfig = {}) {
  const mode = themeConfig.mode === 'light' ? 'light' : 'dark'
  const textPrimary = themeConfig.textPrimary || (mode === 'light' ? '#1c1914' : '#e8f0ea')
  const textSecondary = themeConfig.textSecondary || (mode === 'light' ? '#5c564c' : '#b7c6bd')
  const divider = themeConfig.divider || (mode === 'light' ? 'rgba(28, 25, 20, 0.14)' : 'rgba(232, 240, 234, 0.16)')

  return createTheme({
    palette: {
      mode,
      primary: {
        main: themeConfig.primary || '#3caf72',
        contrastText: themeConfig.primaryContrast || '#062116',
      },
      secondary: {
        main: themeConfig.secondary || '#d4b15a',
        contrastText: themeConfig.secondaryContrast || '#1c1914',
      },
      background: {
        default: themeConfig.backgroundDefault || '#0d1411',
        paper: themeConfig.backgroundPaper || '#16211c',
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      divider,
    },
    shape: {
      borderRadius: Number(themeConfig.borderRadius) || 8,
    },
    typography: {
      fontFamily: themeConfig.fontFamily || '"Roboto", "Segoe UI", sans-serif',
      h4: { fontSize: 'clamp(1.5rem, 2.4vw, 2.125rem)', fontWeight: 600 },
      h5: { fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)', fontWeight: 600 },
      h6: { fontSize: '1.05rem', fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      body2: { lineHeight: 1.45 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { color: textPrimary, backgroundColor: themeConfig.backgroundDefault || '#0d1411' },
        },
      },
      MuiButton: {
        styleOverrides: { root: { minHeight: 40, textTransform: 'none', fontWeight: 500 } },
      },
      MuiIconButton: {
        styleOverrides: { root: { minHeight: 40, minWidth: 40 } },
      },
      MuiListItemButton: {
        styleOverrides: { root: { minHeight: 40, color: textPrimary } },
      },
      MuiInputLabel: {
        styleOverrides: { root: { color: textSecondary } },
      },
      MuiFormLabel: {
        styleOverrides: { root: { color: textSecondary } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { color: textPrimary },
          notchedOutline: { borderColor: divider },
        },
      },
    },
  })
}
