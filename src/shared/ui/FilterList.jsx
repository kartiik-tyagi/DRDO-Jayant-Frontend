import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'

function summary(filters, visible) {
  const labels = filters.filter((filter) => filter.visible === visible).map((filter) => filter.label)
  return labels.length ? labels.join(', ') : 'None'
}

export function FilterList() {
  const filters = useSessionStore((state) => state.session?.filters || [])
  const setFilter = useSessionStore((state) => state.setFilter)
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
              <ListItemButton
                key={filter.id}
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
            ))}
          </List>
        </Box>
      ))}
    </Box>
  )
}
