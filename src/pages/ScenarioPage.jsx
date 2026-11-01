import { Card, CardContent, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'

export default function ScenarioPage({ config }) {
  const scenario = config.scenario || {}
  const start = dayjs(scenario.clock?.start)
  const startText = start.isValid() ? start.format('DD MMM YYYY HH:mm:ss') : scenario.clock?.start

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Typography variant="overline" color="secondary">
            {scenario.classification}
          </Typography>
          <Typography variant="h5">{scenario.name}</Typography>
          <Typography sx={{ mt: 1 }}>{scenario.summary}</Typography>
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Location: {scenario.locationName}
          </Typography>
          <Typography color="text.secondary">Phase: {scenario.phase}</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">Objectives</Typography>
          <List>
            {(scenario.objectives || []).map((objective) => (
              <ListItem key={objective} disableGutters>
                <ListItemText primary={objective} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6">Clock</Typography>
          <Typography sx={{ mt: 1 }}>Label: {scenario.clock?.label}</Typography>
          <Typography>Start: {startText}</Typography>
          <Typography>
            Rate: {scenario.clock?.rate} exercise seconds for each real second
          </Typography>
          <Typography>
            Starts {scenario.clock?.running ? 'running' : 'paused'}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  )
}
