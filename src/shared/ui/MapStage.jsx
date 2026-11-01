import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import SituationMap from '../../components/SituationMap'
import { useSessionStore } from '../../features/session/useSessionStore'

function formatCoordinate(value) {
  return Number(value).toFixed(4)
}

export function MapStage({ readout = 'bar' }) {
  const session = useSessionStore((state) => state.session)
  const resetToken = useSessionStore((state) => state.resetToken)
  const [pointer, setPointer] = useState(null)
  const [zoom, setZoom] = useState(session?.mapView?.zoom ?? null)
  if (!session) return null

  const coordinates = pointer
    ? `${formatCoordinate(pointer.latitude)}° N, ${formatCoordinate(pointer.longitude)}° E`
    : 'Move the pointer over the map'

  const readoutBar = (
    <Box
      sx={{
        height: 32,
        px: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" noWrap>
        {coordinates}
      </Typography>
      <Typography variant="caption" noWrap>
        EPSG:3857 · zoom {zoom ?? '—'}
      </Typography>
    </Box>
  )

  return (
    <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <SituationMap
          view={session.mapView}
          serviceUrl={session.mapService}
          layers={session.filters}
          resetToken={resetToken}
          onPointer={setPointer}
          onZoom={setZoom}
        />
        {readout === 'overlay' ? (
          <Box
            sx={{
              position: 'absolute',
              left: 12,
              bottom: 36,
              zIndex: 2,
              px: 1,
              py: 0.5,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              maxWidth: 'calc(100% - 72px)',
            }}
          >
            <Typography variant="caption" noWrap>
              {coordinates} · zoom {zoom ?? '—'}
            </Typography>
          </Box>
        ) : null}
      </Box>
      {readout === 'bar' ? readoutBar : null}
    </Box>
  )
}
