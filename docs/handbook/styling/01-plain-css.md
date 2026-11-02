# 1. Plain CSS

The browser applies CSS in layers. A later rule wins when the specificity is equal. A more specific selector wins over a later weak one. Inline `style` beats a class. `!important` beats an ordinary declaration and is the wrong tool in this app.

## The file this app owns

`src/index.css` is imported once from `src/main.jsx`.

```css
html,
body,
#root {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
```

That is why the shell can be `height: 100%` and the map can fill it. A new global rule belongs in this file only when it is not a MUI component. Map chrome that OpenLayers renders (`.ol-zoom`, `.ol-scale-line`) is styled here because those nodes are not React components.

`CssBaseline` from MUI also sets body margin, the background, and the font. It is mounted in `ThemeBridge`. Your `index.css` and `CssBaseline` both touch `body`. Keep `index.css` to the height chain and the OpenLayers widgets.

## A class

```css
.situation-map {
  background: #102018;
  font-family: "Roboto", "Segoe UI", sans-serif;
}
```

```jsx
<Box ref={targetRef} className="situation-map" />
```

In JSX the attribute is `className`, not `class`. Two classes: `className="situation-map extra"`. A conditional class:

```jsx
className={open ? 'panel open' : 'panel'}
```

Prefer `sx` for anything MUI already styles. A global class fights MUI’s generated class unless you know the specificity. OpenLayers is the exception.

## Box model

Every element is content, then padding, then border, then margin. MUI’s baseline sets `box-sizing: border-box`, so `width` includes padding and border. `margin` is outside the width and can collapse between block siblings. `gap` on a flex or grid parent does not collapse.

`margin: 0` on `body` is required. The browser default is 8px, which makes `height: 100%` overflow by that margin.

## Display

| Value | Result |
| --- | --- |
| `block` | New line, stretches across the parent |
| `inline` | Sits in a line of text, ignores width and height |
| `inline-block` | Sits in a line, honours width and height |
| `flex` | Children become flex items |
| `grid` | Children become grid items |
| `none` | The element is not rendered and takes no space |

`hidden` is an HTML attribute, not a CSS value. The CSS is `visibility: hidden` (keeps the space) or `display: none` (removes it).

## Specificity, in practice

| Selector | Rough weight |
| --- | --- |
| an element, `div` | lowest |
| a class, `.situation-map` | higher |
| an id, `#root` | higher still |
| inline style | higher than id |

MUI’s `sx` compiles to a class injected by Emotion. It is specific enough to override a single class in `index.css` and weak enough that `!important` inside a component style override can still trap you. Do not add `!important` to win. Narrow the selector or set the style on `sx`.

## Units

| Unit | Meaning |
| --- | --- |
| `px` | A CSS pixel. The map widths in the shells are pixels. |
| `rem` | Relative to the root font size, usually 16px. `1rem` is 16px. |
| `%` | Relative to the parent, for width and height. Height percent only works if the parent has a height. |
| `vh` / `vw` | Percent of the viewport. This app uses the `%` chain instead, because `100vh` on a phone includes the browser chrome and overflows. |
| `em` | Relative to the element’s own font size. OpenLayers uses `em` for its controls. |

## Colour

A hex such as `#3caf72` is solid. `rgba(6, 10, 8, 0.45)` is the same colour language with an alpha. The login background uses that to dim the photograph. Theme colours should come from the palette (`color: 'text.primary'` in `sx`) so night and field stay readable. A one-off hex in a component drifts away from the theme the moment the appointment changes.
