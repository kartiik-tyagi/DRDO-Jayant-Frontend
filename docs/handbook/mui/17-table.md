# Table

A semantic table: header, body, rows, cells. Use it when the person compares a few columns and you do not need sorting widgets, column resize, or virtualization. The picture’s feature list is a `List`, because each row is a name plus a type and a click selects it on the map. A directory of users with several columns is a table.

```jsx
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

<TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 360 }}>
  <Table size="small" stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Type</TableCell>
        <TableCell align="right">Team</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {features.map((feature) => (
        <TableRow
          key={feature.id}
          hover
          selected={feature.id === selectedId}
          onClick={() => select(feature.id)}
          sx={{ cursor: 'pointer' }}
        >
          <TableCell>{feature.name}</TableCell>
          <TableCell>{feature.featureType}</TableCell>
          <TableCell align="right">{feature.teamId}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

`size="small"` matches the panels. `stickyHeader` keeps the head while the container scrolls. The container needs `maxHeight`, or nothing scrolls and sticky never engages. `hover` and `selected` are row states. `align="right"` for numbers and short tokens. Leave names left aligned.

`TableContainer` is the scroll parent. A table without it can force the whole app wider than the viewport. The shell is `overflow: hidden`, so a wide table would clip. The container scrolls sideways instead.

## Empty and loading

```jsx
{features.length === 0 ? (
  <TableRow>
    <TableCell colSpan={3}>
      <Typography variant="body2" color="text.secondary">No features.</Typography>
    </TableCell>
  </TableRow>
) : null}
```

`colSpan` equals the number of columns. A loading row can hold a `LinearProgress` the same way.

## Sort

```jsx
import { TableSortLabel } from '@mui/material'

const [orderBy, setOrderBy] = useState('name')
const [order, setOrder] = useState('asc')

function toggle(column) {
  if (orderBy === column) setOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
  else {
    setOrderBy(column)
    setOrder('asc')
  }
}

<TableCell sortDirection={orderBy === 'name' ? order : false}>
  <TableSortLabel
    active={orderBy === 'name'}
    direction={orderBy === 'name' ? order : 'asc'}
    onClick={() => toggle('name')}
  >
    Name
  </TableSortLabel>
</TableCell>
```

Sort a copy while rendering. Do not `sort()` the array from the store. That mutates the snapshot.

```jsx
const sorted = [...features].sort((a, b) => {
  const result = String(a[orderBy]).localeCompare(String(b[orderBy]))
  return order === 'asc' ? result : -result
})
```

## Pagination

```jsx
import { TablePagination } from '@mui/material'

const [page, setPage] = useState(0)
const [rowsPerPage, setRowsPerPage] = useState(10)
const slice = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

<TablePagination
  component="div"
  count={sorted.length}
  page={page}
  onPageChange={(_, next) => setPage(next)}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={(event) => {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }}
  rowsPerPageOptions={[10, 25, 50]}
/>
```

`page` here is 0-based. `component="div"` lets you put it under the table, outside `TableBody`. Reset `page` to 0 when the filter changes, or a short list lands on an empty page.

## When to switch to the Data Grid

Add `@mui/x-data-grid` when you need column resize, built-in filter menus, checkbox selection across pages, or hundreds of rows. The next chapter is that component. A dozen users do not need it.
