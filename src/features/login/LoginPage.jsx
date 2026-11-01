import { useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getLoginContext, login } from '../../shared/api/client'
import { ErrorState } from '../../shared/ui/ErrorState'
import { LoadingState } from '../../shared/ui/LoadingState'
import { LoginCard } from '../../shared/ui/LoginCard'
import { PasswordField } from '../../shared/ui/PasswordField'
import { PositionSelect } from '../../shared/ui/PositionSelect'
import { useSessionStore } from '../session/useSessionStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const signIn = useSessionStore((state) => state.signIn)
  const [positionId, setPositionId] = useState('')
  const [password, setPassword] = useState('')
  const context = useQuery({ queryKey: ['login-context'], queryFn: getLoginContext })

  useEffect(() => {
    const first = context.data?.positions?.[0]?.id
    if (first && !positionId) setPositionId(first)
  }, [context.data, positionId])

  const attempt = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      signIn(session)
      navigate('/')
    },
  })

  if (context.isPending) {
    return <LoadingState label="Opening the exercise" />
  }

  if (context.isError) {
    return (
      <Box sx={{ p: 3, maxWidth: 560 }}>
        <ErrorState
          title="The exercise directory is unavailable"
          message={context.error.message}
          onRetry={() => context.refetch()}
        />
      </Box>
    )
  }

  const data = context.data
  const status = data.gameOpen
    ? `${data.scenarioName} · ${data.gameName}`
    : 'No game is open'

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 3,
        backgroundImage: `linear-gradient(rgba(8, 12, 10, 0.72), rgba(8, 12, 10, 0.84)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <LoginCard
        classification={data.classification}
        title={data.exerciseTitle}
        status={status}
        hint={data.passwordHint}
      >
        <Typography variant="body2">
          Sign in as a position. APEX runs the game. A theatre commander sees only that theatre.
        </Typography>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault()
            attempt.mutate({ positionId, password })
          }}
        >
          <Stack spacing={2}>
            <PositionSelect positions={data.positions} value={positionId} onChange={setPositionId} />
            <PasswordField value={password} onChange={setPassword} />
            {attempt.isError ? (
              <Typography color="error" variant="body2">
                {attempt.error.message}
              </Typography>
            ) : null}
            <Button type="submit" variant="contained" disabled={attempt.isPending || !positionId}>
              {attempt.isPending ? 'Entering' : 'Enter'}
            </Button>
          </Stack>
        </Box>
      </LoginCard>
    </Box>
  )
}
