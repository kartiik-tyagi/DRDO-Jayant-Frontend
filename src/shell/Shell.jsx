import { useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { usePictureActions } from '../features/session/usePictureActions'
import { useSessionStore } from '../features/session/useSessionStore'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { ExerciseControls } from '../shared/ui/ExerciseControls'
import { FilterList } from '../shared/ui/FilterList'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { MapStage } from '../shared/ui/MapStage'
import { RoleOptions } from '../shared/ui/RoleOptions'
import { ScenarioContext } from '../shared/ui/ScenarioContext'
import { UserMenu } from '../shared/ui/UserMenu'

function Picture() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [controlOpen, setControlOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const canControl = useSessionStore((state) => state.session?.canControlGame)
  const onAction = usePictureActions({
    onFilters: () => setFiltersOpen(true),
    onThemes: () => setMenuOpen(true),
    onControl: () => setControlOpen((open) => !open),
  })

  const side = (
    <Box sx={{ width: { xs: 'min(100vw, 320px)', sm: 300 }, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RoleOptions onAction={onAction} />
      {controlOpen && canControl ? <ExerciseControls /> : null}
      <FilterList />
    </Box>
  )

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1.5, minHeight: 64 }}>
          {isPhone ? (
            <IconButton aria-label="Open map filters" onClick={() => setFiltersOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="overline" sx={{ lineHeight: 1.2, letterSpacing: '0.16em' }}>
              Jayant
            </Typography>
            <Typography variant="subtitle2" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>
              Situation picture
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <GameStateChip />
            <ExerciseClock />
          </Box>
          <UserMenu open={menuOpen} onOpenChange={setMenuOpen} buttonRef={menuButtonRef} />
        </Toolbar>
        <Box sx={{ px: 2, pb: 1.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <ScenarioContext />
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1.5 }}>
            <GameStateChip />
            <ExerciseClock />
          </Box>
        </Box>
      </AppBar>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {isPhone ? (
          <Drawer anchor="left" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
            {side}
          </Drawer>
        ) : (
          <Box sx={{ width: { sm: 280, md: 320 }, flexShrink: 0, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
            {side}
          </Box>
        )}
        <MapStage />
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
