import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useSessionStore } from '../../features/session/useSessionStore'
import { ExerciseControls } from './ExerciseControls'
import { FilterList } from './FilterList'

const TITLES = {
  filters: 'Map filters',
  resources: 'Resources',
  plans: 'Plans',
  'exercise-control': 'Exercise control',
}

function RecordList({ items, empty }) {
  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {empty}
      </Typography>
    )
  }
  return (
    <Stack divider={<Divider flexItem />}>
      {items.map((item) => (
        <Box key={item.id} sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'baseline' }}>
            <Typography variant="body2">{item.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {item.status}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {item.detail}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

export function ToolPanel({ panel, onClose }) {
  const resources = useSessionStore((state) => state.session?.resources || [])
  const plans = useSessionStore((state) => state.session?.plans || [])
  if (!panel) return null

  return (
    <Box
      sx={{
        width: { xs: 'min(100vw, 320px)', sm: 300 },
        maxHeight: { xs: '70vh', sm: 'none' },
        height: { sm: '100%' },
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Box sx={{ minHeight: 48, px: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          {TITLES[panel] || 'Panel'}
        </Typography>
        <IconButton aria-label="Close panel" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ overflow: 'auto', px: 1.5, py: 1.25, flex: 1 }}>
        {panel === 'filters' ? <FilterList /> : null}
        {panel === 'resources' ? <RecordList items={resources} empty="No resources are released to this role." /> : null}
        {panel === 'plans' ? <RecordList items={plans} empty="No plans are released to this role." /> : null}
        {panel === 'exercise-control' ? <ExerciseControls /> : null}
      </Box>
    </Box>
  )
}
