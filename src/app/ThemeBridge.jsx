import { useMemo } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useQuery } from '@tanstack/react-query'
import { getLoginContext } from '../shared/api/client'
import { createAppTheme } from '../shared/theme/createAppTheme'
import { loginPalette } from '../shared/theme/palettes'
import { useSessionStore } from '../features/session/useSessionStore'

export function ThemeBridge({ children }) {
  const sessionTheme = useSessionStore((state) => state.session?.theme)
  const context = useQuery({ queryKey: ['login-context'], queryFn: getLoginContext })
  const theme = useMemo(
    () => createAppTheme(sessionTheme || context.data?.theme || loginPalette),
    [sessionTheme, context.data],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
