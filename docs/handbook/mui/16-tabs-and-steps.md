# Tabs, breadcrumbs, and stepper

## Tabs

```jsx
import { Box, Tab, Tabs } from '@mui/material'

const [tab, setTab] = useState('map')

<Tabs value={tab} onChange={(_, next) => setTab(next)}>
  <Tab label="Map" value="map" />
  <Tab label="Plan" value="plan" />
  <Tab label="Game" value="game" />
</Tabs>
<Box sx={{ pt: 2 }} hidden={tab !== 'map'}>Map tools</Box>
<Box sx={{ pt: 2 }} hidden={tab !== 'plan'}>Planning</Box>
```

`value` on `Tabs` must match a `Tab` `value`. If you omit `value` on `Tab`, the value is the index `0`, `1`, `2`. Mixing indexes and strings warns. Pick strings.

`onChange` receives the event and the next value. The underscore ignores the event.

`variant="scrollable"` and `scrollButtons="auto"` when the labels do not fit a phone. `orientation="vertical"` for tabs down the side of a panel. Vertical tabs need a height.

`textColor="inherit"` and `indicatorColor="primary"` on a coloured `AppBar`. On paper, the defaults are right.

Hiding a panel with `hidden` keeps it mounted. Unmounting (`tab === 'map' ? <MapTools /> : null`) resets its state. Unmount a heavy panel. Hide a small form whose fields should survive a tab change.

Do not put the map in a hidden tab. A map that mounts at `display: none` measures a zero size and stays blank until the window resizes. Mount the map only when its tab is visible, and call `map.updateSize()` after it is shown.

## Breadcrumbs

```jsx
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

<Breadcrumbs aria-label="Path">
  <Link component={RouterLink} to="/" underline="hover" color="inherit">
    Picture
  </Link>
  <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
    Administration
  </Link>
  <Typography color="text.primary">Zones</Typography>
</Breadcrumbs>
```

The last crumb is text, not a link. `separator` changes the slash. `maxItems={3}` collapses the middle on a small bar.

This app’s tools are panel state, not routes. Add breadcrumbs when you add real paths. A breadcrumb that calls `setPanel` instead of routing is a tab with extra punctuation. Use tabs.

## Stepper

```jsx
import { Step, StepLabel, Stepper } from '@mui/material'

const steps = ['Plan', 'Conduct', 'Review']

<Stepper activeStep={index} alternativeLabel>
  {steps.map((label) => (
    <Step key={label}>
      <StepLabel>{label}</StepLabel>
    </Step>
  ))}
</Stepper>
```

`activeStep` is a number starting at 0. `alternativeLabel` puts the label under the circle, which fits a bar. Layout-4’s phase control is three buttons, not a stepper, because a phase is a mode and not a wizard the person must finish in order. Use a stepper for a wizard: create a user, then assign a team, then confirm.

```jsx
<Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
  <Button disabled={index === 0} onClick={() => setIndex((n) => n - 1)}>Back</Button>
  <Button variant="contained" onClick={() => setIndex((n) => n + 1)}>
    {index === steps.length - 1 ? 'Finish' : 'Next'}
  </Button>
</Box>
```

`nonLinear` allows jumping. Then each `Step` can be clicked. A wizard that validates the current step should stay linear and refuse Next until the fields are valid.

## Bottom navigation

A phone footer of three to five destinations.

```jsx
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'

<BottomNavigation value={tab} onChange={(_, next) => setTab(next)} showLabels>
  <BottomNavigationAction label="Map" value="map" icon={<MapIcon />} />
  <BottomNavigationAction label="Plan" value="plan" icon={<PlanIcon />} />
</BottomNavigation>
```

Keep it `flexShrink: 0` at the bottom of the phone column. Five actions is the top of what fits. A rail of twenty tools is a drawer, not a bottom navigation.

## Pagination

For a list you slice yourself:

```jsx
import { Pagination } from '@mui/material'

<Pagination
  count={Math.ceil(rows.length / pageSize)}
  page={page}
  onChange={(_, next) => setPage(next)}
  color="primary"
/>
```

`page` is 1-based. Slice with `(page - 1) * pageSize`. Table pagination is a different component, in the table chapter. Data Grid paginates itself.
