import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'

function summary(filters, visible) {
  const labels = filters.filter((filter) => filter.visible === visible).map((filter) => filter.label)
  return labels.length ? labels.join(', ') : 'None'
}

export function FilterList({ variant = 'list' }) {
  const filters = useSessionStore((state) => state.session?.filters || [])
  const setFilter = useSessionStore((state) => state.setFilter)
  const groups = []
  for (const filter of filters) {
    const group = groups.find((item) => item.name === filter.group)
    if (group) group.filters.push(filter)
    else groups.push({ name: filter.group, filters: [filter] })
  }

  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.25}>
        <Typography variant="overline">Map filters</Typography>
        <Typography variant="caption" color="text.secondary">
          Released to this role.
        </Typography>
        <Typography variant="caption">Shown: {summary(filters, true)}</Typography>
        <Typography variant="caption">Not shown: {summary(filters, false)}</Typography>
      </Stack>
      {variant === 'chips' ? (
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              clickable
              color={filter.visible ? 'primary' : 'default'}
              variant={filter.visible ? 'filled' : 'outlined'}
              aria-pressed={filter.visible}
              onClick={() => setFilter(filter.id, !filter.visible)}
              sx={{ minHeight: 36 }}
            />
          ))}
        </Stack>
      ) : (
        groups.map((group) => (
          <Box key={group.name}>
            <Typography variant="caption" color="text.secondary">
              {group.name}
            </Typography>
            {group.filters.map((filter) => (
              <Button
                key={filter.id}
                fullWidth
                variant={filter.visible ? 'contained' : 'outlined'}
                aria-pressed={filter.visible}
                onClick={() => setFilter(filter.id, !filter.visible)}
                sx={{ justifyContent: 'space-between', mb: 0.75 }}
              >
                {filter.label}
                <Typography variant="caption" component="span" sx={{ color: 'inherit' }}>
                  {filter.visible ? 'Shown' : 'Not shown'}
                </Typography>
              </Button>
            ))}
          </Box>
        ))
      )}
    </Stack>
  )
}
