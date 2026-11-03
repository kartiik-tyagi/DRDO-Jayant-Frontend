# Theme

`createAppTheme` in `src/shared/theme/createAppTheme.js` maps one catalog row onto Material. `ThemeBridge` uses the signed-in appointment’s row, and the login context row before that. The rows live in `src/shared/theme/palettes.js`. Do not add a colour in a screen. A team locks one theme and one map swatch. APEX may wear any theme, including one a team holds, and that does not mark it taken.

```js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3caf72', contrastText: '#062116' },
    secondary: { main: '#d4b15a', contrastText: '#1c1914' },
    background: { default: '#0d1411', paper: '#16211c' },
    text: { primary: '#e8f0ea', secondary: '#b7c6bd' },
    divider: 'rgba(232, 240, 234, 0.16)',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 40 } },
    },
  },
})
```

Passing `palette` without `cssVariables` keeps a single scheme, which is what `ThemeBridge` does. Each catalog row is one theme object. Day and night are separate rows, not a toggle inside one CSS-variable theme.

## Palette

| Path in `sx` | Where it is set |
| --- | --- |
| `primary.main` | Buttons, switches, the active tab |
| `primary.contrastText` | Text on a contained primary button |
| `text.primary`, `text.secondary` | Body copy |
| `background.default` | The page behind paper |
| `background.paper` | Bars, drawers, dialogs |
| `divider` | Borders |
| `error.main`, `success.main`, `warning.main`, `info.main` | Alerts and chips. Defaults exist if you do not set them. |
| `action.hover`, `action.selected` | List hover and the selected row |

`contrastText` must be readable on `main`. The catalog checks body text, caption text, and action text at load and throws if a row is below 4.5 to 1. Do not pick a new action colour in a component.

`palette.mode` is `'light'` or `'dark'` and already lives on the catalog row. This app sets text and background from that row, so mode alone is not the whole story.

## Typography in the theme

Set size, weight, and line height. Do not set `color` on a variant. A colour there fights `color="text.primary"` and has made the light theme unreadable.

```js
typography: {
  h6: { fontSize: '1.05rem', fontWeight: 600 },
  body2: { lineHeight: 1.45 },
}
```

Roboto is loaded in `main.jsx` from `@fontsource/roboto` at 300, 400, 500, and 700. A weight you do not import falls back to another weight. 600 is requested for headings. The installed files are 300, 400, 500, and 700, so 600 synthesizes or falls back. That is acceptable. Do not add a network font.

## Component overrides

`defaultProps` is what you would otherwise repeat. `styleOverrides` is CSS for a slot.

| Key | Applies to |
| --- | --- |
| `root` | The outer node |
| `paper` | Drawer and Dialog paper, when that slot exists |

Look at the DOM class before inventing a slot. `MuiButton-root` means `MuiButton.styleOverrides.root`.

`MuiIconButton` in this app sets a 40px minimum and does not set `color`. A colour in that override locks every icon button to one value and ignores `color="inherit"` on a bar.

## Reading it back

```jsx
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const theme = useTheme()
theme.palette.primary.main
theme.spacing(2)          // '16px'
theme.shadows[4]
theme.zIndex.modal        // 1300
useMediaQuery(theme.breakpoints.down('sm'))
```

`alpha` from `@mui/material/styles` builds a transparent colour from a solid one. Use it for a wash over the login photograph. Do not hand-write `rgba` for a palette colour that might change.

## Nesting providers

A second `ThemeProvider` under the first replaces the theme for its children. You do not need one per layout. The four shells share `ThemeBridge`. A dialog portal still sees that theme.

## What not to turn on

`cssVariables: true` and `colorSchemes` change how palette paths resolve. This app does not use them. Turning them on without retesting every layout will desync the map ground, the login wash, and the contrast text. Switch themes by passing another catalog row to `createAppTheme`, which is already the path in `ThemeBridge`. APEX chooses his row from the profile menu. That choice is written on his record, so a refresh keeps it. Everyone else keeps the theme stored on their team.
