import { Stack, Typography } from '@mui/material'
import { findNode } from '../lib/tree'
import { EmptyState } from './EmptyState'
import { useSessionStore } from '../../features/session/useSessionStore'

function Row({ label, value }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value || '—'}</Typography>
    </Stack>
  )
}

export function Inspector() {
  const session = useSessionStore((state) => state.session)
  const selectedId = useSessionStore((state) => state.selectedId)
  const node = findNode(session?.commandTree, selectedId)

  if (!node) {
    return <EmptyState title="Nothing selected" message="Choose an appointment or an asset." />
  }

  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      <Typography variant="overline" color="secondary">
        {node.kind === 'asset' ? 'Asset' : 'Appointment'}
      </Typography>
      <Typography variant="h6">{node.title}</Typography>
      <Row label="Service" value={node.service} />
      <Row label="Team" value={node.teamName} />
      <Row label="Reports to" value={node.parentTitle || 'Exercise'} />
      <Row label="Signs in" value={node.canSignIn ? 'Yes' : 'No'} />
      <Row label="Call sign" value={node.callsign} />
    </Stack>
  )
}
