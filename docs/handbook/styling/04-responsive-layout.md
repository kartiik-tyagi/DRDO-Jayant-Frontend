# 4. Responsive layout

## The height chain

This app is a full-viewport tool, not a scrolling document. The chain is:

1. `html, body, #root { height: 100%; overflow: hidden }` in `index.css`.
2. The shell is a column: `height: '100%'`, `display: 'flex'`, `flexDirection: 'column'`.
3. The map region is `flex: 1` and `minHeight: 0`.
4. `MapStage` fills that region. The map div is `position: 'absolute'` with `inset: 0`.

`minHeight: 0` matters because a flex item’s default minimum is its content size. Without it, the map refuses to shrink and the page grows past the viewport. `minWidth: 0` is the same idea on a row, and it is what lets a label ellipsis instead of pushing the clock off the bar.

`position: 'absolute'` with `inset: 0` sizes against the nearest positioned ancestor. `PictureWorkspace` stays `position: 'relative'` in normal flow. An absolute workspace with no such ancestor collapses the phone column to nothing.

## Flex

```jsx
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
  <Box sx={{ flexShrink: 0 }}>{/* bar */}</Box>
  <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
    <Box sx={{ width: 72, flexShrink: 0 }}>{/* rail */}</Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>{/* map */}</Box>
    <Box sx={{ width: 300, flexShrink: 0 }}>{/* panel */}</Box>
  </Box>
</Box>
```

| Property | Use |
| --- | --- |
| `flex: 1` | Take the leftover space |
| `flexShrink: 0` | Do not squash the bar, the rail, or the panel |
| `alignItems: 'center'` | Cross-axis centering. On a row, that is vertical. |
| `justifyContent: 'space-between'` | Main-axis distribution |
| `gap` | Space between items, without margin on the children |
| `flexWrap: 'wrap'` | Next line when the row is full |

`Stack` is flex with `spacing` already wired. Use it for a short group of buttons. Use `Box` when you need the height chain.

## Grid

MUI `Grid` in version 9 is the column grid. A container holds items. An item’s width is `size`, not `xs` on an `item` prop. That older API is not in this install.

```jsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 8 }}>
    <MapStage />
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    <ToolPanel />
  </Grid>
</Grid>
```

`size={12}` is the full width. `size={{ xs: 12, md: 6 }}` is full width on a phone and half from 900px up. `direction` on `Grid` is only `row` or `row-reverse`. A vertical stack is `Stack`, not `Grid direction="column"`.

CSS grid, when you are not using the MUI component:

```jsx
<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 300px' }, minHeight: 0, flex: 1 }}>
```

## Breakpoints

| Key | Min width |
| --- | --- |
| `xs` | 0 |
| `sm` | 600px |
| `md` | 900px |
| `lg` | 1200px |
| `xl` | 1536px |

```jsx
const theme = useTheme()
const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
```

`down('sm')` is everything below 600px. `up('md')` is 900 and above. `between('sm', 'md')` is 600 up to, and not including, 900. The shells use `down('sm')` to switch the rail for a temporary drawer.

In `sx`, the object form is mobile-first: the `xs` value applies until a larger key matches. In `useMediaQuery`, you name the query you want. Do not mix them up and write `down` when you meant the `sx` object.

## A page with a bar, a sidebar, and a footer

```jsx
<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
  <Box component="header" sx={{ flexShrink: 0 }}>{/* navbar */}</Box>
  <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
    <Box component="nav" sx={{ width: { xs: 0, sm: 240 }, flexShrink: 0 }}>{/* sidebar */}</Box>
    <Box component="main" sx={{ flex: 1, minWidth: 0, overflow: 'auto' }}>{/* content */}</Box>
  </Box>
  <Box component="footer" sx={{ flexShrink: 0 }}>{/* footer */}</Box>
</Box>
```

`component` changes the DOM element and keeps `sx`. The header, nav, main, and footer are real landmarks. Screen readers use them. The map page hides overflow on `main` only when the content must scroll inside the leftover space. The map itself must not be inside an extra scroll container, or the pointer position drifts.

## Overflow

`overflow: 'hidden'` clips. `overflow: 'auto'` scrolls that box and not the document. Put `auto` on the column that should scroll (a long list in the tool panel). Leave the map’s parent as `hidden` or visible within the flex cell. Two nested `overflow: auto` parents make a scrollbar inside a scrollbar.

Text that must ellipsis needs four declarations, and a parent that can shrink:

```jsx
sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
```

`noWrap` on `Typography` sets the last three. The parent still needs `minWidth: 0` inside a flex row.
