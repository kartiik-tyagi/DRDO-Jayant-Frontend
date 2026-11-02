# Material UI

Material UI **9.5.0** as it is installed in this folder, with `@mui/icons-material` 9.5.0 and `@mui/x-data-grid` 9.16.0. Emotion is the style engine. Pigment CSS, MUI X Date Pickers, MUI X Charts, and `@mui/lab` are not installed. A chapter that needs one of those says so, and does not pretend the import exists.

This app already wraps the tree in `ThemeProvider` and `CssBaseline` (`src/app/ThemeBridge.jsx`). You do not add a second provider.

The screen you are styling is usually a flex column of height `100%`. Read [responsive layout](../styling/04-responsive-layout.md) before you add a bar or a drawer, or the map collapses.

| Chapter | Component |
| --- | --- |
| [Setup](01-setup.md) | Import, provider, what is installed |
| [Box, Stack, Grid, Container](02-layout.md) | Page structure |
| [Typography](03-typography.md) | Text |
| [Icons](04-icons.md) | `@mui/icons-material` |
| [Buttons](05-buttons.md) | Button, IconButton, Fab, ToggleButton |
| [Text fields](06-text-fields.md) | TextField, password, multiline |
| [Select](07-select.md) | Dropdowns |
| [Autocomplete](08-autocomplete.md) | Searchable dropdown |
| [Menu and Popover](09-menus.md) | Menus anchored to a button |
| [Checkbox, radio, switch](10-checkbox-radio-switch.md) | Choices |
| [Slider](11-slider.md) | Opacity, scrub, range |
| [Navbar](12-navbar.md) | AppBar and the top bar |
| [Sidebar](13-sidebar.md) | Drawer and a rail |
| [Footer](14-footer.md) | Bottom bar |
| [Lists](15-lists.md) | List, ListItemButton |
| [Tabs, breadcrumbs, stepper](16-tabs-and-steps.md) | In-page navigation |
| [Table](17-table.md) | Table and pagination |
| [Data Grid](18-data-grid.md) | `@mui/x-data-grid` |
| [Dialog](19-dialog.md) | Modal forms and confirm |
| [Snackbar and Alert](20-snackbar-alert.md) | Toasts and banners |
| [Paper, Card, Accordion](21-cards.md) | Surfaces |
| [Chip, Avatar, Badge, Tooltip](22-chips-avatars-badges.md) | Small status UI |
| [Progress and Skeleton](23-progress.md) | Loading |
| [Theme](24-theme.md) | Palette, type, overrides |
| [A whole page](25-page.md) | Navbar, sidebar, content, footer together |
| [Cheat sheet](26-cheat-sheet.md) | The props you look up twice |

`sx` itself is [Styling — the sx prop](../styling/02-sx-prop.md).
