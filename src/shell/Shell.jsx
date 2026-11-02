import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, List, ListItemButton, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LoginPage from '../features/login/LoginPage'
import { useSections } from '../features/session/useSections'
import { useSessionStore } from '../features/session/useSessionStore'
import { ExerciseClock } from '../shared/ui/ExerciseClock'
import { GameStateChip } from '../shared/ui/GameStateChip'
import { MapStage } from '../shared/ui/MapStage'
import { ScenarioContext } from '../shared/ui/ScenarioContext'
import { UserMenu } from '../shared/ui/UserMenu'

function Index({ sections, sectionId, onSelect, direction = 'column' }) {
  return (
    <List
      component="nav"
      aria-label="Exercise sections"
      disablePadding
      sx={{
        display: 'flex',
        flexDirection: direction,
        overflow: direction === 'row' ? 'auto' : 'hidden',
        flexShrink: 0,
      }}
    >
      {sections.map((section) => {
        const selected = section.id === sectionId
        return (
          <ListItemButton
            key={section.id}
            selected={selected}
            aria-current={selected ? 'page' : undefined}
            onClick={() => onSelect(section.id)}
            sx={{
              alignItems: 'flex-start',
              flex: direction === 'row' ? '0 0 auto' : '0 0 auto',
              width: direction === 'row' ? 180 : 'auto',
              borderLeft: direction === 'column' ? 3 : 0,
              borderBottom: direction === 'row' ? 3 : 0,
              borderColor: selected ? 'primary.main' : 'transparent',
              borderRadius: 0,
              py: 1.5,
              px: 2,
              '&.Mui-selected': { bgcolor: 'action.selected' },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                {section.kicker}
              </Typography>
              <Typography variant="subtitle2" color="text.primary">
                {section.label}
              </Typography>
            </Box>
          </ListItemButton>
        )
      })}
    </List>
  )
}

function Picture() {
  const theme = useTheme()
  const phone = useMediaQuery(theme.breakpoints.down('sm'))
  const session = useSessionStore((state) => state.session)
  const { sections, sectionId, select } = useSections()

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        component="header"
        sx={{
          flexShrink: 0,
          minHeight: 56,
          px: 2,
          py: 0.75,
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
        <Box sx={{ flex: 1, minWidth: 0, overflowX: 'auto', display: { xs: 'none', md: 'block' } }}>
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
      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 1.5, py: 0.75, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', overflowX: 'auto' }}>
        <ScenarioContext />
      </Box>
      {phone ? <Index sections={sections} sectionId={sectionId} onSelect={select} direction="row" /> : null}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {phone ? null : (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              borderRight: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 2, pt: 2, pb: 1 }}>
              {session?.classification}
            </Typography>
            <Box sx={{ overflow: 'auto' }}>
              <Index sections={sections} sectionId={sectionId} onSelect={select} />
            </Box>
          </Box>
        )}
        <MapStage readout="none" />
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
