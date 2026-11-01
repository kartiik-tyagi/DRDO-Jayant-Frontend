import { Box } from '@mui/material'
import { MapStage } from '../../shared/ui/MapStage'

export default function SituationView() {
  return (
    <Box sx={{ height: '100%', minHeight: 0 }}>
      <MapStage />
    </Box>
  )
}
