import { Box, Typography } from '@mui/material'
import { statusLabel } from '../lib/gameStatus'
import { useSessionStore } from '../../features/session/useSessionStore'

const COLOR = {
  ready: 'info.main',
  running: 'success.main',
  paused: 'warning.main',
  ended: 'text.disabled',
}

export function GameStateChip() {
  const status = useSessionStore((state) => state.status)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLOR[status] || 'info.main' }} />
      <Typography variant="body2" color="text.primary">
        {statusLabel(status)}
      </Typography>
    </Box>
  )
}
