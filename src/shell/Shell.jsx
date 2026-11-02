import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import LoginPage from '../features/login/LoginPage'
import { useSections } from '../features/session/useSections'
import { useSessionStore } from '../features/session/useSessionStore'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { MapStage } from '../shared/ui/MapStage'
import { ScenarioContext } from '../shared/ui/ScenarioContext'
import { UserMenu } from '../shared/ui/UserMenu'

function Picture() {
  const session = useSessionStore((state) => state.session)
  const { sections, sectionId, select } = useSections()

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        component="header"
        sx={{ flexShrink: 0, px: { xs: 2, md: 3 }, pt: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ letterSpacing: '0.14em', lineHeight: 1.1 }}>
              JAYANT
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {session?.exerciseTitle} · {session?.classification}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              <GameStateChip />
              <ExerciseClock />
            </Box>
            <UserMenu />
          </Box>
        </Box>
        <Box
          component="nav"
          aria-label="Chapters"
          sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, mt: 2, overflowX: 'auto' }}
        >
          {sections.map((section) => {
            const selected = section.id === sectionId
            return (
              <Button
                key={section.id}
                aria-pressed={selected}
                onClick={() => select(section.id)}
                sx={{
                  flexShrink: 0,
                  borderRadius: 0,
                  px: 1.5,
                  minHeight: 44,
                  color: selected ? 'text.primary' : 'text.secondary',
                  borderBottom: 2,
                  borderColor: selected ? 'primary.main' : 'transparent',
                }}
              >
                {section.label}
              </Button>
            )
          })}
        </Box>
        <Box sx={{ py: 1, overflowX: 'auto' }}>
          <ScenarioContext />
        </Box>
      </Box>
      <MapStage readout="none" />
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
