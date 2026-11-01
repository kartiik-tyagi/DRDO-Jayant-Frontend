import { Button, Stack, Typography } from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'

export function RoleOptions({ onAction, direction = 'column' }) {
  const options = useSessionStore((state) => state.session?.options || [])
  return (
    <Stack spacing={1} direction={direction} useFlexGap sx={{ flexWrap: 'wrap' }}>
      {direction === 'column' ? <Typography variant="overline">Options</Typography> : null}
      {options.map((option) => (
        <Button key={option.id} variant="outlined" onClick={() => onAction?.(option.id)}>
          {option.label}
        </Button>
      ))}
    </Stack>
  )
}
