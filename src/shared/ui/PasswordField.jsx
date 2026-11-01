import { TextField } from '@mui/material'

export function PasswordField({ value, onChange }) {
  return (
    <TextField
      required
      fullWidth
      type="password"
      label="Password"
      value={value}
      autoComplete="current-password"
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
