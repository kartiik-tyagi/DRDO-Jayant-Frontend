# Icons

Icons come from `@mui/icons-material`. Each icon is a component. The folder name is the component name.

```jsx
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'

<ShieldOutlinedIcon fontSize="small" color="primary" />
```

## Names

| Suffix | Style |
| --- | --- |
| none, `Shield` | Filled |
| `Outlined` | Outlined. This app’s nav uses outlined icons. |
| `Rounded` | Rounded |
| `TwoTone` | Two tone |
| `Sharp` | Sharp |

The import path must match a file that exists. `PlayCircleOutline` is not a file. `PlayCircleOutlined` is. The Vite overlay names the missing module. Guessing a shorter name wastes a build.

`fontSize` is `'small'`, `'medium'`, `'large'`, or `'inherit'`. `color` is a palette key: `'primary'`, `'action'`, `'error'`, `'inherit'`. `inherit` takes the button’s colour, which is what you want inside `IconButton`.

## In a button

```jsx
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

<IconButton aria-label="Open menu" onClick={open}>
  <MenuIcon />
</IconButton>
```

An icon with no text needs `aria-label` on the button. The icon is `aria-hidden` by MUI. Without the label, the control has no name.

```jsx
<Button startIcon={<AddIcon />} onClick={add}>
  Zone
</Button>
```

`startIcon` and `endIcon` are for `Button`. Do not put an `IconButton` inside a `Button`.

## A map of names

`src/shared/ui/navIcons.jsx` turns a string from the server (`'shield'`, `'flags'`) into a component. Add a line there when a new menu id needs a new picture. The menu data stays a string. Components are not sent over the API.

```jsx
const ICONS = {
  shield: ShieldOutlinedIcon,
  flag: FlagOutlinedIcon,
}

export function NavIcon({ name }) {
  const Icon = ICONS[name] || LayersOutlinedIcon
  return <Icon fontSize="small" />
}
```

## Your own SVG

```jsx
import { SvgIcon } from '@mui/material'

<SvgIcon viewBox="0 0 24 24" fontSize="small">
  <path d="M4 12h16" />
</SvgIcon>
```

Keep the view box at 24 so it matches the Material icons. Do not drop an `<img>` of an icon into the rail. It will not follow `color` or `fontSize`.
