import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Avatar, Box, Typography } from '@mui/material'
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
  const profile = useSessionStore((state) => state.session?.profile)
  const canControl = useSessionStore((state) => state.session?.canControlGame)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [controlOpen, setControlOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const onAction = usePictureActions({
    onFilters: () => setFiltersOpen((open) => !open),
    onThemes: () => setMenuOpen(true),
    onControl: () => setControlOpen((open) => !open),
  })

  return (
    <Box sx={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box
        sx={{
          px: { xs: 1.5, md: 2.5 },
          py: 1.5,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Avatar src={profile?.avatarUrl} alt="" variant="rounded" sx={{ width: 64, height: 64 }} />
        <Box sx={{ minWidth: 0, flex: '1 1 220px' }}>
          <Typography variant="overline" sx={{ letterSpacing: '0.14em' }}>
            {profile?.service}
          </Typography>
          <Typography variant="h6">{profile?.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile?.role}
          </Typography>
        </Box>
        <GameStateChip />
        <ExerciseClock />
        <UserMenu open={menuOpen} onOpenChange={setMenuOpen} />
      </Box>
      <Box sx={{ px: { xs: 1.5, md: 2.5 }, py: 1.25, borderBottom: 1, borderColor: 'divider', overflowX: 'auto' }}>
        <ScenarioContext />
      </Box>
      <Box
        sx={{
          px: { xs: 1.5, md: 2.5 },
          py: 1,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          flexWrap: 'wrap',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <RoleOptions direction="row" onAction={onAction} />
        {controlOpen && canControl ? <ExerciseControls /> : null}
      </Box>
      {filtersOpen ? (
        <Box sx={{ px: { xs: 1.5, md: 2.5 }, py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
          <FilterList variant="chips" />
        </Box>
      ) : null}
      <Box sx={{ flex: 1, minHeight: 320, display: 'flex', flexDirection: 'column' }}>
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
