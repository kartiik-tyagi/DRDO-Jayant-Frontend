import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress, Alert } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import { loadConfig } from './config/loadConfig'
import { createAppTheme } from './theme/createAppTheme'
import AppRoutes from './layout/AppRoutes'

export default function App() {
  const [config, setConfig] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    loadConfig()
      .then((next) => {
        if (active) setConfig(next)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load configuration')
      })
    return () => {
      active = false
    }
  }, [])

  const theme = useMemo(
    () => (config ? createAppTheme(config.theme || {}) : null),
    [config],
  )

  if (error) {
    return (
      <Box sx={{ p: 4, fontFamily: 'Segoe UI, sans-serif' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!config || !theme) {
    return (
      <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes config={config} />
      </BrowserRouter>
    </ThemeProvider>
  )
}
