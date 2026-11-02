# Setup

## What you import

```jsx
import { Box, Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '@mui/material/styles'
```

One import from `@mui/material` is tree-shaken by Vite. A deep import (`@mui/material/Button`) also works and is what `ThemeBridge` uses for `CssBaseline`. Either is fine. Do not import from `@mui/material/styles/styled` paths you invent. `styled`, `useTheme`, `alpha`, `createTheme`, and `ThemeProvider` are exported from `@mui/material/styles`.

## What is already mounted

```jsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  {children}
</ThemeProvider>
```

`CssBaseline` sets `box-sizing`, the body background, and the body text colour. Add it once. A second copy is harmless and useless.

## Installed

| Package | Version in this folder | Use |
| --- | --- | --- |
| `@mui/material` | 9.5.0 | Components |
| `@mui/icons-material` | 9.5.0 | Icons |
| `@mui/x-data-grid` | 9.16.0 | Data grid. No screen imports it yet. |
| `@emotion/react`, `@emotion/styled` | 11 | Required by MUI. Do not call Emotion yourself unless you are inside `styled`. |
| `@fontsource/roboto` | 5 | Weights 300, 400, 500, 700, imported in `main.jsx` |

## Not installed

Do not import these. The build fails offline because the package is absent.

| Package | What people expect from it |
| --- | --- |
| `@mui/lab` | LoadingButton, Timeline, Masonry |
| `@mui/x-date-pickers` | DatePicker, TimePicker |
| `@mui/x-charts` | LineChart, BarChart |
| `@mui/x-tree-view` | TreeView |
| `@mui/x-data-grid-pro` / `premium` | Pinning, row grouping, Excel export |
| `@mui/material-pigment-css` | Zero-runtime CSS. This app uses Emotion. |

A date is a `TextField` plus Day.js, or a native `<input type="date">` through `slotProps.htmlInput`. A loading button is a `Button` with `disabled` and a `CircularProgress`.

## Version differences that break old examples

Old posts were written for Material UI 5. In **this** version:

| Old example | This version |
| --- | --- |
| `<Grid item xs={6}>` | `<Grid size={{ xs: 12, md: 6 }}>` inside `<Grid container>`. There is no `item` prop and no `GridLegacy`. |
| `inputProps={{ maxLength: 8 }}` on `TextField` | `slotProps={{ htmlInput: { maxLength: 8 } }}` |
| `InputProps={{ startAdornment }}` | `slotProps={{ input: { startAdornment } }}` |
| `primaryTypographyProps` on `ListItemText` | `slotProps={{ primary: { variant: 'body2' } }}` |
| `<Typography display="block">` | No `display` prop. `sx={{ display: 'block' }}` or `component="div"`. |
| `LoadingButton` | Not installed. |

`Grid` `direction` accepts `row` and `row-reverse` only. A column of cards is `Stack`.
