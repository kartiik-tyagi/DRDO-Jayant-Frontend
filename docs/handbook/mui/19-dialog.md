# Dialog

A modal. Focus moves inside it. Escape and the backdrop close it, unless you prevent that. This app’s confirm, draft, entity, and password dialogs are this component. `ConfirmDialog` in `src/shared/ui/ConfirmDialog.jsx` is the shared yes/no. Reuse it for a destructive confirm.

```jsx
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
  <DialogTitle>Zone</DialogTitle>
  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <TextField
      autoFocus
      label="Name"
      value={name}
      onChange={(event) => setName(event.target.value)}
      sx={{ mt: 1 }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="contained" onClick={save}>Save</Button>
  </DialogActions>
</Dialog>
```

The outlined label is clipped by the content padding. `sx={{ mt: 1 }}` on the first field, or `DialogContent`’s default top padding, keeps the notch visible. If the notch is cut off, add that margin. Do not remove the label.

## Props

| Prop | Meaning |
| --- | --- |
| `open` | Mounts the dialog when true |
| `onClose` | Escape, backdrop, or your Cancel. The reason is the second argument: `'escapeKeyDown'`, `'backdropClick'`. |
| `fullWidth` | The paper grows to `maxWidth` |
| `maxWidth` | `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`, `false` |
| `fullScreen` | Covers the viewport. Use it on a phone for a long form. |
| `scroll` | `'paper'` (default, the content scrolls) or `'body'` |

Ignore `onClose` while a save is running if a backdrop click would drop a request you still need:

```jsx
onClose={() => { if (!saving) setOpen(false) }}
```

Close on success, in `.then`. Leave the dialog open on failure so the person can fix the field. The toast already carries `error.message`.

```jsx
commit((userId) => api.saveZone(userId, { name }))
  .then(() => setOpen(false))
  .catch(() => {})
```

## Confirm

```jsx
<Dialog open={Boolean(pendingId)} onClose={cancel}>
  <DialogTitle>Change scenario?</DialogTitle>
  <DialogContent>
    <Typography variant="body2">The picture will follow the new scenario.</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={cancel}>Cancel</Button>
    <Button variant="contained" onClick={confirm}>Change</Button>
  </DialogActions>
</Dialog>
```

Cancel must not call the API and must not log. Confirm calls one function. If the API returns “End the game before changing the scenario.”, keep this dialog open and show that sentence. Closing it throws away the pending id and forces the person to open the menu again.

## Resetting fields

A dialog that stays mounted keeps its `useState`. Clear fields when it opens:

```jsx
useEffect(() => {
  if (open) setName('')
}, [open])
```

Or give the form `key={open ? id : 'closed'}` so it remounts.

## Two dialogs

Do not open a second `Dialog` on top of a `Menu` without closing the menu. Do not nest dialogs unless the second is a confirm about the first. Two `open` dialogs fight for focus. Close the parent, or render the confirm as the only open dialog.

## Transitions

`slots={{ transition: Slide }}` and `slotProps={{ transition: { direction: 'up' } }}` if you need a direction. The default fade is enough. `TransitionProps` is the older name. Prefer `slotProps.transition` in new code.
