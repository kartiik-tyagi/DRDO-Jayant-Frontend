# 3. State, events, and effects

## State

`useState` keeps a value across renders. Calling the setter schedules a new render.

```jsx
const [name, setName] = useState('')
const [passwordOpen, setPasswordOpen] = useState(false)
```

The first value is the initial state. React ignores it after the first render. If you need to reset when a dialog opens, do it in an effect or when you open:

```jsx
useEffect(() => {
  if (pending) {
    setName('')
    setTeamId('')
  }
}, [pending])
```

Set state with the next value, or with a function of the previous one when the next value depends on the previous:

```jsx
setExpanded((open) => !open)
```

Do not:

```jsx
expanded = true          // does not re-render
setExpanded(expanded)    // if expanded is already that value, React bails out
```

Objects: replace them. Do not mutate then set the same reference.

```jsx
setDraft({ ...form, source: event.target.value })
```

Several `useState` calls are normal. If five of them always change together and are passed deep, a store is clearer. This app uses Zustand for session and directory, and `useState` for one dialog’s fields.

## Events

```jsx
<Button onClick={() => setTool(id)}>Unit</Button>
<TextField value={name} onChange={(event) => setName(event.target.value)} />
```

`event` is a React synthetic event. `event.target.value` is the field. `event.currentTarget` is the element that has the listener. Layout-3 stores `currentTarget` as the popover anchor. `target` might be the icon inside the button, which is a bad anchor.

Sliders in this app use `onChangeCommitted`, not `onChange`, when the value is sent to the API. `onChange` fires for every pixel. That would log and snapshot on every pixel.

```jsx
<Slider
  value={opacity[filter.id] ?? 1}
  onChangeCommitted={(_, value) => commit((userId) => api.setLayerOpacity(userId, filter.id, value))}
/>
```

The first argument is the event. The second is the number. MUI does that. An HTML `<input type="range">` would use `event.target.value`, which is a string.

Prevent a form from reloading the page:

```jsx
<form onSubmit={(event) => { event.preventDefault(); attempt.mutate({ userId, password }) }}>
```

The login page uses a button click rather than a form submit. Both are valid if the page does not reload.

## Effects

`useEffect(fn, deps)` runs `fn` after paint. If you return a function, React runs it before the next effect and on unmount. That function is the cleanup.

```jsx
useEffect(() => {
  if (!ready || !userId) {
    reset()
    return undefined
  }
  load(userId).catch((error) => { /* toast */ })
  return () => reset()
}, [ready, userId, load, reset])
```

Dependency array:

| Deps | Runs |
| --- | --- |
| omitted | After every render. Almost always a bug. |
| `[]` | After the first paint, and cleanup on unmount. |
| `[userId]` | After the first paint, and again when `userId` changes. |

Every value from the component that the effect uses should be in the array, or the effect closes over a stale one. Functions from Zustand (`load`, `reset`) are stable. `commit` from `useCommit()` is a new function every render. Do not put a fresh function in the array unless you want the effect to re-subscribe every render. The map’s `moveend` effect depends on `userId` and `surface`, and calls the `commit` from that render. That is acceptable because those deps change rarely.

`StrictMode` in development runs the effect, the cleanup, then the effect again. Subscriptions must be cancelled in the cleanup. `subscribeWorkbench` returns that cancel function, and `reset` calls it.

## When not to use an effect

| Need | Do this instead |
| --- | --- |
| Derive a label from state | Compute it while rendering |
| Send a click to the API | The click handler |
| Reset child state when a key changes | `key={id}` on the child remounts it |
| Copy props into state | Read the prop. Copying goes stale. |

An effect that sets state which is in its own dependency array loops. Layout-4’s phase effect calls `setSurface` and depends on `phaseId`, not on `surface`, so it runs when the phase changes and then stops.

## Refs

`useRef(null)` is a box. `.current` survives renders. Changing `.current` does not re-render.

Use a ref for:

- The DOM node: `<Box ref={targetRef} />`. MUI forwards `ref` to the DOM.
- An OpenLayers map you must not recreate.
- A flag such as “I already applied the saved view” (`saved.current = true`).
- The latest callback, when an effect should not restart (`onPointerRef.current = onPointer` in `SituationMap`).

Do not read `ref.current` of a DOM node during render and expect it to exist. It is set after paint. Read it inside an effect or a handler.

React 19 lets a function component take `ref` as a normal prop. You do not need `forwardRef` for new components. MUI components already accept `ref`.

## Context, in one page

This app does not write its own React context for session data. Zustand replaces that. MUI’s `ThemeProvider` is a context. `useTheme()` reads it.

If you did need context:

```jsx
const ChromeContext = createContext(null)
export function useChromeContext() {
  const value = useContext(ChromeContext)
  if (!value) throw new Error('useChromeContext must be inside the provider')
  return value
}
```

Put the provider near the top. A context value that is a new object every render (`value={{ panel }}`) re-renders every consumer. Memoize it or use Zustand.

## Custom hooks

A function whose name starts with `use` may call other hooks. `useCommit` and `useNavigation` are custom hooks. Call them only at the top level of a component or another hook. Do not call them inside `if`, inside a loop, or inside a click handler. The order of hook calls must be the same every render.

```jsx
if (panel) {
  const commit = useCommit()   // illegal: sometimes skipped
}
```

Put the hook first, then branch.

## Lifting state

The draft dialog is mounted in `App`, not inside the map, because the map effect must not own a dialog. The map calls `setPending` on the store. The dialog reads `pending`. That is “lift state up”, done with a store because the writer (`MapWorkbench`) and the reader (`DraftDialog`) are not parent and child.

If they were parent and child, the parent would hold `useState` and pass `pending` and `onClose` down.

## Batching

Several `setState` calls in one click become one render. Zustand `set` calls in one function also notify once per `set`. `setSurface` and `setTool` one after another are two updates. In the planning tool buttons the code calls both on purpose: `setSurface` resets the tool to select, then `setTool` sets the shape. Order matters.
