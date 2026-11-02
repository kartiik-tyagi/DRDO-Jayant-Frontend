# Box, Stack, Grid, Container

## Box

`Box` renders a `div` and accepts `sx`. Change the element with `component`.

```jsx
<Box
  component="section"
  sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 1, p: 2 }}
>
  {children}
</Box>
```

`component="header"`, `"nav"`, `"main"`, and `"footer"` keep the layout props and give the page landmarks. `ref` reaches the DOM node. That is how the map div is held.

## Stack

A flex column, or a row, with spacing between children.

```jsx
<Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
  <Button>Save</Button>
  <Button>Cancel</Button>
</Stack>

<Stack spacing={2} sx={{ p: 2 }}>
  <TextField label="Name" />
  <TextField label="Team" />
</Stack>
```

`spacing={1}` is 8px. `divider={<Divider flexItem />}` puts a divider between items. Use `Stack` for forms and button rows. Use `Box` when you are building the height chain (`flex: 1`, `minHeight: 0`).

## Grid

Twelve columns. The container and the items are both `Grid`. Items use `size`.

```jsx
import { Grid, Paper } from '@mui/material'

<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 8 }}>
    <Paper sx={{ p: 2, height: '100%' }}>Map</Paper>
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    <Paper sx={{ p: 2 }}>Tools</Paper>
  </Grid>
</Grid>
```

| Prop | Where | Meaning |
| --- | --- | --- |
| `container` | parent | Enables the grid |
| `spacing` | container | Gap. `2` is 16px. |
| `size` | item | `12` full, `6` half, `{ xs: 12, md: 4 }` responsive |
| `offset` | item | Skip columns. `offset={{ md: 2 }}` |
| `columns` | container | Default 12. Change only when you mean to. |
| `wrap` | container | `'wrap'` (default), `'nowrap'`, `'wrap-reverse'` |

A nested grid is a new `container` inside an item. `direction="column"` is rejected. Stack vertically with `Stack`.

Give a grid child `height: '100%'` only when the row has a real height. A grid of papers in a scrolling page can size to content.

## Container

Centers a column and caps its width.

```jsx
<Container maxWidth="md" sx={{ py: 3 }}>
  {children}
</Container>
```

`maxWidth` is `'xs' | 'sm' | 'md' | 'lg' | 'xl' | false`. `false` is fluid. This app’s map must not sit inside a `Container`. The container’s max width leaves empty gutters and the picture stops being full-bleed. Use `Container` for a reading page or a settings form, not for `Shell`.

## Paper as a surface

`Paper` is a `Box` with background `palette.background.paper` and an elevation shadow.

```jsx
<Paper elevation={1} sx={{ p: 2 }}>
  Holding area
</Paper>
```

`elevation={0}` plus a border is quieter and matches the tool panels better than a heavy shadow. `variant="outlined"` draws the border and drops the shadow.
