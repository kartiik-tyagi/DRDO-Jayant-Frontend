import { Card, CardContent, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useExerciseStore } from '../state/useExerciseStore'

export default function ForcesPage({ config }) {
  const columns = config.forces?.columns || []
  const rows = config.forces?.rows || []
  const selectedId = useExerciseStore((state) => state.selectedId)
  const select = useExerciseStore((state) => state.select)

  return (
    <Card sx={{ height: '100%', minHeight: 560, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6">Order of battle</Typography>
        <Typography variant="body2" color="text.secondary">
          Columns and rows come from public/config/forces.json.
        </Typography>
      </CardContent>
      <CardContent sx={{ flex: 1, minHeight: 0, pt: 0 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick={false}
          rowSelectionModel={selectedId ? { type: 'include', ids: new Set([selectedId]) } : { type: 'include', ids: new Set() }}
          onRowClick={(params) => select(params.id)}
          pageSizeOptions={[10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{ border: 0 }}
        />
      </CardContent>
    </Card>
  )
}
