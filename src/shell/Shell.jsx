import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'
import { Box, Drawer, Paper, useMediaQuery } from '@mui/material'
import LoginPage from '../features/login/LoginPage'
import { useChrome } from '../features/session/useChrome'
import { useSessionStore } from '../features/session/useSessionStore'
import { ContextStrip, TopBar } from '../shared/ui/TopBar'
import { IconRail } from '../shared/ui/IconRail'
import { IconStrip } from '../shared/ui/IconStrip'
import { PictureWorkspace } from '../shared/ui/PictureWorkspace'
import { ToolPanel } from '../shared/ui/ToolPanel'

function Picture() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const chrome = useChrome()
  const surface = alpha(theme.palette.background.paper, 0.94)

  if (isPhone) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <TopBar menuOpen={chrome.menuOpen} onMenuOpenChange={chrome.setMenuOpen} />
        <ContextStrip />
        <PictureWorkspace variant="overlay" />
        <IconStrip activeId={chrome.panel} onSelect={chrome.select} />
        <Drawer anchor="bottom" open={Boolean(chrome.panel)} onClose={chrome.closePanel}>
          <ToolPanel panel={chrome.panel} onClose={chrome.closePanel} />
        </Drawer>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <PictureWorkspace variant="overlay" />
      <Box sx={{ position: 'absolute', zIndex: 2, top: 8, left: 8, right: 8 }}>
        <Paper elevation={4} sx={{ bgcolor: surface }}>
          <TopBar floating menuOpen={chrome.menuOpen} onMenuOpenChange={chrome.setMenuOpen} />
        </Paper>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          top: 64,
          left: 8,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          maxHeight: 'calc(100% - 112px)',
        }}
      >
        <Paper elevation={4} sx={{ bgcolor: surface, overflow: 'auto', maxHeight: '100%' }}>
          <IconRail
            fill={false}
            expanded={chrome.expanded}
            onToggle={() => chrome.setExpanded((open) => !open)}
            activeId={chrome.panel}
            onSelect={chrome.select}
          />
        </Paper>
        {chrome.panel ? (
          <Paper elevation={4} sx={{ bgcolor: surface, overflow: 'auto', maxHeight: '100%' }}>
            <ToolPanel panel={chrome.panel} onClose={chrome.closePanel} />
          </Paper>
        ) : null}
      </Box>
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
