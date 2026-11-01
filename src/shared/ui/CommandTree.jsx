import { useState } from 'react'
import { Box, Chip, IconButton, List, ListItemButton, ListItemText } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

function Branch({ node, depth, selectedId, onSelect }) {
  const [open, setOpen] = useState(true)
  const children = node.children || []
  const selected = node.id === selectedId

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'stretch', pl: depth * 2 }}>
        {children.length > 0 ? (
          <IconButton
            size="small"
            aria-label={open ? `Collapse ${node.title}` : `Expand ${node.title}`}
            onClick={() => setOpen((value) => !value)}
            sx={{ alignSelf: 'center' }}
          >
            {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        ) : (
          <Box sx={{ width: 44, flexShrink: 0 }} />
        )}
        <ListItemButton
          selected={selected}
          onClick={() => onSelect(node.id)}
          sx={{ flex: 1, alignItems: 'flex-start', borderRadius: 1 }}
        >
          <ListItemText primary={node.title} secondary={node.service} sx={{ my: 0.25 }} />
          <Chip
            size="small"
            label={node.kind === 'asset' ? 'Asset' : 'Appointment'}
            variant={node.kind === 'asset' ? 'outlined' : 'filled'}
            color={node.kind === 'asset' ? 'default' : 'primary'}
            sx={{ ml: 1, mt: 0.5 }}
          />
        </ListItemButton>
      </Box>
      {open
        ? children.map((child) => (
            <Branch
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))
        : null}
    </>
  )
}

export function CommandTree({ root, selectedId, onSelect }) {
  if (!root) return null
  return (
    <List component="div" disablePadding aria-label="Playing command">
      <Branch node={root} depth={0} selectedId={selectedId} onSelect={onSelect} />
    </List>
  )
}
