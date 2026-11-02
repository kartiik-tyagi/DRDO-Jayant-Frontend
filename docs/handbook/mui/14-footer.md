# Footer

A footer is the last row of the shell: status, coordinates, a short legal line, or the measure readout. MUI has no `Footer` component. Use `Box component="footer"`.

```jsx
<Box
  component="footer"
  sx={{
    flexShrink: 0,
    minHeight: 32,
    px: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    borderTop: 1,
    borderColor: 'divider',
    bgcolor: 'background.paper',
    color: 'text.secondary',
  }}
>
  <Typography variant="caption">24.5000, 82.0000</Typography>
  <Box sx={{ flex: 1 }} />
  <Typography variant="caption">Zoom 5</Typography>
</Box>
```

`flexShrink: 0` keeps the row when the map wants the space. The parent is a column with `height: '100%'`. The map region above has `flex: 1` and `minHeight: 0`. The footer then sits on the bottom of the viewport without `position: fixed`.

## Fixed footer

`position: 'fixed'`, `bottom: 0`, `left: 0`, `right: 0` pins it to the viewport and takes it out of flow. The content needs `pb` equal to the footer height or the last row hides underneath. This app does not do that. A static flex footer is easier to keep aligned with the sidebar, because a fixed footer ignores the sidebar and draws across it unless you also set `left` to the sidebar width.

## AppBar as a footer

`AppBar position="static"` at the bottom of the column works if you want the same surface as the navbar. `color="default"` and `elevation={0}` keep it flat. Do not use `position="fixed"` on that `AppBar` unless you add the spacer.

## What belongs there

| Good | Poor |
| --- | --- |
| Pointer coordinates, zoom, scale | A second navigation that copies the sidebar |
| The measure readout | Buttons that commit data with no label |
| A one-line connection state | A form |

`MapStage` already has a readout line. Extend that pattern rather than adding a second bar that covers the OpenLayers scale line. The scale line is at the bottom left of the map. A footer outside the map, in the shell column, does not cover it. A footer drawn on top of the map does.

## A scrolling page

If a page is a document rather than the picture, drop `overflow: hidden` on that page only and let the footer follow the content:

```jsx
<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
  <Header />
  <Box component="main" sx={{ flex: 1 }}>{children}</Box>
  <Footer />
</Box>
```

`minHeight: '100%'` lets the column grow with the content and still fill the screen when the content is short. The map shell uses `height: '100%'` and `overflow: hidden` instead, because the picture must not grow the document.
