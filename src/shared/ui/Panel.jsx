import { Box, Paper, Stack, Typography } from '@mui/material'

export function Panel({ title, subtitle, action, children }) {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', overflow: 'auto', minHeight: 0 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'flex-start' }, justifyContent: 'space-between' }}>
        <Box sx={{ minWidth: 0 }}>
          {title ? <Typography variant="h6">{title}</Typography> : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ mt: title || subtitle ? 2 : 0 }}>{children}</Box>
    </Paper>
  )
}
