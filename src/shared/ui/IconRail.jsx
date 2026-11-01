import { Box, Divider, IconButton, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useSessionStore } from '../../features/session/useSessionStore'
import { NavIcon } from './navIcons'

export function IconRail({ expanded, onToggle, activeId, onSelect, edge = 'start', fill = true }) {
  const groups = useSessionStore((state) => state.session?.navigation || [])
  const width = expanded ? 220 : 56

  return (
    <Box
      component="nav"
      aria-label="Picture menu"
      sx={{
        width,
        flexShrink: 0,
        height: fill ? '100%' : 'auto',
        maxHeight: fill ? 'none' : '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderRight: edge === 'start' ? 1 : 0,
        borderLeft: edge === 'end' ? 1 : 0,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: expanded ? 'flex-end' : 'center', px: 0.5 }}>
        <Tooltip title={expanded ? 'Collapse menu' : 'Expand menu'} placement={edge === 'end' ? 'left' : 'right'}>
          <IconButton aria-label={expanded ? 'Collapse menu' : 'Expand menu'} onClick={onToggle}>
            {expanded ? <ChevronLeftIcon sx={{ transform: edge === 'end' ? 'rotate(180deg)' : 'none' }} /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ overflow: 'auto', flex: 1, pb: 1 }}>
        {groups.map((group, index) => (
          <Box key={group.id}>
            {index > 0 && !expanded ? <Divider sx={{ my: 0.5, mx: 1 }} /> : null}
            {expanded ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 2, pt: 1, pb: 0.5 }}>
                {group.label}
              </Typography>
            ) : null}
            {group.items.map((item) => {
              const selected = activeId === item.id
              const button = (
                <ListItemButton
                  selected={selected}
                  aria-label={item.label}
                  onClick={() => onSelect(item.id)}
                  sx={{
                    minHeight: 40,
                    px: expanded ? 1.5 : 0,
                    mx: 0.5,
                    borderRadius: 1,
                    justifyContent: expanded ? 'flex-start' : 'center',
                    color: 'text.primary',
                    '&.Mui-selected': { bgcolor: 'action.selected', color: 'text.primary' },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: expanded ? 32 : 0,
                      color: selected ? 'primary.main' : 'text.secondary',
                      justifyContent: 'center',
                    }}
                  >
                    <NavIcon name={item.icon} />
                  </ListItemIcon>
                  {expanded ? (
                    <ListItemText primary={item.label} slotProps={{ primary: { variant: 'body2', color: 'text.primary' } }} />
                  ) : null}
                </ListItemButton>
              )
              if (expanded) return <Box key={item.id}>{button}</Box>
              return (
                <Tooltip key={item.id} title={item.label} placement={edge === 'end' ? 'left' : 'right'}>
                  {button}
                </Tooltip>
              )
            })}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
