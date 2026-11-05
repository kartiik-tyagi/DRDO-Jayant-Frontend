import { Alert, Box } from '@mui/material'
import { useToastStore } from '../../features/feedback/useToastStore'

export function ToastHost() {
  const items = useToastStore((state) => state.items)
  const dismiss = useToastStore((state) => state.dismiss)
  if (!items.length) return null
  return (
    <Box sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1400, display: 'flex', flexDirection: 'column', gap: 1, width: 'min(360px, calc(100% - 32px))' }}>
      {items.map((item) => (
        <Alert key={item.id} severity={item.severity} onClose={() => dismiss(item.id)}>
          {item.message}
        </Alert>
      ))}
    </Box>
  )
}
