# Material UI cheat sheet

Version 9.5. `@mui/x-data-grid` 9.16 is installed and unused by `src/`. `@mui/lab`, date pickers, and charts are not installed.

## Imports

```jsx
import { Box, Button, TextField } from '@mui/material'
import { useTheme, alpha, styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'
```

## Layout

```jsx
<Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: 1, p: 2 }} />

<Stack direction="row" spacing={1} />

<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }} />
</Grid>
```

There is no `<Grid item xs={6}>` in this version.

Spacing numbers are × 8px. `p: 2` is 16px. Breakpoints: `xs` 0, `sm` 600, `md` 900, `lg` 1200, `xl` 1536.

## Text

```jsx
<Typography variant="body2" color="text.secondary" sx={{ display: 'block' }} noWrap>
  Blue lead
</Typography>
```

No `display` prop on `Typography`.

## Buttons and icons

```jsx
<Button variant="contained" startIcon={<AddIcon />} onClick={save}>Save</Button>
<IconButton aria-label="Close" onClick={close}><CloseIcon /></IconButton>
<Button component={RouterLink} to="/">Picture</Button>
```

## Fields

```jsx
<TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />

<TextField
  label="Zoom"
  type="number"
  slotProps={{ htmlInput: { min: 1, max: 18 } }}
/>

<TextField select label="Team" value={teamId} onChange={(e) => setTeamId(e.target.value)}>
  <MenuItem value="blue">Blue force</MenuItem>
</TextField>
```

`slotProps.htmlInput`, not `inputProps`. `slotProps.input` for adornments.

## Autocomplete

```jsx
<Autocomplete
  options={users}
  value={user}
  onChange={(_, next) => setUser(next)}
  getOptionLabel={(option) => option.title}
  isOptionEqualToValue={(a, b) => a.id === b.id}
  renderInput={(params) => <TextField {...params} label="User" />}
/>
```

## Menu

```jsx
<Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
  <MenuItem onClick={() => setAnchor(null)}>Sign out</MenuItem>
</Menu>
```

Store `event.currentTarget` as the anchor.

## Choices

```jsx
<FormControlLabel control={<Checkbox checked={on} onChange={(e) => setOn(e.target.checked)} />} label="Coast" />

<RadioGroup value={mode} onChange={(e) => setMode(e.target.value)}>
  <FormControlLabel value="TIME" control={<Radio />} label="Time" />
</RadioGroup>

<FormControlLabel control={<Switch checked={on} onChange={(e) => setOn(e.target.checked)} />} label="Table" />
```

## Slider

```jsx
<Slider min={0} max={1} step={0.05} value={opacity} onChange={(_, v) => setOpacity(v)} onChangeCommitted={(_, v) => save(v)} />
```

Send APIs from `onChangeCommitted`.

## Navigation chrome

```jsx
<AppBar position="static" color="default" elevation={0}><Toolbar variant="dense" /></AppBar>

<Drawer variant="permanent" sx={{ width: 240, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }} />
<Drawer variant="temporary" open={open} onClose={() => setOpen(false)} />

<Box component="footer" sx={{ flexShrink: 0 }} />
```

## List and tabs

```jsx
<ListItemButton selected={id === current}>
  <ListItemText primary={label} slotProps={{ primary: { variant: 'body2', color: 'text.primary' } }} />
</ListItemButton>

<Tabs value={tab} onChange={(_, next) => setTab(next)}>
  <Tab label="Map" value="map" />
</Tabs>
```

`slotProps.primary`, not `primaryTypographyProps`.

## Table and grid

```jsx
<TableContainer component={Paper} sx={{ maxHeight: 360 }}>
  <Table size="small" stickyHeader />
</TableContainer>

<TablePagination component="div" count={n} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={10} onRowsPerPageChange={() => {}} />

<Box sx={{ height: 360 }}>
  <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} />
</Box>
```

Data Grid `valueGetter: (_value, row) => row.name`. Selection model: `{ type: 'include', ids: new Set() }`.

## Feedback

```jsx
<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
  <DialogTitle>Name</DialogTitle>
  <DialogContent />
  <DialogActions />
</Dialog>

<Alert severity="error">{message}</Alert>

<Snackbar open={open} autoHideDuration={4200} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
  <Alert severity="error" variant="filled">{message}</Alert>
</Snackbar>

<CircularProgress size={18} color="inherit" />
```

## Theme z-index

| Key | Value |
| --- | --- |
| `mobileStepper` | 1000 |
| `fab` | 1050 |
| `appBar` | 1100 |
| `drawer` | 1200 |
| `modal` | 1300 |
| `snackbar` | 1400 |
| `tooltip` | 1500 |

## This app

| Need | Use |
| --- | --- |
| Theme | `createAppTheme` and `ThemeBridge` |
| Toast | `useToastStore`, not a new snackbar |
| Confirm | `ConfirmDialog` |
| Menu data | `useNavigation()` |
| A mutation | `useCommit` |
| Map height | `flex: 1`, `minHeight: 0`, parent height `100%` |
