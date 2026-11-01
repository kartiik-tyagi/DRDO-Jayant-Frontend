import { z } from 'zod'
import { DEMO_PASSWORD, loginContext, sessionFor } from './fixtures'

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

export class ApiError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

const themeSchema = z.object({
  mode: z.enum(['dark', 'light']),
  primary: z.string(),
  secondary: z.string(),
  backgroundDefault: z.string(),
  backgroundPaper: z.string(),
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
  options: z.array(z.object({ id: z.string(), label: z.string() })).min(1),
  filters: z.array(filterSchema).min(1),
  phases: z.array(z.object({ id: z.string(), label: z.string(), filterIds: z.array(z.string()) })),
  canSelectScenario: z.boolean(),
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
})

function readContext() {
  const parsed = loginContextSchema.safeParse(loginContext)
  if (!parsed.success) throw new ApiError('The exercise directory could not be read.', 'VALIDATION')
  const data = parsed.data
  if (data.gameOpen) return data
  return { ...data, users: data.users.filter((user) => user.id === 'apex') }
}

export async function getLoginContext() {
  await wait(180)
  return readContext()
}

export async function login({ userId, password }) {
  await wait(220)
  const context = readContext()
  if (!password) throw new ApiError('Enter the access password.', 'VALIDATION')
  if (password !== DEMO_PASSWORD) throw new ApiError('Access refused.', 'VALIDATION')
  const user = context.users.find((item) => item.id === userId)
  if (!user) throw new ApiError('Select a user.', 'VALIDATION')
  if (!context.gameOpen && user.id !== 'apex') {
    throw new ApiError('No game is active. Only APEX may sign in.', 'NOT_ACTIVE_GAME')
  }
  const session = sessionFor(user.id)
  const parsed = sessionSchema.safeParse(session)
  if (!parsed.success) throw new ApiError('The user profile could not be read.', 'VALIDATION')
  return parsed.data
}
