# 3. `styled` and the theme

`sx` is for one place. `styled` is for a component you will use more than once and want to name.

```jsx
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

const Rail = styled(Box)(({ theme }) => ({
  width: 72,
  flexShrink: 0,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}))
```

```jsx
<Rail component="nav">{children}</Rail>
```

`styled(Box)` keeps `sx`, `component`, and `ref`. `styled('div')` is a plain element with the Emotion class and still accepts `sx` when it comes from `@mui/material/styles`. Import `styled` from `@mui/material/styles`, not from `@emotion/styled`, so the theme argument is the MUI theme.

Transient props that should not reach the DOM take a `$` or a `shouldForwardProp` filter. If you pass `open={open}` to a styled `div`, React warns that `open` is not a DOM attribute. Filter it:

```jsx
const Panel = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? 300 : 0,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
}))
```

## Reading the theme in a component

```jsx
import { useTheme } from '@mui/material/styles'

const theme = useTheme()
const phone = useMediaQuery(theme.breakpoints.down('sm'))
```

`theme.palette.mode` is `'light'` or `'dark'`. `theme.palette.primary.main` is the button colour. `theme.spacing(2)` returns `'16px'`. `theme.breakpoints.down('sm')` returns the media-query string `useMediaQuery` expects.

`alpha` mixes a colour with transparency. The login page uses it:

```jsx
import { alpha } from '@mui/material/styles'
alpha(theme.palette.common.black, 0.4)
```

## What `createAppTheme` already sets

`src/shared/theme/createAppTheme.js` maps one catalog row onto Material. It does not invent colours. The twenty rows live in `src/shared/theme/palettes.js`. Map swatches and the picture inks live in `src/shared/theme/swatches.js`. Screens use palette paths, or a colour the snapshot already filled from a swatch.

A team stores a swatch id and a theme id. Another team cannot take either. Deleting the team frees both. Everyone on that team receives that theme at sign-in and cannot change it. APEX has no team. He keeps his own theme id and may choose any of the twenty, including one a team holds. His choice does not mark the theme taken. Before anyone is signed in, and when a team has no theme yet, the screen uses Pine, night.

Each row already says light or dark. There is no second mode switch. Font stays Roboto. Corner radius stays 8. The catalog checks contrast when it loads and throws if a row is below 4.5 to 1.

| Piece | Rule in this app |
| --- | --- |
| `palette.mode` | `'light'` or `'dark'` from the catalog row |
| `palette.primary.main` | The row’s action colour. `secondary` is the same colour. |
| `palette.primary.contrastText` | The text on that action colour. The catalog checks it. |
| `palette.text.primary` / `secondary` | Body and caption. Do not also set `color` inside a typography variant. |
| `palette.error`, `warning`, `success`, `info` | Status colours from the same row, with their contrast text. |
| `typography.fontFamily` | Roboto, then Segoe UI |
| `typography.button.textTransform` | `'none'` so buttons are not forced into capitals |
| `shape.borderRadius` | 8 |
| `MuiIconButton` | Minimum 40 by 40. It must not force `color`. |
| `MuiCssBaseline` body | Background and text colour from the row |

`ThemeBridge` memoizes that theme and wraps the tree:

```jsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  {children}
</ThemeProvider>
```

A component outside `ThemeProvider` has no theme. `useTheme` would throw or return the default, and `sx` palette paths would not match the appointment. Everything under `App` is already inside the provider. A portal such as `Dialog` or `Menu` is also inside it, because MUI forwards the theme into the portal.

## Overrides

For one screen, use `sx`. For every instance of a component, edit `components` in `createAppTheme`:

```js
MuiButton: {
  defaultProps: { disableElevation: true },
  styleOverrides: {
    root: { minHeight: 40, textTransform: 'none', fontWeight: 500 },
  },
},
```

`defaultProps` is the prop you would otherwise repeat. `styleOverrides.root` is the CSS for the root slot. Slot names match the component: `paper` on `Drawer` is not the root. Look at a rendered node’s class (`MuiButton-root`) before you invent a slot name.

Do not set `color` on `MuiTypography` variants in this object. It overrides the palette and has produced unreadable text on the light sand theme.

## CSS variables mode

`createTheme({ cssVariables: true, colorSchemes: { light: ..., dark: ... } })` is a different theme shape. This app passes `palette` and leaves `cssVariables` off, so it behaves as a single palette per `ThemeProvider`. Changing theme is a new catalog row through `ThemeBridge`, not `useColorScheme`. Leave `cssVariables` off unless you retest every screen.
