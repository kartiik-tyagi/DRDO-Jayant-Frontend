# Autocomplete

A dropdown you can type into. Use it when the list is long enough that a `Select` is a chore. The appointment list is short, so this app uses `Select`. Reach for `Autocomplete` for a search of users, places, or features.

```jsx
import { Autocomplete, TextField } from '@mui/material'

<Autocomplete
  options={users}
  value={user}
  onChange={(_, next) => setUser(next)}
  getOptionLabel={(option) => option.title}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  renderInput={(params) => <TextField {...params} label="User" />}
/>
```

`options` is the full list. `value` is the selected option, or `null` when nothing is selected. `onChange` gives you the event and the next option. The next option is `null` when the person clears the field.

## Objects as options

`getOptionLabel` must return a string. `isOptionEqualToValue` tells MUI when two objects are the same row. Without it, MUI uses reference equality and a freshly loaded array looks like a new selection.

```jsx
getOptionLabel={(option) => option?.title || ''}
isOptionEqualToValue={(option, value) => option.id === value.id}
```

String options do not need either function:

```jsx
<Autocomplete
  options={['Blue force', 'Red force']}
  value={name}
  onChange={(_, next) => setName(next)}
  renderInput={(params) => <TextField {...params} label="Team" />}
/>
```

`value` is then a string or `null`.

## Multiple, free text, loading

```jsx
<Autocomplete
  multiple
  options={users}
  value={picked}
  onChange={(_, next) => setPicked(next)}
  getOptionLabel={(option) => option.title}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  renderInput={(params) => <TextField {...params} label="Share with" />}
/>
```

`value` starts as `[]`.

`freeSolo` lets the person commit text that is not in the list. The value may be a string. Only turn it on when a custom value is legal.

```jsx
<Autocomplete
  options={names}
  loading={isPending}
  renderInput={(params) => <TextField {...params} label="Feature" />}
/>
```

`loading` shows the progress in the popup. You still have to fetch. Autocomplete does not know about the API.

## Filtering

The default filter matches the label. Replace it when you want to search another field:

```jsx
filterOptions={(options, state) =>
  options.filter((option) =>
    `${option.title} ${option.role}`.toLowerCase().includes(state.inputValue.toLowerCase()),
  )
}
```

## Width

The input stretches if the `TextField` is `fullWidth` and the parent has a width. `renderInput` can pass it through:

```jsx
renderInput={(params) => <TextField {...params} label="User" fullWidth />}
```

Spread `params` first, then your props, so your `label` wins and `params` still attaches the keyboard handlers.

## What it will not do

It will not paginate a server list by itself. For a server search, set `filterOptions={(options) => options}` so the client does not filter again, update `options` from the request, and ignore a response that belongs to an older query. See the cancelled-flag pattern in [hooks](../react/09-hooks.md).
