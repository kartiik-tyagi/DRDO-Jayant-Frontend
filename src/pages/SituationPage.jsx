import { useState } from 'react'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import SituationMap from '../components/SituationMap'
import { useExerciseStore } from '../state/useExerciseStore'

function formatDegrees(value) {
  return Number.isFinite(value) ? value.toFixed(5) : '--'
}

export default function SituationPage({ config }) {
  const units = config.forces?.rows || []
  const selectedId = useExerciseStore((state) => state.selectedId)
  const select = useExerciseStore((state) => state.select)
  const selected = units.find((unit) => unit.id === selectedId)
  const gis = config.map?.gis || {}
  const base = gis.base || {}
  const view = config.map?.view || {}
  const [pointer, setPointer] = useState({
    latitude: Number(view.latitude),
    longitude: Number(view.longitude),
  })
  const [zoom, setZoom] = useState(Number(config.map?.view?.zoom) || 6)

  return (
    <Box sx={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <SituationMap
            mapConfig={config.map}
            units={units}
            selectedId={selectedId}
            onSelect={select}
            onPointer={setPointer}
            onZoom={setZoom}
          />
        </Box>
        <Card
          sx={{
            position: 'absolute',
            zIndex: 800,
            top: 12,
            left: 12,
            width: 300,
            maxHeight: 'calc(100% - 24px)',
            overflow: 'auto',
          }}
        >
          <CardContent>
            <Typography variant="overline" color="secondary">
              {config.map?.title || 'Situation'}
            </Typography>
            <Typography variant="h6">Selected unit</Typography>
            {selected ? (
              <Stack spacing={0.5} sx={{ mt: 1 }}>
                <Typography variant="subtitle1">{selected.callsign}</Typography>
                <Typography>{selected.name}</Typography>
                <Typography color="text.secondary">Side: {selected.side}</Typography>
                <Typography color="text.secondary">Type: {selected.type}</Typography>
                <Typography color="text.secondary">Strength: {selected.strength}</Typography>
                <Typography color="text.secondary">Status: {selected.status}</Typography>
                <Typography color="text.secondary">
                  {formatDegrees(Number(selected.latitude))}, {formatDegrees(Number(selected.longitude))}
                </Typography>
              </Stack>
            ) : (
              <Typography sx={{ mt: 1 }} color="text.secondary">
                Select a unit on the map or in Order of battle.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
      <Box
        sx={{
          height: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="caption" noWrap>
          {gis.name || 'GIS'} · {(base.type || 'wms').toUpperCase()}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
          {base.url || 'Set gis.base.url in public/config/map.json'}
        </Typography>
        <Typography variant="caption" noWrap>
          Lat {formatDegrees(pointer?.latitude)} &nbsp; Lon {formatDegrees(pointer?.longitude)}
        </Typography>
        <Typography variant="caption" noWrap>
          Zoom {zoom}
        </Typography>
      </Box>
    </Box>
  )
}
