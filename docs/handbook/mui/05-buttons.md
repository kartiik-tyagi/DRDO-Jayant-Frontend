# Buttons

## Button

```jsx
import { Button } from '@mui/material'

<Button variant="contained" onClick={save}>Save</Button>
<Button variant="outlined" onClick={close}>Cancel</Button>
<Button variant="text" color="inherit">More</Button>
```

| Prop | Values |
| --- | --- |
| `variant` | `contained` (fill), `outlined` (border), `text` (no chrome) |
| `color` | `primary`, `secondary`, `error`, `success`, `warning`, `info`, `inherit` |
| `size` | `small`, `medium`, `large` |
| `disabled` | Ignores clicks and fades |
| `fullWidth` | Stretches to the parent |
| `startIcon`, `endIcon` | An icon component |
| `href` | Renders a link. For a router path, use `component={RouterLink}` and `to`. |

```jsx
import { Link as RouterLink } from 'react-router-dom'

<Button component={RouterLink} to="/notes" variant="text">
  Notes
</Button>
```

This theme sets `textTransform: 'none'` and a minimum height of 40. Do not put the label in capitals in the source. The theme already refused the uppercase transform.

`disableElevation` removes the contained shadow. The default props can set it for every button in `createAppTheme` if a screen wants flat buttons.

A click handler is a function. `onClick={save}` passes the function. `onClick={save()}` calls it during render.

Disable the button while a save is in flight so a double click does not create two rows. Re-enable in `finally`.

## IconButton

```jsx
<IconButton aria-label="Close" onClick={onClose} size="small">
  <CloseIcon />
</IconButton>
```

`edge="end"` pulls it to the edge of a toolbar. `color="inherit"` matches the bar. The theme gives it a 40px target. Do not override `color` inside `MuiIconButton.styleOverrides`. A forced colour ignores the theme contrast.

`aria-pressed={open}` when the same icon toggles something on and off.

## Button group

```jsx
import { ButtonGroup } from '@mui/material'

<ButtonGroup variant="outlined" size="small">
  <Button onClick={() => setEdge('start')}>Start</Button>
  <Button onClick={() => setEdge('end')}>End</Button>
</ButtonGroup>
```

`orientation="vertical"` stacks them. One `disabled` on the group disables every child.

## Toggle buttons

```jsx
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

<ToggleButtonGroup
  exclusive
  size="small"
  value={tool}
  onChange={(_, next) => { if (next) setTool(next) }}
>
  <ToggleButton value="select">Select</ToggleButton>
  <ToggleButton value="line">Line</ToggleButton>
  <ToggleButton value="polygon">Area</ToggleButton>
</ToggleButtonGroup>
```

`exclusive` keeps one value. The change handler receives `null` when the person clicks the active button again. The `if (next)` guard keeps a tool selected. Without `exclusive`, `value` is an array.

## Fab

A floating action button. One primary action on a page, not a toolbar full of them.

```jsx
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

<Fab color="primary" aria-label="Add zone" onClick={add} sx={{ position: 'absolute', bottom: 16, right: 16 }}>
  <AddIcon />
</Fab>
```

The parent must be `position: 'relative'`. On the map, keep it clear of the OpenLayers zoom control, which this app parks at the bottom right. A left-side `Fab` avoids that collision.

`LoadingButton` is in `@mui/lab`, which is not installed. Use:

```jsx
<Button variant="contained" disabled={saving} onClick={save}>
  {saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}
</Button>
```
