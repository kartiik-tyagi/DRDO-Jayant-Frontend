# Select

A dropdown that shows the current value and a list of options. This app uses it for the appointment, the scenario, and the game.

## The short form

```jsx
import { MenuItem, TextField } from '@mui/material'

<TextField
  select
  fullWidth
  label="Team"
  value={teamId}
  onChange={(event) => setTeamId(event.target.value)}
>
  {teams.map((team) => (
    <MenuItem key={team.id} value={team.id}>
      {team.name}
    </MenuItem>
  ))}
</TextField>
```

`value` must equal some `MenuItem`’s `value`, or be `''`. If `teamId` is `''` and no item has that value, MUI warns. Render the select after the id is known, or include `<MenuItem value="">None</MenuItem>`.

`MenuItem` `value` can be a string or a number. Do not use an object. Compare strings with strings.

## Disabled options

A closed game stays visible and cannot be chosen.

```jsx
<MenuItem key={game.id} value={game.id} disabled={!game.open}>
  {game.name}{game.open ? '' : ' · Closed'}
</MenuItem>
```

## The long form

Use this when you need a label id, a helper line, and the select as its own component.

```jsx
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'

<FormControl fullWidth error={!teamId} size="small">
  <InputLabel id="team-label">Team</InputLabel>
  <Select
    labelId="team-label"
    label="Team"
    value={teamId}
    onChange={(event) => setTeamId(event.target.value)}
  >
    {teams.map((team) => (
      <MenuItem key={team.id} value={team.id}>{team.name}</MenuItem>
    ))}
  </Select>
  <FormHelperText>{teamId ? ' ' : 'Choose a team.'}</FormHelperText>
</FormControl>
```

`label` on `Select` must match the `InputLabel` text. It cuts the outlined border so the label sits in the notch. `labelId` ties the accessible name to that label.

## Multiple

```jsx
<Select
  multiple
  label="Shared with"
  value={userIds}
  onChange={(event) => setUserIds(event.target.value)}
  renderValue={(selected) => selected.join(', ')}
>
  {users.map((user) => (
    <MenuItem key={user.id} value={user.id}>{user.title}</MenuItem>
  ))}
</Select>
```

`value` is an array. `event.target.value` is the next array. Start from `useState([])`, not `''`.

## Native

A native menu is the browser’s `<select>`. Children are `<option>`, not `MenuItem`.

```jsx
<TextField
  select
  label="Team"
  value={teamId}
  onChange={(event) => setTeamId(event.target.value)}
  slotProps={{ select: { native: true } }}
>
  {teams.map((team) => (
    <option key={team.id} value={team.id}>{team.name}</option>
  ))}
</TextField>
```

Use native when you want the platform menu. Use `MenuItem` when the row needs two lines, which is what `PositionSelect` does.

## Confirming a change

The scenario and game dropdowns do not write the new id on the first click. Keep `value` on the current id. Open a confirm dialog with the pending id. On confirm, call the API. On cancel, drop the pending id. If `value` follows the click immediately, the control shows the new choice even when the API rejects it.

## Width and empty lists

`fullWidth` on the `FormControl` or `TextField`. A select of an empty array renders an empty menu. Show a sentence instead of a select when `teams.length === 0`.

The accessible name of a MUI select is often the selected text (“Northern Approach”), not the word “Scenario” above it. Tests and screen readers both see that. The `InputLabel` is still required.
