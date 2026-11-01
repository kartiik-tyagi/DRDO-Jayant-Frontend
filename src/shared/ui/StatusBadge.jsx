import { Box, Typography } from '@mui/material'
import { useDirectoryStore } from '../../features/directory/useDirectoryStore'
import { useSessionStore } from '../../features/session/useSessionStore'

export function StatusBadge() {
  const flags = useDirectoryStore((state) => state.data?.flags)
  const stream = useDirectoryStore((state) => state.data?.stream)
  const replay = useDirectoryStore((state) => state.data?.replay)
  const demo = useSessionStore((state) => state.session?.demoMode)
  const showDemo = flags ? flags.demoMode : demo
  if (!flags?.statusBadge && !showDemo) return null
  const label = replay ? 'Replay' : stream?.status === 'live' ? 'Live' : 'Offline'
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
      {flags?.statusBadge ? (
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
          {label}
        </Typography>
      ) : null}
      {showDemo ? (
        <Typography variant="caption" color="primary.main" sx={{ letterSpacing: '0.08em' }}>
          Demo
        </Typography>
      ) : null}
    </Box>
  )
}
