# Paper, Card, and Accordion

## Paper

The surface. Background is `background.paper`. Elevation is a shadow from the theme.

```jsx
<Paper variant="outlined" sx={{ p: 2 }}>
  <Typography variant="subtitle2">Holding area</Typography>
  <Typography variant="body2" color="text.secondary">Blue force</Typography>
</Paper>
```

`variant="outlined"` fits a tool panel. `elevation={2}` is a floating card over the map. A floating card’s parent is `position: 'relative'`, and the card is `position: 'absolute'` with a corner (`top: 8`, `left: 8`) and a max height so it does not cover the whole picture.

`square` removes the border radius. This theme’s radius is 8. Leave it on for panels.

## Card

Paper plus a standard internal layout.

```jsx
import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material'

<Card variant="outlined">
  <CardHeader title="Objective north" subheader="Company" />
  <CardContent>
    <Typography variant="body2" color="text.secondary">
      Owned by APEX
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small" onClick={share}>Share</Button>
    <Button size="small" onClick={promote}>Promote</Button>
  </CardActions>
</Card>
```

`CardHeader` `title` and `subheader` are `Typography` already. Do not wrap them in another `Typography`. `avatar` takes an `Avatar`. `action` takes an `IconButton`.

`CardActionArea` makes the whole card one button. Do not put other buttons inside it. Nested buttons are invalid. If the card has actions, the header and content are not an action area. The buttons in `CardActions` are the actions.

`CardMedia` is for an image:

```jsx
<CardMedia component="img" height="140" image={url} alt="Northern approach" />
```

Always set `alt`. A decorative image uses `alt=""`.

## Accordion

A stack of sections where one opens. Useful for a long properties panel. A poor fit for the map, because the open section changes height under a floating card.

```jsx
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

<Accordion expanded={open === 'style'} onChange={() => setOpen(open === 'style' ? '' : 'style')}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="body2">Style</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <TextField label="Stroke" fullWidth size="small" />
  </AccordionDetails>
</Accordion>
```

Controlled mode is `expanded` plus `onChange`. Uncontrolled is `defaultExpanded` on the one that starts open. The change callback receives the event and a boolean, which is awkward when several accordions share one open id. Toggling the id yourself, as above, keeps a single open section.

`disableGutters` removes the extra margin between accordions so they read as one list.

Do not put a `DataGrid` or a map inside an accordion. The height is animated and the grid measures zero while it is closed.
