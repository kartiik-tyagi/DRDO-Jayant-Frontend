import { createTheme } from '@mui/material/styles'

export function createAppTheme(themeConfig) {
  const mode = themeConfig.mode === 'light' ? 'light' : 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: themeConfig.primary,
        contrastText: themeConfig.primaryContrast,
      },
      secondary: {
        main: themeConfig.secondary,
        contrastText: themeConfig.secondaryContrast,
      },
      background: {
        default: themeConfig.backgroundDefault,
        paper: themeConfig.backgroundPaper,
      },
      text: {
        primary: themeConfig.textPrimary,
        secondary: themeConfig.textSecondary,
      },
      divider: themeConfig.divider,
      error: { main: themeConfig.error, contrastText: themeConfig.errorContrast },
      warning: { main: themeConfig.warning, contrastText: themeConfig.warningContrast },
      success: { main: themeConfig.success, contrastText: themeConfig.successContrast },
      info: { main: themeConfig.info, contrastText: themeConfig.infoContrast },
    },
    shape: {
      borderRadius: themeConfig.borderRadius,
    },
    typography: {
      fontFamily: themeConfig.fontFamily,
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
          body: { color: themeConfig.textPrimary, backgroundColor: themeConfig.backgroundDefault },
        },
      },
      MuiButton: {
        styleOverrides: { root: { minHeight: 40, textTransform: 'none', fontWeight: 500 } },
      },
      MuiIconButton: {
        styleOverrides: { root: { minHeight: 40, minWidth: 40 } },
      },
      MuiListItemButton: {
        styleOverrides: { root: { minHeight: 40, color: themeConfig.textPrimary } },
      },
      MuiInputLabel: {
        styleOverrides: { root: { color: themeConfig.textSecondary } },
      },
      MuiFormLabel: {
        styleOverrides: { root: { color: themeConfig.textSecondary } },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { color: themeConfig.textPrimary },
          notchedOutline: { borderColor: themeConfig.divider },
        },
      },
    },
  })
}
