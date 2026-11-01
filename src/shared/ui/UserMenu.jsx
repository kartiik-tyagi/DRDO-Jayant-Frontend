import { useEffect, useRef, useState } from 'react'
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'

export function UserMenu({ open = false, onOpenChange, buttonRef }) {
  const profile = useSessionStore((state) => state.session?.profile)
  const theme = useSessionStore((state) => state.session?.theme)
  const themes = useSessionStore((state) => state.session?.themes || [])
  const setTheme = useSessionStore((state) => state.setTheme)
  const signOut = useSessionStore((state) => state.signOut)
  const localRef = useRef(null)
  const ref = buttonRef || localRef
  const [anchor, setAnchor] = useState(null)

  useEffect(() => {
    if (open) setAnchor(ref.current)
  }, [open, ref])

  const close = () => {
    setAnchor(null)
    onOpenChange?.(false)
  }

  if (!profile) return null

  return (
    <>
      <IconButton ref={ref} aria-label={`${profile.title} profile`} onClick={(event) => setAnchor(event.currentTarget)}>
        <Avatar src={profile.avatarUrl} alt="" variant="rounded" sx={{ width: 36, height: 36 }} />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        <Box sx={{ px: 2, py: 1, width: 280 }}>
          <Typography variant="subtitle1">{profile.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.role}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {profile.service}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 2, pt: 1 }}>
          <Typography variant="overline">Theme</Typography>
        </Box>
        {themes.map((item) => (
          <MenuItem
            key={item.id}
            selected={item.id === theme?.id}
            onClick={() => {
              setTheme(item.id)
              close()
            }}
            sx={{ minHeight: 44 }}
          >
            {item.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            close()
            signOut()
          }}
          sx={{ minHeight: 44 }}
        >
          Sign out
        </MenuItem>
      </Menu>
    </>
  )
}
