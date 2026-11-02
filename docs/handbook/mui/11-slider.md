# Slider

```jsx
import { Slider, Typography } from '@mui/material'

<Typography variant="caption" component="div" id="opacity-label">
  Opacity
</Typography>
<Slider
  aria-labelledby="opacity-label"
  min={0.15}
  max={1}
  step={0.05}
  value={opacity}
  valueLabelDisplay="auto"
  onChange={(_, value) => setOpacity(value)}
  onChangeCommitted={(_, value) => commit((userId) => api.setLayerOpacity(userId, layerId, value))}
/>
```

`onChange` fires while the pointer moves. `onChangeCommitted` fires when the pointer is released. Send the API from `onChangeCommitted`. A commit on every pixel rebuilds state, logs noise, and can destroy the map’s draw interaction if each call bumps the directory revision.

The first argument is the event. The second is the number, or an array for a range. An HTML range input would give you a string on `event.target.value`. The MUI slider does not.

## Range

```jsx
const [span, setSpan] = useState([0, 60])

<Slider
  min={0}
  max={120}
  value={span}
  onChange={(_, value) => setSpan(value)}
  valueLabelDisplay="auto"
/>
```

`value` must be an array of two numbers. `valueLabelFormat={(n) => `${n}s`}` changes the bubble.

## Marks and ends

```jsx
<Slider
  min={0}
  max={100}
  step={null}
  marks={[{ value: 0, label: '0' }, { value: 50, label: '50' }, { value: 100, label: '100' }]}
  value={value}
  onChange={(_, next) => setValue(next)}
/>
```

`step={null}` snaps to the marks only.

`disabled` freezes the thumb. `color="secondary"` uses the theme secondary. `size="small"` shortens the track.

## Vertical

```jsx
<Slider orientation="vertical" min={0} max={1} value={opacity} sx={{ height: 120 }} />
```

The slider needs a height when it is vertical, or it collapses.

## In a list row

The opacity control in `FilterList` sits under the filter name, inside one `Box`, because two siblings returned from `map` without a wrapper are not a single row. Give the slider `sx={{ mx: 1 }}` if the thumb is clipped by the row padding. `min` on the picture is `0.15` so a layer cannot be made fully invisible by accident. The API itself accepts 0 through 1.
