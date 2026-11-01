import { Box, CircularProgress, Typography } from '@mui/material'

export function LoadingState({ label = 'Loading' }) {
  return (
    <Box role="status" sx={{ display: 'grid', placeItems: 'center', gap: 1, minHeight: 160, p: 4 }}>
      <CircularProgress />
      <Typography variant="body2">{label}</Typography>
    </Box>
  )
}
