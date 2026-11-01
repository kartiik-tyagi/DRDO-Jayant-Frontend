import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Drawer, IconButton, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { useChrome } from '../features/session/useChrome'
import { useSessionStore } from '../features/session/useSessionStore'
import { ContextStrip, TopBar } from '../shared/ui/TopBar'
import { IconRail } from '../shared/ui/IconRail'
import { PictureWorkspace } from '../shared/ui/PictureWorkspace'
import { ToolPanel } from '../shared/ui/ToolPanel'

function Picture() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const chrome = useChrome()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const select = (id) => {
    chrome.select(id)
    if (isPhone && id !== 'extent') setDrawerOpen(false)
  }

  const rail = (
    <IconRail
      expanded={isPhone || chrome.expanded}
      onToggle={() => (isPhone ? setDrawerOpen(false) : chrome.setExpanded((open) => !open))}
      activeId={chrome.panel}
      onSelect={select}
    />
  )

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default' }}>
      <TopBar
        menuOpen={chrome.menuOpen}
        onMenuOpenChange={chrome.setMenuOpen}
        leading={
          isPhone ? (
            <IconButton aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : null
        }
      />
      <ContextStrip />
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {isPhone ? (
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            {rail}
          </Drawer>
        ) : (
          rail
        )}
        {isPhone ? (
          <Drawer anchor="bottom" open={Boolean(chrome.panel)} onClose={chrome.closePanel}>
            <ToolPanel panel={chrome.panel} onClose={chrome.closePanel} />
          </Drawer>
        ) : chrome.panel ? (
          <Box sx={{ width: 300, flexShrink: 0, borderRight: 1, borderColor: 'divider', minHeight: 0 }}>
            <ToolPanel panel={chrome.panel} onClose={chrome.closePanel} />
          </Box>
        ) : null}
        <PictureWorkspace variant="dock" />
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
