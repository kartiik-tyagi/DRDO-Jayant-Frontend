import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useSessionStore } from '../../features/session/useSessionStore'

export function ExerciseClock() {
  const epochMs = useSessionStore((state) => state.epochMs)
  const status = useSessionStore((state) => state.status)
  const tick = useSessionStore((state) => state.tick)

  useEffect(() => {
    if (status !== 'running') return undefined
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [status, tick])

  return (
    <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, flexShrink: 0 }}>
      <Typography variant="caption" display="block">
        Exercise time
      </Typography>
      <Typography variant="body2">
        {dayjs(epochMs).format('DD MMM YYYY HH:mm:ss')}
      </Typography>
    </Box>
  )
}
