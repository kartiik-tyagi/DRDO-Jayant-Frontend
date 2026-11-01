import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
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
  const phases = useSessionStore((state) => state.session?.phases || [])
  const phaseId = useSessionStore((state) => state.phaseId)
  const applyPhase = useSessionStore((state) => state.applyPhase)
  const canControl = useSessionStore((state) => state.session?.canControlGame)
  const dockRef = useRef(null)
  const applied = useRef(false)
  const [controlOpen, setControlOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const onAction = usePictureActions({
    onFilters: () => dockRef.current?.scrollIntoView({ block: 'nearest' }),
    onThemes: () => setMenuOpen(true),
    onControl: () => setControlOpen((open) => !open),
  })

  useEffect(() => {
    if (applied.current) return
    applied.current = true
    applyPhase('conduct')
  }, [applyPhase])

  return (
    <Box sx={{ height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box
        sx={{
          px: { xs: 1.5, md: 2 },
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: '0.16em' }}>
          Jayant
        </Typography>
        <ScenarioContext />
        <Box sx={{ flex: '1 1 16px' }} />
        <GameStateChip />
        <ExerciseClock />
        <UserMenu open={menuOpen} onOpenChange={setMenuOpen} />
      </Box>
      <Box
        sx={{
          px: { xs: 1.5, md: 2 },
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <ToggleButtonGroup
          exclusive
          value={phaseId}
          onChange={(_, id) => {
            if (id) applyPhase(id)
          }}
          aria-label="Picture phase"
        >
          {phases.map((phase) => (
            <ToggleButton key={phase.id} value={phase.id} sx={{ minHeight: 44, px: 2.5 }}>
              {phase.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Typography variant="caption" color="text.secondary" sx={{ flex: '1 1 200px' }}>
          A phase sets the layers that are shown.
        </Typography>
        <RoleOptions direction="row" onAction={onAction} />
      </Box>
      {controlOpen && canControl ? (
        <Box sx={{ px: { xs: 1.5, md: 2 }, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <ExerciseControls />
        </Box>
      ) : null}
      <Box sx={{ flex: 1, minHeight: 280, display: 'flex', flexDirection: 'column' }}>
        <MapStage />
      </Box>
      <Box ref={dockRef} sx={{ px: { xs: 1.5, md: 2 }, py: 1.25, borderTop: 1, borderColor: 'divider' }}>
        <FilterList variant="chips" />
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
