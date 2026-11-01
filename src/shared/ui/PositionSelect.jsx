import { Box, MenuItem, TextField, Typography } from '@mui/material'

export function PositionSelect({ users, value, onChange }) {
  return (
    <TextField
      select
      required
      fullWidth
      label="User"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {(users || []).map((user) => (
        <MenuItem key={user.id} value={user.id} sx={{ minHeight: 44 }}>
          <Box>
            <Typography variant="body2">{user.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user.role}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </TextField>
  )
}
