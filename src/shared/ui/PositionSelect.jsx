import { MenuItem, TextField } from '@mui/material'

export function PositionSelect({ positions, value, onChange }) {
  return (
    <TextField
      select
      required
      fullWidth
      label="Position"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {(positions || []).map((position) => (
        <MenuItem key={position.id} value={position.id} sx={{ minHeight: 44 }}>
          {position.title}
        </MenuItem>
      ))}
    </TextField>
  )
}
