import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Box, Button, Chip, Paper, Stack, Toolbar, Tooltip, Typography, IconButton } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LoginPage from '../features/login/LoginPage'
import PlansView from '../features/plans/PlansView'
import SituationView from '../features/situation/SituationView'
import { useSessionStore } from '../features/session/useSessionStore'
import { flatten } from '../shared/lib/tree'
import { ApexTransport } from '../shared/ui/ApexTransport'
import { CommandTree } from '../shared/ui/CommandTree'
import { EmptyState } from '../shared/ui/EmptyState'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { Inspector } from '../shared/ui/Inspector'
import { PositionBadge } from '../shared/ui/PositionBadge'
import { LAYOUT_ID, LAYOUT_NAME } from './meta'

const LINKS = [
  { label: 'Desk', path: '/desk' },
  { label: 'Situation', path: '/situation' },
  { label: 'Plans', path: '/plans' },
]

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

function DeskFrame() {
  const location = useLocation()
  const navigate = useNavigate()
  const session = useSessionStore((state) => state.session)
  const signOut = useSessionStore((state) => state.signOut)
  const fullBleed = location.pathname === '/situation'

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
              {LAYOUT_NAME}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }} noWrap>
              {session.scenarioName} · {session.gameName}
            </Typography>
          </Box>
          <GameStateChip />
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
        <Stack direction="row" spacing={1} sx={{ px: 2, pb: 1.25, overflow: 'auto' }}>
          {LINKS.map((link) => (
            <Button
              key={link.path}
              color="inherit"
              variant={location.pathname === link.path ? 'outlined' : 'text'}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </AppBar>
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: fullBleed ? 'hidden' : 'auto',
          p: fullBleed ? 0 : { xs: 1.5, sm: 2 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

function AppointmentCard({ node, selected, onSelect }) {
  return (
    <Paper
      component="button"
      type="button"
      onClick={() => onSelect(node.id)}
      sx={{
        textAlign: 'left',
        p: 2,
        width: '100%',
        color: 'inherit',
        font: 'inherit',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: selected ? 'secondary.main' : 'divider',
      }}
    >
      <Typography variant="h6">{node.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {node.service}
      </Typography>
      <Chip label="Appointment" size="small" color="primary" sx={{ mt: 1.5 }} />
    </Paper>
  )
}

function DeskPage() {
  const session = useSessionStore((state) => state.session)
  const selectedId = useSessionStore((state) => state.selectedId)
  const select = useSessionStore((state) => state.select)
  const isApex = session?.position?.id === 'apex'
  const root = session?.commandTree
  const appointments = (root?.children || []).filter((node) => node.kind === 'appointment')
  const assets = flatten(root).filter((node) => node.kind === 'asset')

  if (isApex) {
    return (
      <Stack spacing={2}>
        <PositionBadge position={session.position} />
        <Typography variant="h5">Exercise control</Typography>
        <Typography variant="body2" color="text.secondary">
          {session.playingNote}
        </Typography>
        <GameStateChip />
        <ApexTransport />
        <CommandTree root={root} selectedId={selectedId} onSelect={select} />
        <Inspector />
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <PositionBadge position={session.position} parentTitle={session.position.parentTitle} />
      <Typography variant="body2" color="text.secondary">
        {session.playingNote}
      </Typography>
      <Typography variant="h6">Below this appointment</Typography>
      {appointments.length === 0 ? (
        <EmptyState title="No subordinate appointments" message="This playing slice ends at this chair." />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', xl: 'repeat(3, 1fr)' },
          }}
        >
          {appointments.map((node) => (
            <AppointmentCard
              key={node.id}
              node={node}
              selected={node.id === selectedId}
              onSelect={select}
            />
          ))}
        </Box>
      )}
      {assets.length > 0 ? (
        <Box>
          <Typography variant="overline" color="text.secondary">
            Assets held here
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 1 }}>
            {assets.map((asset) => (
              <Button
                key={asset.id}
                variant={asset.id === selectedId ? 'contained' : 'outlined'}
                color="inherit"
                onClick={() => select(asset.id)}
              >
                {asset.title}
              </Button>
            ))}
          </Stack>
        </Box>
      ) : null}
      <Paper variant="outlined">
        <Inspector />
      </Paper>
    </Stack>
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
        <Route element={<DeskFrame />}>
          <Route index element={<Navigate to="/desk" replace />} />
          <Route path="desk" element={<DeskPage />} />
          <Route path="situation" element={<SituationView />} />
          <Route path="plans" element={<PlansView />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
