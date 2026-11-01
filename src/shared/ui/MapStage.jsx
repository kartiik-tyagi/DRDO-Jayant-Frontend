import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import SituationMap from '../../components/SituationMap'
import { flatten } from '../lib/tree'
import { useSessionStore } from '../../features/session/useSessionStore'

function formatDegrees(value) {
  return Number.isFinite(value) ? value.toFixed(5) : '--'
}

function toUnits(root) {
  return flatten(root)
    .filter((node) => Number.isFinite(node.latitude) && Number.isFinite(node.longitude))
    .map((node) => ({
      id: node.id,
      callsign: node.callsign,
      name: node.title,
      side: node.teamId === 'blue' ? 'blue' : 'control',
      type: node.kind,
      strength: node.kind === 'asset' ? 1 : 0,
      status: node.service,
      latitude: node.latitude,
      longitude: node.longitude,
    }))
}

export function MapStage() {
  const session = useSessionStore((state) => state.session)
  const selectedId = useSessionStore((state) => state.selectedId)
  const select = useSessionStore((state) => state.select)
  const view = session?.mapConfig?.view || {}
  const [pointer, setPointer] = useState({
    latitude: Number(view.latitude),
    longitude: Number(view.longitude),
  })
  const [zoom, setZoom] = useState(Number(view.zoom) || 5)

  if (!session) return null

  return (
    <Box sx={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <SituationMap
          mapConfig={session.mapConfig}
          units={toUnits(session.commandTree)}
          selectedId={selectedId}
          onSelect={select}
          onPointer={setPointer}
          onZoom={setZoom}
        />
      </Box>
      <Box
        sx={{
          minHeight: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 1.5,
          py: 0.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
      >
        <Typography variant="caption" noWrap>
          {session.mapConfig?.gis?.name || 'GIS'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
          {session.mapConfig?.gis?.base?.url}
        </Typography>
        <Typography variant="caption" noWrap>
          Lat {formatDegrees(pointer?.latitude)} Lon {formatDegrees(pointer?.longitude)}
        </Typography>
        <Typography variant="caption" noWrap>
          Zoom {zoom}
        </Typography>
      </Box>
    </Box>
  )
}
