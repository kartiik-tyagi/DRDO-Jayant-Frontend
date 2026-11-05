import { Alert, AlertTitle, Button } from '@mui/material'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" onClick={onRetry}>
            Try again
          </Button>
        ) : null
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  )
}
