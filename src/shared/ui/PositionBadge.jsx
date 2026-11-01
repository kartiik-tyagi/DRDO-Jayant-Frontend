import { Chip, Stack, Typography } from '@mui/material'

export function PositionBadge({ position, parentTitle }) {
  if (!position) return null
  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Chip label={position.title} color="secondary" sx={{ alignSelf: 'flex-start', maxWidth: '100%', height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 0.75 } }} />
      <Typography variant="body2" color="text.secondary">
        {position.service}
        {position.teamName ? ` · ${position.teamName}` : ''}
        {parentTitle ? ` · reports to ${parentTitle}` : ''}
      </Typography>
    </Stack>
  )
}
