import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useSessionStore } from '../../features/session/useSessionStore'

function Fact({ label, children }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" display="block" noWrap>
        {label}
      </Typography>
      {children}
    </Box>
  )
}

export function ScenarioContext() {
  const session = useSessionStore((state) => state.session)
  const setScenario = useSessionStore((state) => state.setScenario)
  if (!session) return null
  const selected = session.scenarios.find((item) => item.id === session.selectedScenarioId)
  const active = session.scenarios.find((item) => item.id === session.activeScenarioId)
  const mismatch = selected && active && selected.id !== active.id

  return (
    <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <Fact label="Selected scenario">
        {session.canSelectScenario ? (
          <TextField
            select
            size="small"
            value={session.selectedScenarioId}
            onChange={(event) => setScenario(event.target.value)}
            aria-label="Selected scenario"
            sx={{ minWidth: 200, '& .MuiInputBase-root': { minHeight: 44 } }}
          >
            {session.scenarios.map((item) => (
              <MenuItem key={item.id} value={item.id} sx={{ minHeight: 44 }}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <Typography variant="body2" noWrap>
            {selected?.name}
          </Typography>
        )}
      </Fact>
      <Fact label="Active scenario">
        <Typography variant="body2" noWrap>
          {active?.name}
        </Typography>
      </Fact>
      <Fact label="Active game">
        <Typography variant="body2" noWrap>
          {session.activeGame.name}
        </Typography>
      </Fact>
      {mismatch ? (
        <Typography variant="caption" color="warning.main">
          Selected scenario is not the active scenario.
        </Typography>
      ) : null}
    </Stack>
  )
}
