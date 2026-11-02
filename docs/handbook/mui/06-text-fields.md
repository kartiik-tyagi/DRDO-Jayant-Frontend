# Text fields

```jsx
import { TextField } from '@mui/material'

const [name, setName] = useState('')

<TextField
  label="Name"
  value={name}
  onChange={(event) => setName(event.target.value)}
  required
  fullWidth
  autoFocus
  helperText="Shown on the picture"
/>
```

`value` plus `onChange` is a controlled field. The React state is the text. `defaultValue` without `value` lets the DOM hold the text. Do not switch one field between them while it is mounted.

## Props you will use

| Prop | Meaning |
| --- | --- |
| `label` | The floating label. Always set it. A `placeholder` disappears when the person types and is not a name. |
| `variant` | `outlined` (default), `filled`, `standard` |
| `size` | `small` in dense panels, `medium` default |
| `type` | `text`, `password`, `number`, `email`, `search` |
| `error` | Red border when true |
| `helperText` | The line under the field. Use it for the error sentence. |
| `disabled` | Cannot edit |
| `required` | Asterisk. You still validate yourself. |
| `multiline` | A textarea. `minRows={3}` `maxRows={8}` |
| `autoComplete` | `'off'` or `'current-password'` so the browser offers the right fill |
| `name` | Submitted with a real form. `useActionState` reads it from `FormData`. |

```jsx
<TextField
  label="Name"
  value={name}
  error={!name.trim()}
  helperText={!name.trim() ? 'Enter a name.' : ' '}
  onChange={(event) => setName(event.target.value)}
/>
```

A helper text of `' '` keeps the line’s height so the form does not jump when the error appears.

## The native input

Attributes that belong on `<input>` go through `slotProps.htmlInput`. The old `inputProps` prop is not part of `TextField` in this version.

```jsx
<TextField
  label="Zoom"
  type="number"
  value={zoom}
  onChange={(event) => setZoom(event.target.value)}
  slotProps={{ htmlInput: { min: 1, max: 18, step: 1 } }}
/>
```

`event.target.value` is still a string when `type="number"`. Check `Number.isFinite(Number(value))` before you store a number.

Adornments and other props for the MUI input wrapper go on `slotProps.input`:

```jsx
import InputAdornment from '@mui/material/InputAdornment'

<TextField
  label="Search"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" />
        </InputAdornment>
      ),
    },
  }}
/>
```

## Password

`src/shared/ui/PasswordField.jsx` is the field this app uses. A password `TextField` is:

```jsx
const [show, setShow] = useState(false)

<TextField
  label="Password"
  type={show ? 'text' : 'password'}
  value={password}
  autoComplete="current-password"
  onChange={(event) => setPassword(event.target.value)}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((value) => !value)}
            edge="end"
          >
            {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      ),
    },
  }}
/>
```

Do not log the value. Do not put it in a toast.

## Multiline

```jsx
<TextField
  label="Comment"
  value={comment}
  multiline
  minRows={3}
  fullWidth
  onChange={(event) => setComment(event.target.value)}
/>
```

## Select inside a text field

`select` on `TextField` is the dropdown. The options are `MenuItem` children. That pattern is the next chapter.
