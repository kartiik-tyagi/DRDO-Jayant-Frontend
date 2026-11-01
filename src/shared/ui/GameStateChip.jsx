import { Chip } from '@mui/material'
import { statusLabel } from '../lib/gameStatus'
import { useSessionStore } from '../../features/session/useSessionStore'

const COLOR = {
  ready: 'info',
  running: 'success',
  paused: 'warning',
  ended: 'default',
}

export function GameStateChip() {
  const status = useSessionStore((state) => state.status)
  return <Chip label={statusLabel(status)} color={COLOR[status] || 'default'} size="small" />
}
