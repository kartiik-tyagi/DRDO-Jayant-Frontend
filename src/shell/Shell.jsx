import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { useSections } from '../features/session/useSections'
import { useSessionStore } from '../features/session/useSessionStore'
import { EMPTY_LIST } from '../shared/lib/empty'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { MapStage } from '../shared/ui/MapStage'
import { ScenarioContext } from '../shared/ui/ScenarioContext'
import { UserMenu } from '../shared/ui/UserMenu'

function PhaseButton({ phase, selected, onSelect }) {
  return (
    <Button
      variant={selected ? 'contained' : 'outlined'}
      onClick={() => onSelect(phase.id)}
      aria-pressed={selected}
      sx={{ minHeight: 72, justifyContent: 'flex-start', px: 2, flexShrink: 0 }}
    >
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="caption" sx={{ display: 'block', color: 'inherit', opacity: 0.8, lineHeight: 1.2 }}>
          Phase
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'inherit', lineHeight: 1.2 }}>
          {phase.label}
        </Typography>
      </Box>
    </Button>
  )
}

function Picture() {
  const theme = useTheme()
  const stacked = useMediaQuery(theme.breakpoints.down('md'))
  const phases = useSessionStore((state) => state.session?.phases ?? EMPTY_LIST)
  const phaseId = useSessionStore((state) => state.phaseId)
  const applyPhase = useSessionStore((state) => state.applyPhase)
  const session = useSessionStore((state) => state.session)
  const { sections, sectionId, select } = useSections()

  const sectionsNav = (
    <Box component="nav" aria-label="Exercise sections" sx={{ display: 'flex', flexDirection: stacked ? 'row' : 'column', gap: 0.5, overflowX: stacked ? 'auto' : 'visible' }}>
      {sections.map((section) => {
        const selected = section.id === sectionId
        return (
          <Button
            key={section.id}
            aria-pressed={selected}
            onClick={() => select(section.id)}
            sx={{
              flexShrink: 0,
              justifyContent: 'flex-start',
              minHeight: 40,
              px: 1.5,
              borderRadius: 0,
              color: selected ? 'text.primary' : 'text.secondary',
              borderLeft: stacked ? 0 : 3,
              borderBottom: stacked ? 3 : 0,
              borderColor: selected ? 'primary.main' : 'transparent',
            }}
          >
            {section.label}
          </Button>
        )
      })}
    </Box>
  )

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ minWidth: 0, flexShrink: 0 }}>
          <Typography variant="subtitle2" sx={{ letterSpacing: '0.16em' }}>
            JAYANT
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
            {session?.exerciseTitle}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, overflowX: 'auto', display: { xs: 'none', lg: 'block' } }}>
          <ScenarioContext />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, ml: 'auto' }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <GameStateChip />
            <ExerciseClock />
          </Box>
          <UserMenu />
        </Box>
      </Box>
      <Box sx={{ display: { xs: 'block', lg: 'none' }, px: 1.5, py: 0.75, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', overflowX: 'auto' }}>
        <ScenarioContext />
      </Box>

      {stacked ? (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', px: 1.5, py: 1, flexShrink: 0, bgcolor: 'background.paper' }}>
            {phases.map((phase) => (
              <PhaseButton key={phase.id} phase={phase} selected={phase.id === phaseId} onSelect={applyPhase} />
            ))}
          </Box>
          <MapStage readout="none" />
          <Box sx={{ flexShrink: 0, px: 1, py: 0.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            {sectionsNav}
          </Box>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
          <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, p: 2, display: 'flex' }}>
            <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', display: 'flex' }}>
              <MapStage readout="none" />
            </Box>
          </Box>
          <Box
            sx={{
              width: 300,
              flexShrink: 0,
              borderLeft: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Phase
            </Typography>
            {phases.map((phase) => (
              <PhaseButton key={phase.id} phase={phase} selected={phase.id === phaseId} onSelect={applyPhase} />
            ))}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', pt: 1 }}>
              Sections
            </Typography>
            {sectionsNav}
          </Box>
        </Box>
      )}
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
