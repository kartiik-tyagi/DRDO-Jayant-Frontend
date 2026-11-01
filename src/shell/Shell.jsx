import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LoginPage from '../features/login/LoginPage'
import CommandView from '../features/command/CommandView'
import PlansView from '../features/plans/PlansView'
import { useSessionStore } from '../features/session/useSessionStore'
import { statusLabel } from '../shared/lib/gameStatus'
import { flatten } from '../shared/lib/tree'
import { ApexTransport } from '../shared/ui/ApexTransport'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { MapStage } from '../shared/ui/MapStage'
import { Panel } from '../shared/ui/Panel'
import { LAYOUT_ID, LAYOUT_NAME } from './meta'

function RequireSession() {
  const session = useSessionStore((state) => state.session)
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}

function GuestOnly() {
  const session = useSessionStore((state) => state.session)
  if (session) return <Navigate to="/" replace />
  return <LoginPage />
}

function ReviewPanel() {
  const session = useSessionStore((state) => state.session)
  const status = useSessionStore((state) => state.status)
  const nodes = flatten(session?.commandTree)
  const appointments = nodes.filter((node) => node.kind === 'appointment').length
  const assets = nodes.filter((node) => node.kind === 'asset').length

  return (
    <Panel title="Review" subtitle="A reading of this game. Performance measures come later.">
      <Stack spacing={1.25}>
        <GameStateChip />
        <Typography>{session.scenarioName}</Typography>
        <Typography>{session.gameName}</Typography>
        <Typography color="text.secondary">State: {statusLabel(status)}</Typography>
        <Typography color="text.secondary">
          {appointments} appointments and {assets} assets are in this playing view.
        </Typography>
      </Stack>
    </Panel>
  )
}

function CycleFrame() {
  const navigate = useNavigate()
  const session = useSessionStore((state) => state.session)
  const signOut = useSessionStore((state) => state.signOut)
  const [mode, setMode] = useState(() =>
    useSessionStore.getState().status === 'running' ? 'conduct' : 'plan',
  )
  const isApex = session?.position?.id === 'apex'

  useEffect(() => {
    document.title = `Layout ${LAYOUT_ID} · ${LAYOUT_NAME}`
  }, [])

  return (
    <Box sx={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar sx={{ gap: 1.5, flexWrap: 'wrap', py: 1 }}>
          <Chip label={`Layout ${LAYOUT_ID}`} size="small" color="secondary" />
          <Box sx={{ flex: 1, minWidth: 160 }}>
            <Typography variant="subtitle1" noWrap>
              {session.position.title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }} noWrap>
              {LAYOUT_NAME}
            </Typography>
          </Box>
          <ExerciseClock />
          <Tooltip title="Sign out">
            <IconButton
              color="inherit"
              aria-label="Sign out"
              onClick={() => {
                signOut()
                navigate('/login')
              }}
            >
              <LogoutOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {isApex ? (
        <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
          <ApexTransport />
        </Box>
      ) : null}

      <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={mode}
          onChange={(_, value) => {
            if (value) setMode(value)
          }}
          aria-label="Exercise phase"
        >
          <ToggleButton value="plan" sx={{ minHeight: 44 }}>
            Plan
          </ToggleButton>
          <ToggleButton value="conduct" sx={{ minHeight: 44 }}>
            Conduct
          </ToggleButton>
          <ToggleButton value="review" sx={{ minHeight: 44 }}>
            Review
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: mode === 'conduct' ? 'hidden' : 'auto',
          p: mode === 'conduct' ? 0 : { xs: 1.5, sm: 2 },
        }}
      >
        {mode === 'plan' ? (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.85fr' },
              alignItems: 'start',
            }}
          >
            <CommandView />
            <PlansView />
          </Box>
        ) : null}
        {mode === 'conduct' ? (
          <Box sx={{ height: '100%', minHeight: { xs: '70vh', sm: 0 } }}>
            <MapStage />
          </Box>
        ) : null}
        {mode === 'review' ? <ReviewPanel /> : null}
      </Box>
    </Box>
  )
}

export default function Shell() {
  useEffect(() => {
    document.title = `Layout ${LAYOUT_ID} · ${LAYOUT_NAME}`
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<GuestOnly />} />
      <Route element={<RequireSession />}>
        <Route path="*" element={<CycleFrame />} />
      </Route>
    </Routes>
  )
}
