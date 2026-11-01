import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Drawer, ToggleButton, ToggleButtonGroup, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { useChrome } from '../features/session/useChrome'
import { useSessionStore } from '../features/session/useSessionStore'
import { ContextStrip, TopBar } from '../shared/ui/TopBar'
import { IconRail } from '../shared/ui/IconRail'
import { IconStrip } from '../shared/ui/IconStrip'
import { MapStage } from '../shared/ui/MapStage'
import { ToolPanel } from '../shared/ui/ToolPanel'

function PhaseSwitch() {
  const phases = useSessionStore((state) => state.session?.phases || [])
  const phaseId = useSessionStore((state) => state.phaseId)
  const applyPhase = useSessionStore((state) => state.applyPhase)
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={phaseId}
      aria-label="Picture phase"
      onChange={(_, id) => {
        if (id) applyPhase(id)
      }}
      sx={{ flexShrink: 0 }}
    >
      {phases.map((phase) => (
        <ToggleButton
          key={phase.id}
          value={phase.id}
          sx={{
            minHeight: 32,
            px: 1.25,
            py: 0.25,
            color: 'text.secondary',
            '&.Mui-selected': { color: 'text.primary', bgcolor: 'action.selected' },
          }}
        >
          {phase.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

function Picture() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const chrome = useChrome()
  const applyPhase = useSessionStore((state) => state.applyPhase)
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current) return
    applied.current = true
    applyPhase('conduct')
  }, [applyPhase])

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default' }}>
      <TopBar
        menuOpen={chrome.menuOpen}
        onMenuOpenChange={chrome.setMenuOpen}
        trailing={isPhone ? null : <PhaseSwitch />}
      />
      <ContextStrip />
      {isPhone ? (
        <Box sx={{ px: 1, py: 0.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', overflowX: 'auto' }}>
          <PhaseSwitch />
        </Box>
      ) : null}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <MapStage />
        {!isPhone && chrome.panel ? (
          <Box sx={{ width: 300, flexShrink: 0, borderLeft: 1, borderColor: 'divider', minHeight: 0 }}>
            <ToolPanel panel={chrome.panel} onClose={chrome.closePanel} />
          </Box>
        ) : null}
        {!isPhone ? (
          <IconRail
            edge="end"
            expanded={chrome.expanded}
            onToggle={() => chrome.setExpanded((open) => !open)}
            activeId={chrome.panel}
            onSelect={chrome.select}
          />
        ) : null}
      </Box>
      {isPhone ? <IconStrip activeId={chrome.panel} onSelect={chrome.select} /> : null}
      {isPhone ? (
        <Drawer anchor="bottom" open={Boolean(chrome.panel)} onClose={chrome.closePanel}>
          <ToolPanel panel={chrome.panel} onClose={chrome.closePanel} />
        </Drawer>
      ) : null}
    </Box>
  )
}

export default function Shell() {
  const session = useSessionStore((state) => state.session)
  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={session ? <Picture /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={session ? '/' : '/login'} replace />} />
    </Routes>
  )
}
