import { useRef, useState } from 'react'
import { Box, MenuItem, Slider, TextField, Typography } from '@mui/material'
import SituationMap from '../../components/SituationMap'
import { useDirectoryStore } from '../../features/directory/useDirectoryStore'
import { useSessionStore } from '../../features/session/useSessionStore'
import { pictureLayers, pictureService } from './MapStage'

const OPENING = ['india', 'northern-approach', 'europe', 'east-asia']

export function MapGrid({ onReadout }) {
  const session = useSessionStore((state) => state.session)
  const directory = useDirectoryStore((state) => state.data)
  const centers = session?.plannedCenters || []
  const openingZoom = session?.mapView?.zoom ?? 5
  const [cellIds, setCellIds] = useState(() =>
    OPENING.map((id, index) => (centers.some((item) => item.id === id) ? id : centers[index]?.id || centers[0]?.id || id)),
  )
  const [zooms, setZooms] = useState(() => OPENING.map(() => openingZoom))
  const zoomsRef = useRef(zooms)
  const ignore = useRef(OPENING.map(() => false))
  const holds = useRef(OPENING.map(() => 0))
  const readout = useRef({ latitude: null, longitude: null, zoom: null, resolution: null, height: null })
  zoomsRef.current = zooms

  if (!session) return null

  const minZoom = session.mapView?.minZoom ?? 3
  const maxZoom = session.mapView?.maxZoom ?? 12
  const layers = pictureLayers(session, directory)
  const serviceUrl = pictureService(session, directory)

  function setCellZoom(index, next) {
    ignore.current[index] = true
    window.clearTimeout(holds.current[index])
    holds.current[index] = window.setTimeout(() => {
      ignore.current[index] = false
    }, 450)
    setZooms((current) => current.map((value, itemIndex) => (itemIndex === index ? next : value)))
  }

  function publish(partial) {
    readout.current = { ...readout.current, ...partial, height: null }
    onReadout?.({ ...readout.current })
  }

  return (
    <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gridTemplateRows: { xs: 'repeat(4, minmax(240px, 50vh))', md: '1fr 1fr' },
          overflow: 'auto',
        }}
      >
        {cellIds.map((cellId, index) => {
          const place = centers.find((item) => item.id === cellId) || centers[0]
          if (!place) return null
          const zoom = zooms[index] ?? openingZoom
          return (
            <Box
              key={index}
              sx={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', borderRight: 1, borderBottom: 1, borderColor: 'divider' }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1,
                  py: 0.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <TextField
                  select
                  size="small"
                  hiddenLabel
                  value={place.id}
                  onChange={(event) => {
                    const next = event.target.value
                    setCellIds((current) => current.map((id, itemIndex) => (itemIndex === index ? next : id)))
                  }}
                  aria-label={`Grid ${index + 1} center`}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  {centers.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="caption" sx={{ flexShrink: 0 }}>
                  Zoom
                </Typography>
                <Slider
                  size="small"
                  min={minZoom}
                  max={maxZoom}
                  step={1}
                  value={Math.min(maxZoom, Math.max(minZoom, zoom))}
                  onChange={(_, value) => setCellZoom(index, Array.isArray(value) ? value[0] : value)}
                  aria-label={`Grid ${index + 1} zoom`}
                  sx={{ width: 120, flexShrink: 0 }}
                />
                <Typography variant="caption" sx={{ width: 16, flexShrink: 0, textAlign: 'right' }}>
                  {zoom}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minHeight: 160, position: 'relative' }}>
                <SituationMap
                  view={{ latitude: place.latitude, longitude: place.longitude, zoom, minZoom, maxZoom }}
                  focusKey={`${place.id}:${zoom}`}
                  showControls={false}
                  label={`${place.name} map`}
                  serviceUrl={serviceUrl}
                  layers={layers}
                  onPointer={(pointer) => publish({ latitude: pointer.latitude, longitude: pointer.longitude, zoom })}
                  onView={(next) => {
                    publish({ zoom: next.zoom, resolution: next.resolution })
                    if (ignore.current[index] || next.zoom == null) return
                    const rounded = Math.round(next.zoom)
                    if (rounded === zoomsRef.current[index]) return
                    setCellZoom(index, rounded)
                  }}
                />
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
