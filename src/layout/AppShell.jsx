import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import dayjs from 'dayjs'
import { resolveTokens } from '../config/resolveTokens'
import { IconFor } from './iconMap'
import { useExerciseStore } from '../state/useExerciseStore'

function visibleItems(navigation) {
  return (navigation?.items || []).filter(
    (item) => item && item.visible !== false && item.path && item.page,
  )
}

export default function AppShell({ config }) {
  const { app, layout, navigation, scenario } = config
  const items = useMemo(() => visibleItems(navigation), [navigation])
  const navigate = useNavigate()
  const location = useLocation()
  const sidebar = layout?.sidebar || {}
  const header = layout?.header || {}
  const topbar = layout?.topbar || {}
  const footer = layout?.footer || {}
  const [collapsed, setCollapsed] = useState(Boolean(sidebar.defaultCollapsed))
  const width = collapsed ? sidebar.collapsedWidth || 76 : sidebar.width || 268
  const headerHeight = header.visible === false ? 0 : header.height || 64
  const topbarHeight = topbar.visible === false ? 0 : topbar.height || 44
  const footerHeight = footer.visible === false ? 0 : footer.height || 32
  const epochMs = useExerciseStore((state) => state.epochMs)
  const running = useExerciseStore((state) => state.running)
  const initClock = useExerciseStore((state) => state.initClock)
  const tick = useExerciseStore((state) => state.tick)
  const toggleRunning = useExerciseStore((state) => state.toggleRunning)

  useEffect(() => {
    document.title = app?.title || 'DRDO Jayant'
  }, [app?.title])

  useEffect(() => {
    initClock(scenario?.clock)
  }, [initClock, scenario])

  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [running, tick])

  const clockText =
    epochMs == null ? '' : dayjs(epochMs).format('DD MMM YYYY HH:mm:ss')
  const currentItem = items.find((item) => item.path === location.pathname)
  const fullBleed = currentItem?.fullBleed === true

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {sidebar.visible !== false && (
        <Drawer
          variant="permanent"
          sx={{
            width,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowX: 'hidden',
            },
          }}
        >
          <Toolbar sx={{ minHeight: headerHeight, px: 2 }}>
            <Typography variant="overline" color="secondary" noWrap>
              {collapsed ? app?.shortTitle : app?.exerciseName}
            </Typography>
          </Toolbar>
          <List component="nav" aria-label="Primary" sx={{ px: 1 }}>
            {items.map((item) => {
              const selected = location.pathname === item.path
              const button = (
                <ListItemButton
                  key={item.id}
                  selected={selected}
                  onClick={() => navigate(item.path)}
                  sx={{ borderRadius: 1, mb: 0.5, justifyContent: collapsed ? 'center' : 'flex-start' }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: selected ? 'secondary.main' : 'inherit' }}>
                    <IconFor name={item.icon} />
                  </ListItemIcon>
                  {collapsed ? null : <ListItemText primary={item.label} />}
                </ListItemButton>
              )
              return collapsed ? (
                <Tooltip key={item.id} title={item.label} placement="right">
                  {button}
                </Tooltip>
              ) : (
                button
              )
            })}
          </List>
        </Drawer>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, minHeight: 0 }}>
        {header.visible !== false && (
          <AppBar position="static" elevation={0} sx={{ height: headerHeight, justifyContent: 'center' }}>
            <Toolbar sx={{ minHeight: headerHeight, gap: 1.5 }}>
              {sidebar.visible !== false && (
                <IconButton
                  color="inherit"
                  edge="start"
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  onClick={() => setCollapsed((value) => !value)}
                >
                  {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
                </IconButton>
              )}
              {header.showLogo !== false && (
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'secondary.main',
                    color: 'background.default',
                    fontWeight: 700,
                  }}
                >
                  {app?.shortTitle || 'JY'}
                </Box>
              )}
              {header.showTitle !== false && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" noWrap>
                    {app?.title}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }} noWrap>
                    {app?.subtitle}
                  </Typography>
                </Box>
              )}
              {header.showClock !== false && (
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" display="block">
                    {scenario?.clock?.label || 'Exercise time'}
                  </Typography>
                  <Typography variant="body2">{clockText}</Typography>
                </Box>
              )}
              {header.showClock !== false && (
                <Tooltip title={running ? 'Pause exercise clock' : 'Resume exercise clock'}>
                  <IconButton color="inherit" aria-label={running ? 'Pause clock' : 'Resume clock'} onClick={toggleRunning}>
                    {running ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                </Tooltip>
              )}
              {header.showUser !== false && (
                <Chip label={header.userLabel || 'Controller'} color="secondary" variant="outlined" />
              )}
            </Toolbar>
          </AppBar>
        )}

        {topbar.visible !== false && (
          <Box
            sx={{
              height: topbarHeight,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'auto',
            }}
          >
            {(topbar.items || []).map((item) => (
              <Chip
                key={item.id}
                size="small"
                label={resolveTokens(item.label, config)}
                color={item.color || 'default'}
                variant={item.color && item.color !== 'default' ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: fullBleed ? 'hidden' : 'auto',
            p: fullBleed ? 0 : `${layout?.contentPadding ?? 16}px`,
          }}
        >
          <Outlet />
        </Box>

        {footer.visible !== false && (
          <Box
            component="footer"
            sx={{
              height: footerHeight,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="caption" color="text.secondary" noWrap>
              {resolveTokens(footer.text, config)}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
