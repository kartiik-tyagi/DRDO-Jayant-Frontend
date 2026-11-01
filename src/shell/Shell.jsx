import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Popover, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { useChrome } from '../features/session/useChrome'
import { useSessionStore } from '../features/session/useSessionStore'
import { ContextStrip, TopBar } from '../shared/ui/TopBar'
import { IconStrip } from '../shared/ui/IconStrip'
import { PictureWorkspace } from '../shared/ui/PictureWorkspace'
import { ToolPanel } from '../shared/ui/ToolPanel'

function Picture() {
  const theme = useTheme()
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'))
  const chrome = useChrome()
  const [anchor, setAnchor] = useState(null)

  const select = (id, event) => {
    if (id === 'extent') {
      chrome.select('extent')
      chrome.closePanel()
      setAnchor(null)
      return
    }
    if (chrome.panel === id) {
      chrome.closePanel()
      setAnchor(null)
      return
    }
    chrome.select(id)
    setAnchor(event?.currentTarget || null)
  }

  const close = () => {
    chrome.closePanel()
    setAnchor(null)
  }

  const menus = (edge) => <IconStrip edge={edge} activeId={chrome.panel} onSelect={select} />

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default' }}>
      <TopBar
        menuOpen={chrome.menuOpen}
        onMenuOpenChange={chrome.setMenuOpen}
        leading={isNarrow ? null : menus('none')}
      />
      {isNarrow ? menus('top') : null}
      <ContextStrip />
      <PictureWorkspace variant="plain" />
      <Popover
        open={Boolean(chrome.panel && anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <ToolPanel panel={chrome.panel} onClose={close} />
      </Popover>
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
