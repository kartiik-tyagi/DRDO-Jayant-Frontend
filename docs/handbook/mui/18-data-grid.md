# Data Grid

`@mui/x-data-grid` 9.16.0 is installed. No file under `src/` imports it. The feature table is a list. Use the grid when a panel is a real table: many rows, sort, filter, and column layout.

This is the community grid. Row pinning, row grouping, and Excel export are Pro and Premium packages. They are not installed. Do not import `@mui/x-data-grid-pro`.

```jsx
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
  { field: 'featureType', headerName: 'Type', width: 120 },
  { field: 'teamId', headerName: 'Team', width: 120 },
]

<Box sx={{ height: 360, width: '100%' }}>
  <DataGrid
    rows={features}
    columns={columns}
    getRowId={(row) => row.id}
    pageSizeOptions={[10, 25, 50]}
    initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
    disableRowSelectionOnClick
    onRowClick={(params) => select(params.row.id)}
  />
</Box>
```

The parent **must** have a height. A grid in a flex child with no height renders as a blank strip. `height: 360` or `flex: 1` plus `minHeight: 0` on a parent that itself has a height.

## Columns

| Field | Meaning |
| --- | --- |
| `field` | Key on the row. Required. |
| `headerName` | The heading. Defaults to `field`. |
| `width` | Pixels. |
| `flex` | Share leftover width. Set `minWidth` too. |
| `type` | `'string'`, `'number'`, `'boolean'`, `'date'`, `'dateTime'`, `'singleSelect'` |
| `align`, `headerAlign` | `'left'`, `'center'`, `'right'` |
| `sortable`, `filterable` | Default true. Set false to lock a column. |
| `editable` | The cell opens an editor. Commit the result yourself. |

`valueGetter` in this version receives the raw value, the row, the column, and the API ref. It does not receive a single `params` object. Old examples that say `valueGetter: (params) => params.row.name` are wrong here.

```jsx
{
  field: 'label',
  headerName: 'Label',
  flex: 1,
  valueGetter: (_value, row) => `${row.name} · ${row.featureType}`,
}
```

`valueFormatter` shapes the display and also takes `(value, row)`. `renderCell` returns JSX when the cell is not plain text:

```jsx
{
  field: 'name',
  headerName: 'Name',
  flex: 1,
  renderCell: (params) => <span>{params.row.name}</span>,
}
```

`renderCell` params still include `row` and `value`. A cell with elements needs `display: 'flex'` on that column if the content is clipped.

## Rows

Each row needs an id. `getRowId={(row) => row.id}` uses the feature id. Without it the grid looks for `row.id` anyway. Duplicate ids warn and selection breaks.

Do not mutate `rows`. Pass a new array when the data changes. The directory snapshot is already a new object when `apply` accepts it.

## Selection

```jsx
const [ids, setIds] = useState({ type: 'include', ids: new Set() })

<DataGrid
  checkboxSelection
  rowSelectionModel={ids}
  onRowSelectionModelChange={(next) => setIds(next)}
/>
```

In version 9 the selection model is `{ type: 'include' | 'exclude', ids: Set }`. An array of ids is the older shape. Use the object. Read the chosen rows with `[...ids.ids]` when `type` is `'include'`.

`disableRowSelectionOnClick` leaves selection to the checkbox, so a row click can select the map feature without also toggling the check.

## Pagination and filter

`pagination` is on by default in the community grid. `pageSizeOptions` sets the menu. `initialState` is only the first mount. To control the page, use `paginationModel` and `onPaginationModelChange`.

The toolbar filter is built in. `filterMode="server"` means you filter the array yourself and the grid will not hide rows. Leave the default for a list you already hold in memory.

## Loading and empty

```jsx
<DataGrid rows={features} columns={columns} loading={!ready} />
```

`loading` shows a bar. An empty `rows` array shows the built-in “No rows” overlay. `slotProps` and `slots` can replace that overlay. You do not have to.

## Height inside this shell

```jsx
<Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
  <DataGrid rows={rows} columns={columns} />
</Box>
```

The box’s parent must be a flex column with a real height. The same chain as the map. A grid with `autoHeight` sizes to all rows and disables internal scroll. Do not use `autoHeight` for hundreds of features. The panel would grow past the viewport and the shell clips it.
