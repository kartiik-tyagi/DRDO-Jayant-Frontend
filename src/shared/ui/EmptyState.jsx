import { Box, Typography } from '@mui/material'

export function EmptyState({ title, message }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1">{title}</Typography>
      {message ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}
