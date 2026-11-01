import { useEffect, useRef, useState } from 'react'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { useCommit } from '../../features/directory/useDirectoryStore'
import { useSessionStore } from '../../features/session/useSessionStore'
import * as api from '../../shared/api/client'
import { EMPTY_LIST } from '../lib/empty'

export function UserMenu({ open = false, onOpenChange, buttonRef }) {
  const profile = useSessionStore((state) => state.session?.profile)
  const theme = useSessionStore((state) => state.session?.theme)
  const themes = useSessionStore((state) => state.session?.themes ?? EMPTY_LIST)
  const setTheme = useSessionStore((state) => state.setTheme)
  const signOut = useSessionStore((state) => state.signOut)
  const commit = useCommit()
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
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
            setPasswordOpen(true)
          }}
          sx={{ minHeight: 44 }}
        >
          Change password
        </MenuItem>
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
      <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" type="password" label="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          <TextField fullWidth margin="dense" type="password" label="New password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              commit((userId) => api.updatePassword(userId, currentPassword, nextPassword))
                .then(() => {
                  setPasswordOpen(false)
                  setCurrentPassword('')
                  setNextPassword('')
                })
                .catch(() => {})
            }
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
