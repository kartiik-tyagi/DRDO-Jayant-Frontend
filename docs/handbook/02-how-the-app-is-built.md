# 2. How the app is built

## The sentence that rules the code

Screens and stores call `src/shared/api/client.js`. They do not import `fixtures.js` or `directory.js`. Those two files are the dummy server. When a real server exists, you change the API folder. You do not rewrite a panel to “know” HTTP.

```text
Browser
  index.html
    mounts src/main.jsx
      App
        QueryClientProvider     login context is cached in memory
        BrowserRouter           /login and /
        ThemeBridge             colours from the session, else the login context
        SessionGate             waits until restore finishes
        DirectoryGate           loads the workbench and plays the alert tone
          Shell                 the only file that differs by layout
          ToastHost             errors from useCommit
          EntityDialog          feature or graphic details
          DraftDialog           name and team after a draw
```

## Boot, in order

1. `index.html` has `<div id="root">` and `<script type="module" src="/src/main.jsx">`.
2. `main.jsx` loads Roboto weights and `index.css`, then `createRoot(...).render` in `StrictMode`.
3. `App.jsx` wraps providers. It has no business rules.
4. `ThemeBridge` calls `getLoginContext()` through TanStack Query so the login page is themed before anyone signs in.
5. `SessionGate` calls `restore()`. Until `ready` is true it shows “Restoring the session”. It does not mount the shell during that wait, so the directory does not load twice for a signed-in user.
6. `restore` reads `jayant.session`. No user id: show login, and a notice if the saved JSON was corrupt. A user id: `resumeSession`, then the shell.
7. `DirectoryGate` calls `load(userId)` which calls `loadWorkbench` and then `subscribeWorkbench`. Sign-out sets `userId` to null and the cleanup calls `reset()`.

`StrictMode` in development runs effects twice: setup, cleanup, setup. `DirectoryGate` is written for that. `restore` uses a module-level promise and `if (get().ready) return` so two calls do not sign the user in twice.

## Two stores, on purpose

| Store | File | Holds |
| --- | --- | --- |
| Session | `src/features/session/useSessionStore.js` | Who is signed in, theme, filters, resources, plans, scenario list, game list, clock, game status, which phase is selected |
| Directory | `src/features/directory/useDirectoryStore.js` | The workbench snapshot: features, graphics, flags, alerts, recordings, stream, basemap, plus the tool you are holding |

The session store is the appointment and the exercise clock. The directory store is the picture and the plan. Both are Zustand. Neither uses the persist middleware. Refresh behaviour is written by hand in `src/shared/lib/sessionKey.js` so a password or a whole profile is never written to disk.

## The workbench snapshot

`loadWorkbench` returns one object. Every later change returns the **whole** object again. The store replaces `data`. It does not patch one field itself.

`subscribeWorkbench` is a 500 ms timer **inside the API module**. It moves units when the stream is live, advances scenario playback, records frames, steps a replay, and recomputes geofence alerts. A future WebSocket replaces that function. React does not tick the exercise.

The store compares the new snapshot to the previous one with `JSON.stringify`. If nothing changed, it does not bump `revision`. That matters: the map rebuilds its draw tools when `revision` changes. A timer that always set state would make drawing impossible.

## What is client-only

These live in the directory store and are **not** sent as their own API calls. A refresh clears them:

- `surface`: `picture` or `planning`
- `tool`: `select`, `unit`, `route`, `rectangle`, …
- `curved`, `stampId`, `symbolId`
- `pending`: the geometry waiting for a name
- `measure`: the last distance or area string
- `selectedId`, `entityOpen`
- `graphicQuery`: layer and phase text filters

## How a button reaches the API

Panels use `useCommit()`:

```jsx
const commit = useCommit()
commit((userId) => api.deleteFeature(userId, feature.id))
```

`useCommit` reads the signed-in id and calls `run`. `run` awaits the API function, replaces the snapshot, and on failure pushes `error.message` into the toast store and rethrows. Callers that must close a dialog only after success use `.then(...)`. Failures use `.catch(() => {})` so the browser does not also report an unhandled rejection. The toast already told the person.

Do not catch an API error and ignore it with no toast, unless the store already toasted it. Do not toast and also leave the rejection unhandled.

## Navigation

`session.navigation` is the small menu from `fixtures.js` (filters, home, resources, plans, and exercise control for APEX). It shows only until the directory snapshot arrives.

`useNavigation()` prefers `data.navigation` from the snapshot. That menu is rebuilt from feature flags and the person’s grant. `IconRail` and `IconStrip` must use `useNavigation()`. If they read `session.navigation` directly, new tools never appear.

`useChrome().select(id)` toggles the open panel. The id `extent` does not open a panel. It increments `resetToken`, and the map animates home.

## Layouts only choose a variant

`PictureWorkspace` accepts `dock`, `overlay`, `plain`, or `phase`. The shell picks one. Tool bodies are `PanelBody` in `src/shared/ui/workbench/Panels.jsx`. A new tool is added once, in the API navigation and in `PanelBody`, and all four layouts show it inside their own chrome.

## Stable empty values

A Zustand selector must return the same value when the store did not change. This is wrong:

```js
useDirectoryStore((state) => state.data?.alerts || [])
```

When `data` is null, `|| []` creates a new array every read. React thinks the store changed and renders forever. The page stays blank. Use `src/shared/lib/empty.js`:

```js
useDirectoryStore((state) => state.data?.alerts ?? EMPTY_LIST)
```

`??` only substitutes when the value is `null` or `undefined`. A real empty list from the API is kept.

## Logging

`src/shared/lib/logger.js` writes `[jayant] event` plus a record to the console. Log sign-in, session restore, directory failure, and rejected commands. Do not log the password. Do not log every slider tick. Opacity, fill, bearing, and map pan are continuous. They commit once (`onChangeCommitted` or a debounced `moveend`) and most of those commits are not log lines. A failed validation is a warn. See [Debugging](08-debugging.md) for the event names.
