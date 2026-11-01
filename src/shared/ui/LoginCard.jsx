import { Chip, Paper, Stack, Typography } from '@mui/material'

export function LoginCard({ classification, title, status, hint, children }) {
  return (
    <Paper
      sx={{
        width: 'min(440px, 100%)',
        p: { xs: 2.5, sm: 3.5 },
      }}
    >
      <Stack spacing={2}>
        {classification ? <Chip label={classification} color="warning" size="small" sx={{ alignSelf: 'flex-start' }} /> : null}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {status ? (
          <Typography color="text.secondary" variant="body2">
            {status}
          </Typography>
        ) : null}
        {children}
        {hint ? (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        ) : null}
      </Stack>
    </Paper>
  )
}
