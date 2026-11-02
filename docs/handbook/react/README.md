# React handbook

This half of the book teaches React 19 as this repository uses it. You can work through it with no network. The examples are the patterns in `src/`, not a second application.

Read [JavaScript](01-javascript-for-this-project.md) first if `const`, arrow functions, or `import` are new. Otherwise start at [components](02-components-jsx-props.md).

| Chapter | When to open it |
| --- | --- |
| [01 JavaScript](01-javascript-for-this-project.md) | A line in `src/` does not parse in your head |
| [02 Components, JSX, props](02-components-jsx-props.md) | You are adding or splitting a component |
| [03 State, events, effects](03-state-events-effects.md) | The screen does not update, or it updates forever |
| [04 Lists, forms, routing](04-lists-forms-routing.md) | You are building a panel, a dialog, or a page |
| [05 Data, Zustand, Query, MUI](05-data-zustand-query-mui.md) | You are storing data or laying out with MUI |
| [06 Vite, debugging, recipes](06-vite-debugging-recipes.md) | The dev server, a blank page, or a step-by-step change |
| [07 Cheat sheet](07-cheat-sheet.md) | You know the idea and want the syntax |
| [08 How React works](08-how-react-works.md) | What a render is, and why the screen did or did not change |
| [09 Hooks](09-hooks.md) | Every hook, with the rules and a working example |

Versions on this machine: React 19.3, React Router 7, MUI 9, Zustand 5, TanStack Query 5, Vite 8, OpenLayers 10. Class components are not used. The one exception you may still meet in other codebases is an error boundary, which React still implements as a class. This app does not have one. A render exception blanks `#root`.

Project-specific behaviour (login, flags, the map) stays in the parent handbook. Start at [../README.md](../README.md).
