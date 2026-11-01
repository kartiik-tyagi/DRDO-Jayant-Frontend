import { Navigate } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'
import { ApexTransport } from '../../shared/ui/ApexTransport'
import { GameStateChip } from '../../shared/ui/GameStateChip'
import { Panel } from '../../shared/ui/Panel'
import { useSessionStore } from '../session/useSessionStore'

export default function ControlView() {
  const session = useSessionStore((state) => state.session)
  if (session?.position?.id !== 'apex') return <Navigate to="/situation" replace />

  return (
    <Panel
      title="Game control"
      subtitle="Only APEX can start, pause, resume, restart, or end the open game."
    >
      <Stack spacing={2}>
        <GameStateChip />
        <ApexTransport />
        <Typography variant="body2" color="text.secondary">
          {session.scenarioName} · {session.gameName}
        </Typography>
      </Stack>
    </Panel>
  )
}
