import { Box, IconButton, Tooltip } from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'
import { NavIcon } from './navIcons'

export function IconStrip({ activeId, onSelect, edge = 'bottom' }) {
  const groups = useSessionStore((state) => state.session?.navigation || [])
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderTop: edge === 'bottom' ? 1 : 0,
        borderBottom: edge === 'top' ? 1 : 0,
      }}
    >
      {groups.map((group, index) => (
        <Box
          key={group.id}
          sx={{ display: 'flex', borderLeft: index ? 1 : 0, borderColor: 'divider', px: 0.25 }}
        >
          {group.items.map((item) => (
            <Tooltip key={item.id} title={`${group.label}: ${item.label}`}>
              <IconButton
                aria-label={item.label}
                color={activeId === item.id ? 'primary' : 'default'}
                onClick={(event) => onSelect(item.id, event)}
              >
                <NavIcon name={item.icon} />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      ))}
    </Box>
  )
}
