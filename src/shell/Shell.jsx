import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Button, Paper, Typography, useMediaQuery } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { useSections } from '../features/session/useSections'
import { useSessionStore } from '../features/session/useSessionStore'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { MapStage } from '../shared/ui/MapStage'
import { ScenarioContext } from '../shared/ui/ScenarioContext'
import { UserMenu } from '../shared/ui/UserMenu'

function Picture() {
  const theme = useTheme()
  const phone = useMediaQuery(theme.breakpoints.down('sm'))
  const session = useSessionStore((state) => state.session)
  const { sections, sectionId, select } = useSections()
  const glass = alpha(theme.palette.background.paper, 0.94)

  return (
    <Box sx={{ height: '100%', position: 'relative', bgcolor: 'background.default' }}>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <MapStage readout="none" />
      </Box>

      <Paper
        component="header"
        elevation={4}
        sx={{
          position: 'absolute',
          zIndex: 2,
          top: 12,
          left: 12,
          px: 1.5,
          py: 0.75,
          bgcolor: glass,
          maxWidth: { xs: 'calc(100% - 88px)', sm: 280 },
        }}
      >
        <Typography variant="subtitle2" sx={{ letterSpacing: '0.16em' }}>
          JAYANT
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
          {session?.exerciseTitle}
        </Typography>
      </Paper>

      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          zIndex: 2,
          top: 12,
          right: 12,
          px: 1,
          py: 0.5,
          bgcolor: glass,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {phone ? null : <GameStateChip />}
        {phone ? null : <ExerciseClock />}
        <UserMenu />
      </Paper>

      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          zIndex: 2,
          top: phone ? 76 : 72,
          left: 12,
          right: phone ? 12 : 'auto',
          px: 1,
          py: 0.5,
          bgcolor: glass,
          maxWidth: phone ? 'none' : 520,
          overflowX: 'auto',
        }}
      >
        <ScenarioContext />
      </Paper>

      <Paper
        component="nav"
        aria-label="Exercise sections"
        elevation={6}
        sx={{
          position: 'absolute',
          zIndex: 2,
          left: '50%',
          bottom: 16,
          transform: 'translateX(-50%)',
          width: { xs: 'calc(100% - 24px)', md: 720 },
          p: 1,
          bgcolor: glass,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: 1,
        }}
      >
        {sections.map((section) => {
          const selected = section.id === sectionId
          return (
            <Button
              key={section.id}
              variant={selected ? 'contained' : 'outlined'}
              aria-pressed={selected}
              onClick={() => select(section.id)}
              sx={{ minHeight: 64, flexDirection: 'column', alignItems: 'flex-start', px: 1.5, textAlign: 'left' }}
            >
              <Typography variant="caption" sx={{ display: 'block', color: 'inherit', opacity: 0.8, lineHeight: 1.2 }}>
                {section.kicker}
              </Typography>
              <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 600 }}>
                {section.label}
              </Typography>
            </Button>
          )
        })}
      </Paper>
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
