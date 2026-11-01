import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material'
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
            hiddenLabel
            value={session.selectedScenarioId}
            onChange={(event) => setScenario(event.target.value)}
            aria-label="Selected scenario"
            sx={{ minWidth: 168, '& .MuiInputBase-root': { minHeight: 36 }, '& .MuiSelect-select': { py: 0.75 } }}
          >
            {session.scenarios.map((item) => (
              <MenuItem key={item.id} value={item.id} sx={{ minHeight: 40 }}>
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
        <Typography variant="caption" color="text.secondary">
          Selected scenario is not the active scenario.
        </Typography>
      ) : null}
    </Stack>
  )
}
