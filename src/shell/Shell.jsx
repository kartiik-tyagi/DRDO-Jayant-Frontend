import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LoginPage from '../features/login/LoginPage'
import CommandView from '../features/command/CommandView'
import PlansView from '../features/plans/PlansView'
import { useSessionStore } from '../features/session/useSessionStore'
import { findNode } from '../shared/lib/tree'
import { ApexTransport } from '../shared/ui/ApexTransport'
import { DutyIcon } from '../shared/ui/DutyIcon'
import { EmptyState } from '../shared/ui/EmptyState'
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

function PictureFrame() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const session = useSessionStore((state) => state.session)
  const selectedId = useSessionStore((state) => state.selectedId)
  const signOut = useSessionStore((state) => state.signOut)
  const [panel, setPanel] = useState(null)
  const isApex = session?.position?.id === 'apex'
  const selected = findNode(session?.commandTree, selectedId)

  useEffect(() => {
    document.title = `Layout ${LAYOUT_ID} · ${LAYOUT_NAME}`
  }, [])

  const open = (name) => setPanel((current) => (current === name ? null : name))

  return (
    <Box sx={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', pb: isPhone ? '72px' : 0 }}>
      <AppBar position="static" elevation={0} color="primary">
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap', py: 1 }}>
          <Chip label={`Layout ${LAYOUT_ID}`} size="small" color="secondary" />
          <Box sx={{ flex: 1, minWidth: 140 }}>
            <Typography variant="subtitle1" noWrap>
              {session.position.title}
            </Typography>
            <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.85 }} noWrap>
              {LAYOUT_NAME} · {session.scenarioName}
            </Typography>
          </Box>
          <GameStateChip />
          <ExerciseClock />
          {isPhone ? null : (
            <>
              <Button color="inherit" onClick={() => open('command')}>
                Command
              </Button>
              <Button color="inherit" onClick={() => open('plans')}>
                Plans
              </Button>
            </>
          )}
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
        {!isPhone && isApex ? (
          <Box sx={{ px: 2, pb: 1.25 }}>
            <ApexTransport />
          </Box>
        ) : null}
      </AppBar>

      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <MapStage />
        {selected ? (
          <Paper sx={{ position: 'absolute', zIndex: 2, top: 12, left: 12, width: 'min(280px, calc(100% - 24px))', p: 1.5 }}>
            <Typography variant="overline" color="secondary">
              {selected.kind === 'asset' ? 'Asset' : 'Appointment'}
            </Typography>
            <Typography variant="subtitle1">{selected.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {selected.service}
              {selected.parentTitle ? ` · ${selected.parentTitle}` : ''}
            </Typography>
          </Paper>
        ) : null}
      </Box>

      {isPhone && panel ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 72,
            zIndex: 20,
            overflow: 'auto',
            bgcolor: 'background.default',
            p: 1.5,
          }}
        >
          <Button onClick={() => setPanel(null)} sx={{ mb: 1 }}>
            Back to picture
          </Button>
          {panel === 'command' ? <CommandView /> : null}
          {panel === 'plans' ? <PlansView /> : null}
          {panel === 'control' ? (
            isApex ? (
              <Panel title="Game control" subtitle="Start, pause, resume, restart, or end the open game.">
                <ApexTransport />
              </Panel>
            ) : (
              <EmptyState
                title="Control is held by APEX"
                message="This position watches the picture and its own command."
              />
            )
          ) : null}
        </Box>
      ) : null}

      {isPhone ? null : (
        <>
          <Drawer
            anchor="left"
            open={panel === 'command'}
            onClose={() => setPanel(null)}
            sx={{ '& .MuiDrawer-paper': { width: 'min(420px, 92vw)' } }}
          >
            <CommandView />
          </Drawer>
          <Drawer
            anchor="bottom"
            open={panel === 'plans'}
            onClose={() => setPanel(null)}
            sx={{ '& .MuiDrawer-paper': { maxHeight: '55vh' } }}
          >
            <PlansView />
          </Drawer>
        </>
      )}

      {isPhone ? (
        <Box
          component="nav"
          aria-label="Picture actions"
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <BottomNavigation
            showLabels
            value={panel || 'picture'}
            onChange={(_, value) => setPanel(value === 'picture' ? null : value)}
          >
            <BottomNavigationAction label="Picture" value="picture" icon={<DutyIcon name="picture" />} />
            <BottomNavigationAction label="Command" value="command" icon={<DutyIcon name="command" />} />
            <BottomNavigationAction label="Plans" value="plans" icon={<DutyIcon name="plans" />} />
            <BottomNavigationAction label="Control" value="control" icon={<DutyIcon name="control" />} />
          </BottomNavigation>
        </Box>
      ) : null}
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
        <Route path="*" element={<PictureFrame />} />
      </Route>
    </Routes>
  )
}
