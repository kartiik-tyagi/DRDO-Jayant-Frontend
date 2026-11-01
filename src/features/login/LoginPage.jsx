import { useEffect, useState } from 'react'
import { Alert, Avatar, Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getLoginContext, login } from '../../shared/api/client'
import { ErrorState } from '../../shared/ui/ErrorState'
import { LoadingState } from '../../shared/ui/LoadingState'
import { PasswordField } from '../../shared/ui/PasswordField'
import { PositionSelect } from '../../shared/ui/PositionSelect'
import { useSessionStore } from '../session/useSessionStore'

function ClassificationBar({ left, right }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 0.75,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        bgcolor: 'rgba(0, 0, 0, 0.82)',
        color: '#f3efe4',
      }}
    >
      <Typography variant="caption" sx={{ letterSpacing: '0.16em' }}>
        {left}
      </Typography>
      <Typography variant="caption" sx={{ letterSpacing: '0.08em' }}>
        {right}
      </Typography>
    </Box>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const signIn = useSessionStore((state) => state.signIn)
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const context = useQuery({ queryKey: ['login-context'], queryFn: getLoginContext })

  useEffect(() => {
    document.title = 'Jayant'
  }, [])

  useEffect(() => {
    const first = context.data?.users?.[0]?.id
    if (first && !userId) setUserId(first)
  }, [context.data, userId])

  const attempt = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      signIn(session)
      navigate('/')
    },
  })

  if (context.isPending) return <LoadingState label="Opening Jayant" />

  if (context.isError) {
    return (
      <Box sx={{ p: 3, maxWidth: 560 }}>
        <ErrorState title="Jayant is unavailable" message={context.error.message} onRetry={() => context.refetch()} />
      </Box>
    )
  }

  const data = context.data
  const selected = data.users.find((user) => user.id === userId)

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `linear-gradient(rgba(6, 10, 8, 0.88), rgba(6, 10, 8, 0.92)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <ClassificationBar left={data.classification} right={data.accessNotice} />
      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', px: 2, py: 3 }}>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault()
            attempt.mutate({ userId, password })
          }}
          sx={{
            width: 'min(460px, 100%)',
            p: { xs: 2.5, sm: 3.5 },
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: '0.22em' }}>
                {data.systemName}
              </Typography>
              <Typography variant="h4" component="h1">
                {data.exerciseTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.purpose}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'grid', gridTemplateColumns: '148px 1fr', rowGap: 1, columnGap: 1.5, alignItems: 'baseline' }}>
              <Typography variant="caption" color="text.secondary">
                Active scenario
              </Typography>
              <Typography variant="body2">{data.activeScenarioName || 'None'}</Typography>
              <Typography variant="caption" color="text.secondary">
                Active game
              </Typography>
              <Typography variant="body2">{data.gameOpen ? data.activeGameName : 'None active'}</Typography>
            </Box>
            {selected ? (
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Avatar src={selected.avatarUrl} alt="" variant="rounded" sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="subtitle1">{selected.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selected.role}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selected.service}
                  </Typography>
                </Box>
              </Stack>
            ) : null}
            <PositionSelect users={data.users} value={userId} onChange={setUserId} />
            <PasswordField value={password} onChange={setPassword} />
            {attempt.isError ? <Alert severity="error">{attempt.error.message}</Alert> : null}
            <Button type="submit" variant="contained" disabled={attempt.isPending || !userId}>
              {attempt.isPending ? 'Signing in' : 'Sign in'}
            </Button>
            {data.passwordHint ? (
              <Typography variant="caption" color="text.secondary">
                {data.passwordHint}
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </Box>
      <ClassificationBar left={data.classification} right={data.systemName} />
    </Box>
  )
}
