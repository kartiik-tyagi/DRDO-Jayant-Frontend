import { Box, Typography } from '@mui/material'
import { ExerciseClock } from './ExerciseClock'
import { GameStateChip } from './GameStateChip'
import { ScenarioContext } from './ScenarioContext'
import { UserMenu } from './UserMenu'

export function TopBar({ leading, trailing, menuOpen, onMenuOpenChange, floating = false }) {
  return (
    <Box
      component="header"
      sx={{
        minHeight: 48,
        px: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderBottom: floating ? 0 : 1,
        borderColor: 'divider',
        bgcolor: floating ? 'transparent' : 'background.paper',
        color: 'text.primary',
      }}
    >
      {leading}
      <Typography variant="subtitle2" sx={{ letterSpacing: '0.14em', px: 0.5, flexShrink: 0 }}>
        JAYANT
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0, display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
        <ScenarioContext />
      </Box>
      <Box sx={{ flex: { xs: 1, lg: 0 } }} />
      {trailing}
      <GameStateChip />
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <ExerciseClock />
      </Box>
      <UserMenu open={menuOpen} onOpenChange={onMenuOpenChange} />
    </Box>
  )
}

export function ContextStrip() {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'none' },
        alignItems: 'center',
        gap: 2,
        px: 1.5,
        py: 0.75,
        overflowX: 'auto',
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <ScenarioContext />
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <ExerciseClock />
      </Box>
    </Box>
  )
}
