import { Box, List, ListItemButton, ListItemText, Slider, Typography } from '@mui/material'
import { useCommit, useDirectoryStore } from '../../features/directory/useDirectoryStore'
import { useSessionStore } from '../../features/session/useSessionStore'
import * as api from '../../shared/api/client'
import { EMPTY_LIST, EMPTY_OBJECT } from '../lib/empty'

function summary(filters, visible) {
  const labels = filters.filter((filter) => filter.visible === visible).map((filter) => filter.label)
  return labels.length ? labels.join(', ') : 'None'
}

export function FilterList() {
  const filters = useSessionStore((state) => state.session?.filters ?? EMPTY_LIST)
  const setFilter = useSessionStore((state) => state.setFilter)
  const opacity = useDirectoryStore((state) => state.data?.opacity ?? EMPTY_OBJECT)
  const opacityEnabled = useDirectoryStore((state) => state.data?.flags?.layerOpacity !== false)
  const commit = useCommit()
  const groups = []
  for (const filter of filters) {
    const group = groups.find((item) => item.name === filter.group)
    if (group) group.filters.push(filter)
    else groups.push({ name: filter.group, filters: [filter] })
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        Released to this role.
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        Shown: {summary(filters, true)}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Not shown: {summary(filters, false)}
      </Typography>
      {groups.map((group) => (
        <Box key={group.name} sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            {group.name}
          </Typography>
          <List disablePadding>
            {group.filters.map((filter) => (
              <Box key={filter.id}>
              <ListItemButton
                selected={filter.visible}
                aria-pressed={filter.visible}
                onClick={() => setFilter(filter.id, !filter.visible)}
                sx={{
                  borderRadius: 1,
                  minHeight: 40,
                  '&.Mui-selected': { bgcolor: 'action.selected' },
                }}
              >
                <ListItemText primary={filter.label} slotProps={{ primary: { variant: 'body2', color: 'text.primary' } }} />
                <Typography variant="caption" color={filter.visible ? 'primary.main' : 'text.secondary'}>
                  {filter.visible ? 'On' : 'Off'}
                </Typography>
              </ListItemButton>
              {opacityEnabled ? (
                <Slider
                  size="small"
                  min={0.15}
                  max={1}
                  step={0.05}
                  value={opacity[filter.id] ?? 1}
                  aria-label={`${filter.label} opacity`}
                  onChangeCommitted={(_, value) => commit((userId) => api.setLayerOpacity(userId, filter.id, value))}
                  sx={{ mx: 1.5, width: 'auto' }}
                />
              ) : null}
              </Box>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  )
}
