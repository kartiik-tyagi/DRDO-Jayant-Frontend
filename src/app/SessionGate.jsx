import { useEffect } from 'react'
import { Box } from '@mui/material'
import { useSessionStore } from '../features/session/useSessionStore'
import { LoadingState } from '../shared/ui/LoadingState'

export function SessionGate({ children }) {
  const ready = useSessionStore((state) => state.ready)
  const restore = useSessionStore((state) => state.restore)

  useEffect(() => {
    restore()
  }, [restore])

  if (!ready) {
    return (
      <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
        <LoadingState label="Restoring the session" />
      </Box>
    )
  }

  return children
}
