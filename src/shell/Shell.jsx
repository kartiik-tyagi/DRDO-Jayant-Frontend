import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { alpha, useTheme } from '@mui/material/styles'
import { Box, Drawer, IconButton, Paper, Typography, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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

function FilterCard({ onClose }) {
  return (
    <Box sx={{ p: 2, width: { xs: '100%', sm: 320 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2">Map filters</Typography>
        <IconButton aria-label="Close map filters" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <FilterList />
    </Box>
  )
}

function Picture() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const profile = useSessionStore((state) => state.session?.profile)
  const canControl = useSessionStore((state) => state.session?.canControlGame)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [controlOpen, setControlOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const onAction = usePictureActions({
    onFilters: () => setFiltersOpen((open) => !open),
    onThemes: () => setMenuOpen(true),
    onControl: () => setControlOpen((open) => !open),
  })
  const panelColor = alpha(theme.palette.background.paper, 0.94)

  if (isPhone) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box sx={{ px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
          <UserMenu open={menuOpen} onOpenChange={setMenuOpen} />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {profile?.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {profile?.role}
            </Typography>
          </Box>
          <GameStateChip />
        </Box>
        <Box sx={{ px: 1.5, py: 1, display: 'flex', gap: 2, flexWrap: 'wrap', borderBottom: 1, borderColor: 'divider' }}>
          <ScenarioContext />
          <ExerciseClock />
        </Box>
        <MapStage readout="overlay" />
        <Box sx={{ px: 1, py: 1, display: 'flex', gap: 1, overflowX: 'auto', borderTop: 1, borderColor: 'divider' }}>
          <RoleOptions direction="row" onAction={onAction} />
        </Box>
        <Drawer anchor="bottom" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
          <FilterCard onClose={() => setFiltersOpen(false)} />
        </Drawer>
        <Drawer anchor="bottom" open={Boolean(controlOpen && canControl)} onClose={() => setControlOpen(false)}>
          <Box sx={{ p: 2 }}>
            <ExerciseControls />
          </Box>
        </Drawer>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <MapStage readout="overlay" />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
          p: 1.5,
          gap: 1.5,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            pointerEvents: 'auto',
            px: 1.5,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
            bgcolor: panelColor,
          }}
        >
          <UserMenu open={menuOpen} onOpenChange={setMenuOpen} />
          <Box sx={{ minWidth: 160 }}>
            <Typography variant="subtitle2">{profile?.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {profile?.role}
            </Typography>
          </Box>
          <ScenarioContext />
          <Box sx={{ flex: 1 }} />
          <GameStateChip />
          <ExerciseClock />
        </Paper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, minHeight: 0 }}>
          <Paper
            elevation={3}
            sx={{
              pointerEvents: 'auto',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              bgcolor: panelColor,
              maxWidth: 240,
            }}
          >
            <RoleOptions onAction={onAction} />
            {controlOpen && canControl ? <ExerciseControls /> : null}
          </Paper>
          {filtersOpen ? (
            <Paper
              elevation={4}
              sx={{ pointerEvents: 'auto', bgcolor: panelColor, maxHeight: 'calc(100vh - 180px)', overflow: 'auto' }}
            >
              <FilterCard onClose={() => setFiltersOpen(false)} />
            </Paper>
          ) : (
            <Box />
          )}
        </Box>
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
