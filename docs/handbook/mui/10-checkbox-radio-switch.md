# Checkbox, radio, and switch

The native input is stretched over the control with `opacity: 0`. The person sees the MUI graphic and clicks it. The accessible control is that input. Do not hide the root. Label the control with `FormControlLabel` so the hit target includes the words.

## Checkbox

```jsx
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'

<FormGroup>
  <FormControlLabel
    control={<Checkbox checked={coast} onChange={(event) => setCoast(event.target.checked)} />}
    label="Coast"
  />
  <FormControlLabel
    control={<Checkbox checked={places} onChange={(event) => setPlaces(event.target.checked)} />}
    label="Places"
  />
</FormGroup>
```

`checked` is boolean. `event.target.checked` is the next boolean. `indeterminate` is the mixed state when some children are on. Set it on the parent checkbox. It does not change `checked` by itself.

```jsx
<Checkbox checked={all} indeterminate={some && !all} onChange={toggleAll} />
```

This app’s filter rows are `ListItemButton`s, not checkboxes, because the row also carries an opacity slider. A plain on/off list can be checkboxes.

## Radio

One value among several.

```jsx
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'

<FormControl>
  <FormLabel id="mode-label">Mode</FormLabel>
  <RadioGroup
    aria-labelledby="mode-label"
    value={mode}
    onChange={(event) => setMode(event.target.value)}
  >
    <FormControlLabel value="TIME" control={<Radio />} label="Time" />
    <FormControlLabel value="EVENT" control={<Radio />} label="Event" />
  </RadioGroup>
</FormControl>
```

`RadioGroup` `value` is a string. Each `FormControlLabel` `value` is one choice. `row` lays them out horizontally.

`event.target.value` is always a string. If your state is a number, convert it.

## Switch

```jsx
import { FormControlLabel, Switch } from '@mui/material'

<FormControlLabel
  control={<Switch checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />}
  label="Feature table"
/>
```

`size="small"` in a dense list. `color="primary"` uses the theme primary, which already has a contrast colour.

The feature flags in this app are list buttons labelled On and Off, not switches. That was a product choice so the state is readable as text. A settings page you add can use `Switch`. Wire it through `useCommit` the same way:

```jsx
onChange={(event) => {
  const next = event.target.checked
  commit((userId) => api.setFlag(userId, 'featureTable', next)).catch(() => {})
}}
```

If the API rejects the change, the snapshot does not include it and the switch returns to the previous `checked` value on the next render. Keep `checked` tied to the snapshot, not to a local copy that can disagree.

## Group label

`FormLabel` names the group. `FormHelperText` under the group explains a rejection. `error` on `FormControl` turns the label and the helper red.

Disabled: `disabled` on `FormControlLabel` or on the group’s `FormControl`. A disabled switch still shows its state. It does not fire `onChange`.
