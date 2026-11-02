import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { useChrome } from '../features/session/useChrome'
import { useSessionStore } from '../features/session/useSessionStore'
import { ApplicationMenu } from '../shared/ui/ApplicationMenu'
import { MapToolbar, ShowMapTools } from '../shared/ui/MapToolbar'
import { MapStage } from '../shared/ui/MapStage'
import { StatusFooter } from '../shared/ui/StatusFooter'
import { ToolDock } from '../shared/ui/ToolDock'
import { ContextStrip, TopBar } from '../shared/ui/TopBar'

function Frame() {
  const theme = useTheme()
  const stacked = useMediaQuery(theme.breakpoints.down('md'))
  const { panel, closePanel, select } = useChrome()
  const [expanded, setExpanded] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(true)
  const [readout, setReadout] = useState(null)

  return (
    <Box sx={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
      <TopBar leading={toolsOpen ? null : <ShowMapTools onClick={() => setToolsOpen(true)} />} />
      <ContextStrip />
      {stacked ? <ApplicationMenu presentation="icons" /> : null}
      {toolsOpen ? <MapToolbar activeId={panel} onSelect={select} onHide={() => setToolsOpen(false)} /> : null}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', minWidth: 0 }}>
        {stacked ? null : <ApplicationMenu presentation="rail" expanded={expanded} onExpandedChange={setExpanded} />}
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <MapStage readout="none" onReadout={setReadout} />
          <ToolDock panel={panel} onClose={closePanel} edge="end" />
        </Box>
      </Box>
      <StatusFooter readout={readout} />
    </Box>
  )
}

export default function Shell() {
  const session = useSessionStore((state) => state.session)
  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={session ? <Frame /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={session ? '/' : '/login'} replace />} />
    </Routes>
  )
}
