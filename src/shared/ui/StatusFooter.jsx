import { Box, Typography } from '@mui/material'

function hemisphere(value, positive, negative) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const number = Number(value)
  return `${Math.abs(number).toFixed(5)}° ${number >= 0 ? positive : negative}`
}

function formatZoom(zoom) {
  if (zoom == null || Number.isNaN(Number(zoom))) return '—'
  const rounded = Math.round(Number(zoom) * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function formatScale(resolution) {
  if (!resolution || !Number.isFinite(resolution)) return '—'
  const denominator = resolution * (96 / 0.0254)
  const rounded = denominator >= 1000 ? Math.round(denominator / 1000) * 1000 : Math.round(denominator)
  return `1:${rounded.toLocaleString('en-US')}`
}

function Field({ label, value, title }) {
  return (
    <Typography variant="caption" noWrap title={title} sx={{ color: 'text.secondary' }}>
      {label}{' '}
      <Box component="span" sx={{ color: 'text.primary' }}>
        {value}
      </Box>
    </Typography>
  )
}

export function StatusFooter({ readout }) {
  return (
    <Box
      component="footer"
      aria-label="Map readout"
      sx={{
        height: 28,
        px: 1.5,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        overflowX: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Field label="Lat" value={hemisphere(readout?.latitude, 'N', 'S')} />
      <Field label="Lon" value={hemisphere(readout?.longitude, 'E', 'W')} />
      <Field label="Height" value="—" title="This picture does not publish elevation." />
      <Field label="Scale" value={formatScale(readout?.resolution)} />
      <Field label="Zoom" value={formatZoom(readout?.zoom)} />
      <Field label="CRS" value="EPSG:4326 · EPSG:3857" title="Cursor is geographic. The map is Web Mercator." />
    </Box>
  )
}
