# Lists

The rails, the feature table, and the filter rows are lists.

```jsx
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import TableRowsIcon from '@mui/icons-material/TableRows'

<List dense disablePadding>
  {features.map((feature) => (
    <ListItemButton
      key={feature.id}
      selected={feature.id === selectedId}
      onClick={() => select(feature.id)}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>
        <TableRowsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primary={feature.name}
        secondary={feature.featureType}
        slotProps={{
          primary: { variant: 'body2', color: 'text.primary', noWrap: true },
          secondary: { variant: 'caption' },
        }}
      />
    </ListItemButton>
  ))}
</List>
```

`dense` shortens the row. `disablePadding` removes the list’s own padding when the panel already has some. `selected` paints the active row. It is a visual and an accessibility state. Set it from the id, not from a hover.

## Text slots

`slotProps.primary` and `slotProps.secondary` are how you pass `Typography` props in this version. `primaryTypographyProps` is the old name and is not the prop to use.

`ListItemText` accepts `inset` when the row has no icon and must line up with rows that do.

## Button versus static row

`ListItemButton` is the clickable row. `ListItem` is a static row. Put a secondary action in `secondaryAction` on `ListItem`:

```jsx
<ListItem
  secondaryAction={
    <IconButton edge="end" aria-label={`Delete ${feature.name}`} onClick={() => remove(feature.id)}>
      <DeleteIcon />
    </IconButton>
  }
>
  <ListItemText primary={feature.name} />
</ListItem>
```

Do not put an `IconButton` inside a `ListItemButton`. Nested buttons are invalid HTML. If the row and the icon both click, use `ListItem` plus `secondaryAction`, or one button for the whole row.

## Section headers

```jsx
import { ListSubheader } from '@mui/material'

<List subheader={<ListSubheader>Map</ListSubheader>}>
  {items}
</List>
```

`ListSubheader` sticks to the top of a scrolling list. Disable that with `disableSticky` if it covers the first row inside a short panel.

## Empty

An empty `map` renders nothing and looks broken.

```jsx
{features.length === 0 ? (
  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
    No features on this picture.
  </Typography>
) : (
  <List dense>{rows}</List>
)}
```

`EmptyState` in `src/shared/ui/EmptyState.jsx` is the shared sentence. Use it.

## Dividers

`<Divider component="li" />` inside a `List`, so the markup stays a list. A plain `Divider` between lists, not between items, is also fine.

## Nested

A group that expands is `Collapse` around a child `List`, toggled by `useState`. The parent row is a `ListItemButton` with an expand icon. `Collapse in={open}` animates the height. Keep the child list `disablePadding` so the indent is the one you set with `sx={{ pl: 2 }}`.
