import { useEffect } from 'react'
import { Tooltip, Typography } from '@mui/material'
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

  const full = dayjs(epochMs).format('DD MMM YYYY HH:mm:ss')
  const short = dayjs(epochMs).format('DD MMM HH:mm:ss')

  return (
    <Tooltip title={`Exercise time ${full}`}>
      <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', color: 'text.primary', whiteSpace: 'nowrap' }}>
        {short}
      </Typography>
    </Tooltip>
  )
}
