# Menu and Popover

A menu is a list anchored to the element that opened it. A popover is the same layer with your own content. Layout-3 uses a popover for the tool panel. The user menu uses a menu.

## Menu

```jsx
import { Menu, MenuItem } from '@mui/material'

const [anchor, setAnchor] = useState(null)

<Button onClick={(event) => setAnchor(event.currentTarget)}>Account</Button>
<Menu
  anchorEl={anchor}
  open={Boolean(anchor)}
  onClose={() => setAnchor(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <MenuItem onClick={() => { setAnchor(null); openPassword() }}>Change password</MenuItem>
  <MenuItem onClick={() => { setAnchor(null); signOut() }}>Sign out</MenuItem>
</Menu>
```

`anchorEl` is the DOM node. Store `event.currentTarget`, the button, not `event.target`. If the click lands on an icon inside the button, `target` is the icon and the menu anchors to a smaller box.

`open={Boolean(anchor)}` is false when `anchor` is `null`. `onClose` runs for Escape and for a click outside. Close the menu inside each item’s handler too, or it stays open after the action.

`dense` tightens the rows. `MenuListProps` is still accepted. In new code, prefer `slotProps` when you only need to mark one item selected.

A disabled item:

```jsx
<MenuItem disabled>Game Charlie · Closed</MenuItem>
```

A divider between groups: `<Divider />` between `MenuItem`s.

## Popover

```jsx
import { Popover } from '@mui/material'

<Popover
  open={Boolean(anchor)}
  anchorEl={anchor}
  onClose={() => setAnchor(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <Box sx={{ p: 2, width: 320 }}>
    <Typography variant="subtitle2">Planning</Typography>
  </Box>
</Popover>
```

Put a width on the content. The popover sizes to its child. A form with `fullWidth` fields needs that width or the fields collapse.

`keepMounted` keeps the child mounted while closed. Leave it off unless a child must preserve state across open and close. A closed popover that stays mounted still runs its effects.

## Click away

`ClickAwayListener` closes a custom panel that is not a `Menu` or `Popover`. Those two already close on an outside click. Wrap your own floating card:

```jsx
import ClickAwayListener from '@mui/material/ClickAwayListener'

{open ? (
  <ClickAwayListener onClickAway={() => setOpen(false)}>
    <Paper sx={{ position: 'absolute', top: 48, right: 8, width: 280 }}>{children}</Paper>
  </ClickAwayListener>
) : null}
```

The parent is `position: 'relative'`. A `Menu` is easier than rebuilding one.

## Where the layer attaches

Menu and Popover render in a portal on `document.body`. A parent with `overflow: hidden` does not clip them. `zIndex` comes from the modal layer (1300), under snackbars and tooltips. You rarely set it.

Do not put a `Menu` inside a `Menu`. Close the first, then open a dialog. Nested menus lose focus.
