import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import LoginPage from '../features/login/LoginPage'
import CommandView from '../features/command/CommandView'
import ControlView from '../features/control/ControlView'
import PlansView from '../features/plans/PlansView'
import SituationView from '../features/situation/SituationView'
import { useSessionStore } from '../features/session/useSessionStore'
import { DutyIcon } from '../shared/ui/DutyIcon'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { Inspector } from '../shared/ui/Inspector'
import { dutiesFor } from './duties'
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

function WorkstationFrame() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const isCompact = useMediaQuery(theme.breakpoints.down('md'))
  const isWide = useMediaQuery(theme.breakpoints.up('xl'))
  const navigate = useNavigate()
  const location = useLocation()
  const session = useSessionStore((state) => state.session)
  const selectedId = useSessionStore((state) => state.selectedId)
  const signOut = useSessionStore((state) => state.signOut)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const skipDetails = useRef(true)
  const items = dutiesFor(session?.position)
  const drawerWidth = isWide ? 300 : 248
  const inspectorWidth = isWide ? 380 : 320
  const fullBleed = location.pathname === '/situation'
  const current = items.find((item) => item.path === location.pathname)?.path || false

  useEffect(() => {
    if (skipDetails.current) {
      skipDetails.current = false
      return
    }
    if (selectedId && isCompact) setDetailsOpen(true)
  }, [selectedId, isCompact])

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 0, pb: isPhone ? '72px' : 0 }}>
      {isPhone ? null : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Toolbar sx={{ alignItems: 'flex-start', py: 1.5 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" color="secondary">
                Jayant
              </Typography>
              <Typography variant="subtitle2" noWrap>
                Layout {LAYOUT_ID}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {LAYOUT_NAME}
              </Typography>
            </Box>
          </Toolbar>
          <List component="nav" aria-label="Duties" sx={{ px: 1 }}>
            {items.map((item) => (
              <ListItemButton
                key={item.id}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'secondary.main' : 'inherit' }}>
                  <DutyIcon name={item.id} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, minHeight: 0 }}>
        <AppBar position="static" elevation={0} color="primary">
          <Toolbar sx={{ gap: 1.5, flexWrap: 'wrap', py: 1 }}>
            <Chip label={`Layout ${LAYOUT_ID}`} size="small" color="secondary" />
            <Box sx={{ flex: 1, minWidth: 160 }}>
              <Typography variant="subtitle1" noWrap>
                {session.position.title}
              </Typography>
              <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.85 }} noWrap>
                {session.scenarioName} · {session.gameName}
              </Typography>
            </Box>
            {isCompact ? (
              <Button color="inherit" onClick={() => setDetailsOpen(true)}>
                Details
              </Button>
            ) : null}
            <GameStateChip />
            <ExerciseClock />
            <Tooltip title="Sign out">
              <IconButton color="inherit" aria-label="Sign out" onClick={() => { signOut(); navigate('/login') }}>
                <LogoutOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: fullBleed ? 'hidden' : 'auto',
              p: fullBleed ? 0 : { xs: 1.5, sm: 2 },
            }}
          >
            <Outlet />
          </Box>
          {isCompact ? null : (
            <Box
              sx={{
                width: inspectorWidth,
                flexShrink: 0,
                borderLeft: '1px solid',
                borderColor: 'divider',
                overflow: 'auto',
                bgcolor: 'background.paper',
              }}
            >
              <Inspector />
            </Box>
          )}
        </Box>
      </Box>

      {isPhone ? (
        <Box
          component="nav"
          aria-label="Duties"
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}
        >
          <BottomNavigation showLabels value={current} onChange={(_, value) => navigate(value)}>
            {items.map((item) => (
              <BottomNavigationAction key={item.id} label={item.label} value={item.path} icon={<DutyIcon name={item.id} />} />
            ))}
          </BottomNavigation>
        </Box>
      ) : null}

      {isCompact ? (
        <Drawer
          anchor="bottom"
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          sx={{ '& .MuiDrawer-paper': { maxHeight: '70vh' } }}
        >
          <Inspector />
        </Drawer>
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
        <Route element={<WorkstationFrame />}>
          <Route index element={<Navigate to="/situation" replace />} />
          <Route path="situation" element={<SituationView />} />
          <Route path="command" element={<CommandView />} />
          <Route path="plans" element={<PlansView />} />
          <Route path="control" element={<ControlView />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
