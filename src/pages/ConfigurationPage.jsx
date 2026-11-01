import { useState } from 'react'
import {
  Alert,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

const FILES = [
  {
    id: 'app',
    file: 'public/config/app.json',
    controls: 'Window title, header title, short logo text, subtitle, and the page opened on startup.',
  },
  {
    id: 'theme',
    file: 'public/config/theme.json',
    controls: 'Light or dark mode, colours, corner radius, and font.',
  },
  {
    id: 'layout',
    file: 'public/config/layout.json',
    controls: 'Header, top bar chips, sidebar width, footer text, and content padding. Chip labels may use tokens such as {scenario.phase}.',
  },
  {
    id: 'navigation',
    file: 'public/config/navigation.json',
    controls: 'Sidebar entries. icon must be Map, Groups, Timeline, Settings, or Dashboard. page must be situation, forces, scenario, or configuration.',
  },
  {
    id: 'scenario',
    file: 'public/config/scenario.json',
    controls: 'Exercise name, phase, objectives, and clock start, rate, and running flag.',
  },
  {
    id: 'forces',
    file: 'public/config/forces.json',
    controls: 'Order-of-battle columns and rows. latitude and longitude place each unit on the GIS map.',
  },
  {
    id: 'map',
    file: 'public/config/map.json',
    controls: 'Map start view, GIS server address, base layer, and overlays. type is wms or xyz. Unit colours are sides. Latitude and longitude on each force place it on this map.',
  },
]

export default function ConfigurationPage({ config, missingPage }) {
  const [selected, setSelected] = useState(FILES[0].id)
  const current = FILES.find((item) => item.id === selected) || FILES[0]
  const json = JSON.stringify(config[selected] ?? {}, null, 2)

  return (
    <Stack spacing={2}>
      {missingPage ? (
        <Alert severity="warning">
          Navigation asks for page "{missingPage}", which this base does not include. Use situation, forces, scenario, or configuration.
        </Alert>
      ) : null}
      <Card>
        <CardContent>
          <Typography variant="h6">JSON configuration</Typography>
          <Typography sx={{ mt: 1 }} color="text.secondary">
            Edit the file, save it, and refresh the browser while npm run dev is running. A production build copies these files at build time, so run npm run build again after changing them if you use npm run preview.
          </Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <TextField
            select
            fullWidth
            label="Config file"
            value={current.id}
            onChange={(event) => setSelected(event.target.value)}
          >
            {FILES.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.file}
              </MenuItem>
            ))}
          </TextField>
          <Typography sx={{ mt: 2 }}>{current.controls}</Typography>
          <TextField
            fullWidth
            multiline
            minRows={14}
            value={json}
            slotProps={{ input: { readOnly: true } }}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>
    </Stack>
  )
}
