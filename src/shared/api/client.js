import { z } from 'zod'
import { logger } from '../lib/logger'
import { readExerciseChoice, writeExerciseChoice } from '../lib/sessionKey'
import { ApiError } from './errors'
import { activateGame, activateScenario, adoptExercise, checkPassword, exerciseChoice, loginContext, sessionFor } from './fixtures'

export { ApiError } from './errors'

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

const themeSchema = z.object({
  mode: z.enum(['dark', 'light']),
  primary: z.string(),
  primaryContrast: z.string(),
  secondary: z.string(),
  secondaryContrast: z.string(),
  backgroundDefault: z.string(),
  backgroundPaper: z.string(),
  textPrimary: z.string(),
  textSecondary: z.string(),
  divider: z.string(),
  fontFamily: z.string(),
  borderRadius: z.number(),
})

const namedThemeSchema = themeSchema.extend({
  id: z.string(),
  name: z.string(),
})

const userSchema = z.object({
  id: z.string(),
  title: z.string(),
  role: z.string(),
  service: z.string(),
  avatarUrl: z.string(),
})

const filterSchema = z.object({
  id: z.string(),
  label: z.string(),
  group: z.string(),
  layers: z.string(),
  base: z.boolean(),
  transparent: z.boolean(),
  visible: z.boolean(),
})

const loginContextSchema = z.object({
  exerciseTitle: z.string(),
  systemName: z.string(),
  classification: z.string(),
  purpose: z.string(),
  accessNotice: z.string(),
  activeScenarioName: z.string(),
  activeGameName: z.string(),
  gameOpen: z.boolean(),
  backgroundImage: z.string(),
  passwordHint: z.string(),
  theme: themeSchema,
  users: z.array(userSchema).min(1),
})

const sessionSchema = z.object({
  profile: userSchema,
  theme: namedThemeSchema,
  themes: z.array(namedThemeSchema).min(1),
  scenarios: z.array(z.object({ id: z.string(), name: z.string(), active: z.boolean() })).min(1),
  selectedScenarioId: z.string(),
  activeScenarioId: z.string(),
  activeGame: z.object({ id: z.string(), name: z.string() }),
  games: z.array(z.object({ id: z.string(), name: z.string(), open: z.boolean() })).min(1),
  navigation: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        items: z.array(z.object({ id: z.string(), label: z.string(), icon: z.string() })).min(1),
      }),
    )
    .min(1),
  resources: z.array(z.object({ id: z.string(), name: z.string(), detail: z.string(), status: z.string() })),
  plans: z.array(z.object({ id: z.string(), name: z.string(), detail: z.string(), status: z.string() })),
  filters: z.array(filterSchema).min(1),
  phases: z.array(z.object({ id: z.string(), label: z.string(), filterIds: z.array(z.string()) })),
  canSelectScenario: z.boolean(),
  canSelectGame: z.boolean(),
  canControlGame: z.boolean(),
  mapView: z.object({
    latitude: z.number(),
    longitude: z.number(),
    zoom: z.number(),
    minZoom: z.number(),
    maxZoom: z.number(),
  }),
  mapService: z.string(),
  clockStart: z.string(),
  exerciseTitle: z.string(),
  classification: z.string(),
  demoMode: z.boolean(),
})

let exerciseHydrated = false

function hydrateExercise() {
  if (exerciseHydrated) return
  exerciseHydrated = true
  const rejected = adoptExercise(readExerciseChoice())
  if (rejected.scenarioId) logger.warn('scenario.restore_rejected', { scenarioId: rejected.scenarioId, code: 'UNKNOWN' })
  if (rejected.game) logger.warn('game.restore_rejected', { gameId: rejected.game.id, code: rejected.game.code })
}

function readContext() {
  hydrateExercise()
  const parsed = loginContextSchema.safeParse(loginContext())
  if (!parsed.success) throw new ApiError('The exercise directory could not be read.', 'VALIDATION')
  const data = parsed.data
  if (data.gameOpen) return data
  return { ...data, users: data.users.filter((user) => user.id === 'apex') }
}

function sessionFromDirectory(userId) {
  const context = readContext()
  const user = context.users.find((item) => item.id === userId)
  if (!user) throw new ApiError('This session is no longer valid.', 'SESSION')
  if (!context.gameOpen && user.id !== 'apex') {
    throw new ApiError('No game is active. Only APEX may sign in.', 'NOT_ACTIVE_GAME')
  }
  const parsed = sessionSchema.safeParse(sessionFor(user.id))
  if (!parsed.success) throw new ApiError('The user profile could not be read.', 'VALIDATION')
  return parsed.data
}

export async function getLoginContext() {
  try {
    await wait(180)
    return readContext()
  } catch (error) {
    logger.error('directory.unreadable', { code: error?.code || 'UNKNOWN', message: error?.message })
    throw error
  }
}

export async function login({ userId, password }) {
  try {
    await wait(220)
    if (!password) throw new ApiError('Enter the access password.', 'VALIDATION')
    if (!checkPassword(userId, password)) throw new ApiError('Access refused.', 'VALIDATION')
    if (!userId) throw new ApiError('Select a user.', 'VALIDATION')
    return sessionFromDirectory(userId)
  } catch (error) {
    logger.warn('auth.rejected', { userId: userId || null, code: error?.code || 'UNKNOWN' })
    throw error
  }
}

export async function resumeSession(userId) {
  try {
    await wait(80)
    if (!userId) throw new ApiError('The saved session is not valid.', 'SESSION')
    return sessionFromDirectory(userId)
  } catch (error) {
    logger.warn('session.restore_rejected', { userId: userId || null, code: error?.code || 'UNKNOWN' })
    throw error
  }
}

function persistExercise(userId, event, idName, id) {
  const persisted = writeExerciseChoice(exerciseChoice())
  logger.info(event, { userId, [idName]: id, persisted })
}

export async function changeScenario({ userId, scenarioId }) {
  try {
    await wait(160)
    hydrateExercise()
    const session = sessionFromDirectory(userId)
    if (!session.canSelectScenario) throw new ApiError('This user cannot change the scenario.', 'FORBIDDEN')
    if (!scenarioId) throw new ApiError('Select a scenario.', 'VALIDATION')
    const result = activateScenario(scenarioId)
    if (!result.ok) throw new ApiError('That scenario is not in this exercise.', 'NOT_FOUND')
    if (!result.unchanged) persistExercise(userId, 'scenario.changed', 'scenarioId', result.id)
    return { activeScenarioId: result.id, name: result.name }
  } catch (error) {
    logger.warn('scenario.change_rejected', { userId: userId || null, scenarioId: scenarioId || null, code: error?.code || 'UNKNOWN' })
    throw error
  }
}

export async function changeGame({ userId, gameId }) {
  try {
    await wait(160)
    hydrateExercise()
    const session = sessionFromDirectory(userId)
    if (!session.canSelectGame) throw new ApiError('This user cannot change the game.', 'FORBIDDEN')
    if (!gameId) throw new ApiError('Select a game.', 'VALIDATION')
    const result = activateGame(gameId)
    if (!result.ok && result.code === 'CLOSED') throw new ApiError('That game is closed.', 'CLOSED')
    if (!result.ok) throw new ApiError('That game is not in this exercise.', 'NOT_FOUND')
    if (!result.unchanged) persistExercise(userId, 'game.changed', 'gameId', result.id)
    return { activeGameId: result.id, name: result.name }
  } catch (error) {
    logger.warn('game.change_rejected', { userId: userId || null, gameId: gameId || null, code: error?.code || 'UNKNOWN' })
    throw error
  }
}

export {
  addComment,
  closeReplay,
  connectStream,
  createFeature,
  createGraphic,
  deleteCatalogue,
  deleteFeature,
  deleteGraphic,
  deleteRecording,
  deleteRole,
  deleteTeam,
  deleteUser,
  discardRecording,
  disconnectStream,
  exportPlan,
  extendFeature,
  loadReplay,
  loadWorkbench,
  promoteGraphic,
  redoPlanning,
  resetMapViews,
  saveMapView,
  saveRecording,
  saveRole,
  saveRoute,
  saveTeam,
  saveUser,
  saveZone,
  seekReplay,
  seekScenario,
  setAlertMuted,
  setFlag,
  setLayerOpacity,
  setPlanView,
  setReplayPlaying,
  setScenarioPlaying,
  setSimulation,
  shareGraphic,
  startRecording,
  stepReplay,
  stopRecording,
  subscribeWorkbench,
  undoPlanning,
  updateBasemap,
  updateFeature,
  updateGraphic,
  updatePassword,
  updateStream,
} from './directory'
