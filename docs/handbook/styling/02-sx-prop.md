# 2. The `sx` prop

`sx` is the styling prop on every MUI component, including `Box`. It accepts a plain object, an array of objects, or a function of the theme. Emotion turns it into a class.

```jsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    gap: 1,
    p: 2,
    color: 'text.primary',
    bgcolor: 'background.paper',
    borderBottom: 1,
    borderColor: 'divider',
  }}
/>
```

Numbers for spacing are multiples of the theme spacing. The default is 8px. `p: 2` is 16px of padding on every side. `gap: 1` is 8px. `p: '12px'` is a raw CSS length when you need a value that is not on the scale. `border: 1` means 1px solid, and `borderColor` supplies the colour.

## Shorthand

| Key | CSS |
| --- | --- |
| `m`, `mt`, `mr`, `mb`, `ml`, `mx`, `my` | margin |
| `p`, `pt`, `pr`, `pb`, `pl`, `px`, `py` | padding |
| `bgcolor` | background-color |
| `color` | color |
| `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight` | the same words |
| `display`, `position`, `overflow`, `gap` | the same words |
| `flex`, `flexDirection`, `alignItems`, `justifyContent` | flex |
| `border`, `borderRadius`, `borderColor` | border |
| `zIndex` | a number, or `'drawer'`, `'modal'`, `'tooltip'` from the theme |
| `typography` | a variant name, such as `'body2'` |

Palette paths work as strings: `'primary.main'`, `'text.secondary'`, `'background.default'`, `'divider'`, `'error.main'`. A function gives you the theme object when the string is not enough:

```jsx
sx={(theme) => ({
  bgcolor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
})}
```

`theme.shadows` is an array of 25 shadow strings, index 0 through 24.

## Responsive values

A breakpoint key replaces the value from that width upward.

```jsx
sx={{
  display: { xs: 'none', sm: 'block' },
  width: { xs: '100%', sm: 300 },
  px: { xs: 1, md: 2 },
}}
```

`xs` is 0px and applies first. `sm` is 600, `md` 900, `lg` 1200, `xl` 1536. Unlisted breakpoints keep the previous value. This is how `TopBar` hides the clock on a phone: `display: { xs: 'none', sm: 'block' }`.

## Pseudo and children

```jsx
sx={{
  '&:hover': { bgcolor: 'action.hover' },
  '&.Mui-selected': { bgcolor: 'action.selected' },
  '& .MuiListItemText-primary': { fontWeight: 600 },
}}
```

`&` is the component itself. A space plus a class reaches a descendant. MUI puts those class names on the DOM (`MuiListItemText-primary`, `MuiDrawer-paper`). Prefer `slotProps` or the component’s own `sx` before you reach through with a descendant selector. A descendant selector breaks when MUI renames a slot. It is the right tool for `Drawer` paper width, because the paper is not the root you put `sx` on:

```jsx
sx={{ '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box' } }}
```

## Array form

Later objects override earlier ones.

```jsx
sx={[{ p: 2 }, floating && { bgcolor: 'transparent', borderBottom: 0 }]}
```

`false` in the array is ignored. That is the conditional form.

## What does not belong in `sx`

- A new theme colour. Put it in `createAppTheme` or in the fixture theme.
- A password, a url, or any data. `sx` is presentation.
- `display: 'block'` on `Typography` via a `display` prop. That prop does not exist in this version. The key inside `sx` is the one that works.

`style={{ color: 'red' }}` still works and beats `sx`. Use it only for a value that is computed per frame and must be inline. Everything else is `sx`.
