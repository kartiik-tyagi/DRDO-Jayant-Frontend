import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'

function Fact({ label, children }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
        {label}
      </Typography>
      {children}
    </Box>
  )
}

function Choice({ label, value, options, disabled, onSelect }) {
  return (
    <Fact label={label}>
      <TextField
        select
        size="small"
        hiddenLabel
        value={value}
        disabled={disabled}
        onChange={(event) => onSelect(event.target.value)}
        aria-label={label}
        sx={{ minWidth: 168, '& .MuiInputBase-root': { minHeight: 36 }, '& .MuiSelect-select': { py: 0.75 } }}
      >
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id} disabled={item.disabled} sx={{ minHeight: 40 }}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    </Fact>
  )
}

export function ScenarioContext() {
  const session = useSessionStore((state) => state.session)
  const changeScenario = useSessionStore((state) => state.changeScenario)
  const changeGame = useSessionStore((state) => state.changeGame)
  const [pending, setPending] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!session) return null

  const games = session.games || []
  const scenario = session.scenarios.find((item) => item.id === session.activeScenarioId)
  const game = games.find((item) => item.id === session.activeGame.id) || session.activeGame

  function ask(kind, id) {
    if (busy) return
    if (kind === 'scenario') {
      if (id === session.activeScenarioId) return
      const next = session.scenarios.find((item) => item.id === id)
      if (!next) return
      setError('')
      setPending({ kind, id, name: next.name, from: scenario?.name || 'the current scenario' })
      return
    }
    if (id === session.activeGame.id) return
    const next = games.find((item) => item.id === id)
    if (!next || !next.open) return
    setError('')
    setPending({ kind, id, name: next.name, from: game?.name || 'the current game' })
  }

  function close() {
    if (busy) return
    setPending(null)
    setError('')
  }

  async function confirm() {
    if (!pending) return
    setBusy(true)
    setError('')
    try {
      if (pending.kind === 'scenario') await changeScenario(pending.id)
      else await changeGame(pending.id)
      setPending(null)
    } catch (failure) {
      setError(failure?.message || 'The change could not be made.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {session.canSelectScenario ? (
          <Choice
            label="Scenario"
            value={session.activeScenarioId}
            disabled={busy}
            onSelect={(id) => ask('scenario', id)}
            options={session.scenarios.map((item) => ({ id: item.id, label: item.name }))}
          />
        ) : (
          <Fact label="Scenario">
            <Typography variant="body2" noWrap>
              {scenario?.name}
            </Typography>
          </Fact>
        )}
        {session.canSelectGame ? (
          <Choice
            label="Game"
            value={session.activeGame.id}
            disabled={busy}
            onSelect={(id) => ask('game', id)}
            options={games.map((item) => ({
              id: item.id,
              label: item.open ? item.name : `${item.name} · Closed`,
              disabled: !item.open,
            }))}
          />
        ) : (
          <Fact label="Game">
            <Typography variant="body2" noWrap>
              {session.activeGame.name}
            </Typography>
          </Fact>
        )}
      </Stack>
      <Dialog open={Boolean(pending)} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle>{pending?.kind === 'game' ? 'Change the game' : 'Change the scenario'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.primary">
            {pending
              ? `Change ${pending.kind} from ${pending.from} to ${pending.name}? This applies to the exercise.`
              : ''}
          </Typography>
          {error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirm} disabled={busy || !pending}>
            {busy ? 'Changing' : 'Change'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
