# Sidebar

A sidebar is a column of navigation beside the content. MUI’s component is `Drawer`. This app’s left rail (`IconRail`) and right tool column are plain `Box`es, because their width is part of the layout and they are not a modal. Use `Drawer` when the column can open and close, especially on a phone.

## Permanent

Always visible. Push the content aside. Do not cover it.

```jsx
import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material'

const width = 240

<Drawer
  variant="permanent"
  sx={{
    width,
    flexShrink: 0,
    '& .MuiDrawer-paper': { width, boxSizing: 'border-box' },
  }}
>
  <Toolbar variant="dense" />
  <List>
    {items.map((item) => (
      <ListItemButton key={item.id} selected={item.id === current} onClick={() => select(item.id)}>
        <ListItemText primary={item.label} slotProps={{ primary: { variant: 'body2' } }} />
      </ListItemButton>
    ))}
  </List>
</Drawer>
```

Set the width on both the root and the paper. The paper is the visible column. The root only reserves space in a permanent or persistent drawer.

The paper’s default style is `position: fixed` and `top: 0`, so it covers a header that sits above the drawer in the same column. When the bar is in normal flow, put the paper back in flow:

```jsx
'& .MuiDrawer-paper': { width, boxSizing: 'border-box', position: 'relative' }
```

Keep `position: 'fixed'` for `variant="temporary"`, where the drawer is supposed to cover the page. A fixed `AppBar` is the other case: leave the paper fixed and put an empty `Toolbar` inside the drawer so the first item starts below the bar.

Put the drawer and the main area in a row:

```jsx
<Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
  <Drawer variant="permanent" sx={drawerSx}>{nav}</Drawer>
  <Box component="main" sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
</Box>
```

## Temporary

Covers the content. Closes on Escape and on the backdrop. This is the phone menu.

```jsx
<Drawer variant="temporary" open={open} onClose={() => setOpen(false)}>
  <Box sx={{ width: 280 }} role="presentation">
    {nav}
  </Box>
</Drawer>
```

The temporary drawer’s width is the width of its child. Set it. `anchor="right"` opens from the right, which is layout-4’s side. The default anchor is `left`.

## Persistent

Stays mounted and pushes content, but can close. You animate the width yourself. Permanent plus a collapsed width of 72 is simpler and is what a rail already is. Use persistent when the open state must shove the map and the closed state must give the space back with a transition.

```jsx
<Drawer
  variant="persistent"
  open={open}
  sx={{
    width: open ? 240 : 0,
    flexShrink: 0,
    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
  }}
>
  {nav}
</Drawer>
```

## One component, two variants

```jsx
const isPhone = useMediaQuery(theme.breakpoints.down('sm'))

<Drawer
  variant={isPhone ? 'temporary' : 'permanent'}
  open={isPhone ? mobileOpen : true}
  onClose={() => setMobileOpen(false)}
  sx={{
    width: isPhone ? 0 : 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
  }}
>
  {nav}
</Drawer>
```

On a phone the hamburger in the navbar sets `mobileOpen`. Selecting an item should call `onClose` as well, or the drawer stays on top of the page they just chose.

## Rail

A rail is a permanent column of icons, about 72px, with `aria-label` on each `IconButton` and `aria-pressed` when that tool is open. Labels can sit under the icon as `Typography variant="caption"`, or appear in a `Tooltip`. `IconRail` and `IconStrip` are in this repo and are not mounted. The shells use `ApplicationMenu` for `session.sections` and `MapToolbar` for the picture tools.

## Scroll

If the list is taller than the viewport, let the drawer paper scroll: `'& .MuiDrawer-paper': { overflowY: 'auto' }`. Do not let that scroll become the document scroll. The map’s parent stays `overflow: hidden`.
