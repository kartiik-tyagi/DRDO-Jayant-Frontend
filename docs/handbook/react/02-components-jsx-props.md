# 2. Components, JSX, and props

## What a component is

A component is a function that returns React elements. React calls it when the parent renders, and again when state or props that it reads have changed.

```jsx
export function LoadingState({ label = 'Loading' }) {
  return <p>{label}</p>
}
```

The file uses JSX, so the name ends in `.jsx`. JSX is the HTML-like syntax. Vite’s React plugin turns it into `React.createElement` calls. You do not import `React` for that transform in this project (the automatic runtime). You do import hooks from `'react'`.

Names of components start with a capital letter. `<loadingState />` is treated as an unknown HTML tag. `<LoadingState />` is your function.

A component returns one parent, or an array, or `null`. `null` renders nothing. `MapWorkbench` returns `null` because its job is an effect that talks to OpenLayers, not a DOM node of its own.

To return two nodes without a wrapper, use a fragment:

```jsx
<>
  <StatusBadge />
  <GameStateChip />
</>
```

## JSX rules that differ from HTML

| JSX | HTML habit |
| --- | --- |
| `className` | `class` |
| `htmlFor` | `for` |
| `style={{ color: 'red' }}` | `style="color: red"` — here we use MUI `sx` instead |
| `{expression}` | text is literal, braces run JavaScript |
| `onClick={fn}` | `onclick="..."` — pass a function, do not call it |
| `<Input />` | void tags must close |

```jsx
<button onClick={() => setOpen(true)}>Open</button>
<button onClick={setOpen(true)}>Open</button>   // wrong: calls setOpen during render
```

Comments inside JSX are `{/* comment */}`.

`{' '}` is a space when the formatter eats the one you typed. You rarely need it.

Boolean attribute: `<Dialog open={passwordOpen} />`. `open={true}` and `open` are the same. `open={false}` hides it.

## Props

Props are the argument object. The parent owns the values.

```jsx
<PictureWorkspace variant="dock" />
<ToolPanel panel={chrome.panel} onClose={chrome.closePanel} />
```

`"dock"` is a string. `{chrome.panel}` is an expression. `onClose={chrome.closePanel}` passes the function. `onClose={chrome.closePanel()}` would call it while rendering.

Children are `props.children`:

```jsx
export function DirectoryGate({ children }) {
  return children
}
```

```jsx
<DirectoryGate>
  <Shell />
</DirectoryGate>
```

Do not change props. If the child needs a new value, call the function the parent passed (`onClose`, `onChange`) and let the parent set state.

## Conditional render

```jsx
{isPhone ? <IconButton aria-label="Open menu" /> : null}
{measure ? <Typography variant="caption">{measure}</Typography> : null}
{session ? <Picture /> : <Navigate to="/login" replace />}
```

The third form is how `Shell` chooses login versus the picture.

## Composition, the way this app grows

Small components, one job:

- `LoadingState`, `EmptyState`, `ErrorState` say one thing.
- `ConfirmDialog` is the yes/no. It does not know about features.
- `ToolPanel` is the frame. `PanelBody` is the contents.
- `PictureWorkspace` chooses dock, overlay, plain, or phase. It does not implement draw.

When a file is doing two jobs, split it. When a third layout needs the same button, move the button into `src/shared/ui/` and pass the difference in as a prop. Do not copy the button into each `Shell.jsx`.

## Where files live

| Kind | Folder |
| --- | --- |
| One screen’s flow | `src/features/<name>/` |
| Used by every layout | `src/shared/ui/` |
| Map engine | `src/components/` |
| The frame that differs per branch | `src/shell/Shell.jsx` |
| Data | `src/shared/api/client.js` only, from UI code |

A component file exports the component and little else. Helpers used by one component can sit in the same file. Helpers used by two features go to `src/shared/lib/`.

## Keys, briefly

When you render an array, each child needs a stable `key`. The full rules are in chapter 4. The short form:

```jsx
{features.map((feature) => (
  <ListItemButton key={feature.id}>{feature.name}</ListItemButton>
))}
```

`key` is not a prop your component receives. React uses it to match rows. Do not use the array index if the row can be inserted or deleted.

## Accessibility that this UI already cares about

- Icon-only buttons need `aria-label`. The rail does this with the tool’s label.
- A control that toggles uses `aria-pressed` when it is a button pretending to be a switch.
- Do not put the only label in a `placeholder`. Use MUI’s `label` on `TextField`.
- Dialogs need a title. MUI `DialogTitle` does that.

## What not to put in the component body

The body runs on every render.

- Do not `fetch` in the body. Use an effect or TanStack Query.
- Do not `sessionStorage.setItem` in the body. That writes on every render.
- Do not create a Zustand store in the body. The store is created once at module scope (`create(...)`).
- Do not `new Map()` inside `SituationMap`’s component body if an effect depends on it. Create the map inside the effect.

Computing a filtered list in the body is fine. It is cheap and it stays in sync.
