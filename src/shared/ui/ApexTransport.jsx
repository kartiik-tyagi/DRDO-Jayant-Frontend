import { Button, Stack } from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'

export function ApexTransport() {
  const status = useSessionStore((state) => state.status)
  const start = useSessionStore((state) => state.start)
  const pause = useSessionStore((state) => state.pause)
  const resume = useSessionStore((state) => state.resume)
  const restart = useSessionStore((state) => state.restart)
  const end = useSessionStore((state) => state.end)

  const actions = [
    { id: 'start', label: 'Start', onClick: start, disabled: status === 'running' || status === 'paused' },
    { id: 'pause', label: 'Pause', onClick: pause, disabled: status !== 'running' },
    { id: 'resume', label: 'Resume', onClick: resume, disabled: status !== 'paused' },
    { id: 'restart', label: 'Restart', onClick: restart, disabled: status === 'ready' },
    { id: 'end', label: 'End', onClick: end, disabled: status === 'ready' || status === 'ended' },
  ]

  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.id === 'start' ? 'contained' : 'outlined'}
          color={action.id === 'end' ? 'warning' : 'primary'}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  )
}
