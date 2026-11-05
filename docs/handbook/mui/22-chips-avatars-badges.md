# Chip, Avatar, Badge, Tooltip, Divider

## Chip

A compact status or a selected token.

```jsx
import { Chip } from '@mui/material'

<Chip label="Ready" size="small" color="success" />
<Chip label="Running" size="small" color="primary" />
<Chip label="Ended" size="small" variant="outlined" />
<Chip label="Blue force" size="small" onDelete={() => remove('blue')} />
```

`color` is `default`, `primary`, `secondary`, `error`, `info`, `success`, `warning`. `variant="outlined"` is quieter than the fill. `onDelete` shows a small close icon and is how a multi-select shows chosen people.

`clickable` and `onClick` make it a button. Give it a real action. A chip that only looks clickable is worse than text.

The game state in this app is `GameStateChip`. Follow that: one component, the label from the status, the colour from the status. Do not scatter one-off colours.

## Avatar

A circle with initials or an icon when you have no portrait. This product uses appointments, not personal photos. Initials of a role are enough. Do not invent a face.

```jsx
import { Avatar } from '@mui/material'

<Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
  A
</Avatar>
```

`color: 'primary.contrastText'` keeps the letter readable on the primary fill. A hex on `bgcolor` without a contrasting `color` fails on sand or night.

```jsx
<Avatar src={url} alt="APEX" />
```

If `src` fails, children render as the fallback. Always set `alt` when the avatar is the name of the control.

## Badge

A count or a dot on a corner of an icon.

```jsx
import { Badge } from '@mui/material'

<Badge badgeContent={alerts.length} color="error" max={99}>
  <NotificationsIcon />
</Badge>

<Badge variant="dot" color="success" invisible={status !== 'live'}>
  <span>Live</span>
</Badge>
```

`invisible` hides it without unmounting. `max={99}` shows `99+`. Do not badge a control that already has a text count. Pick one.

The live state in this app is `StatusBadge`, a written Live / Offline / Replay. Words beat a dot for that, because three states do not fit one colour. Use `Badge` for a count of unread alerts.

## Tooltip

```jsx
import { Tooltip } from '@mui/material'

<Tooltip title="Home extent">
  <IconButton aria-label="Home extent" onClick={home}>
    <HomeIcon />
  </IconButton>
</Tooltip>
```

`title` is the text. The child must hold a ref. A MUI button does. A plain function component does not, unless it forwards `ref`. Wrap a custom component in a `span` if the tooltip warns that it cannot listen to the child.

`placement` is `'top'`, `'bottom'`, `'left'`, `'right'`, and the `-start` / `-end` variants. Tooltips on a left rail should use `'right'` so they do not cover the icon. `enterDelay={400}` stops a flash while the pointer crosses the rail.

A tooltip is not a substitute for `aria-label`. The label is there when the pointer is not. Set both on icon-only buttons.

## Divider

```jsx
import { Divider } from '@mui/material'

<Divider />
<Divider flexItem orientation="vertical" />
<Divider textAlign="left">Map</Divider>
```

A horizontal rule in a column. `flexItem` plus `orientation="vertical"` is a rule in a row (`Stack direction="row"`). `light` is gone. Use `sx={{ borderColor: 'divider' }}` if the default is too strong. The palette `divider` is already what it uses.
