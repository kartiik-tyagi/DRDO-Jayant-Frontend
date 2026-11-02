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

`src/shared/theme/createAppTheme.js` builds the theme from the appointment’s theme object.

| Piece | Rule in this app |
| --- | --- |
| `palette.mode` | `'light'` or `'dark'` from the fixture |
| `palette.primary.main` | The appointment colour, default `#3caf72` |
| `palette.primary.contrastText` | The text on a contained primary button. Field uses `#062116` on `#3caf72`. Night uses `#0c1218` on `#8eb7e0`. Sand uses `#fffdf8` on `#5a4616`. |
| `palette.text.primary` / `secondary` | Body copy. Do not also set `color` inside a typography variant. |
| `typography.fontFamily` | Roboto, then Segoe UI |
| `typography.button.textTransform` | `'none'` so buttons are not forced into capitals |
| `shape.borderRadius` | 8, unless the fixture sets one |
| `MuiIconButton` | Minimum 40 by 40. It must not force `color`. |
| `MuiCssBaseline` body | Background and text colour |

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

`createTheme({ cssVariables: true, colorSchemes: { light: ..., dark: ... } })` is a different theme shape. This app passes `palette` and leaves `cssVariables` off, so it behaves as a single palette per `ThemeProvider`. Switching night and field is a new theme object from `ThemeBridge`, not `useColorScheme`. Leave `cssVariables` off unless you retest every screen.
