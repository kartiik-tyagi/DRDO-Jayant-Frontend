import { z } from 'zod'
import { findNode } from '../lib/tree'
import {
  DEMO_PASSWORD,
  PLAYING_NOTE,
  blueTheme,
  exerciseTheme,
  forceTree,
  loginContext,
  mapConfig,
} from './fixtures'

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

const positionSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    kind: z.enum(['appointment', 'asset']),
    service: z.string(),
    teamId: z.string(),
    teamName: z.string(),
  })
  .passthrough()

const loginContextSchema = z.object({
  exerciseTitle: z.string(),
  classification: z.string(),
  scenarioName: z.string(),
  gameName: z.string(),
  gameOpen: z.boolean(),
  backgroundImage: z.string(),
  passwordHint: z.string(),
  theme: themeSchema,
  positions: z.array(positionSchema).min(1),
})

function readContext() {
  const parsed = loginContextSchema.safeParse(loginContext)
  if (!parsed.success) {
    throw new ApiError('The exercise directory could not be read.', 'VALIDATION')
  }
  return parsed.data
}

export async function getLoginContext() {
  await wait(180)
  return readContext()
}

export async function login({ positionId, password }) {
  await wait(220)
  const context = readContext()
  if (!password) throw new ApiError('Enter the password.', 'VALIDATION')
  if (password !== DEMO_PASSWORD) throw new ApiError('The password is not recognised.', 'VALIDATION')
  const position = context.positions.find((item) => item.id === positionId)
  if (!position) throw new ApiError('Choose a position that is in the open game.', 'VALIDATION')
  if (!context.gameOpen && position.id !== 'apex') {
    throw new ApiError('No game is open. Only APEX can sign in.', 'NOT_ACTIVE_GAME')
  }
  const commandTree = position.id === 'apex' ? forceTree : findNode(forceTree, position.id)
  if (!commandTree) throw new ApiError('This position has no playing command.', 'VALIDATION')
  return {
    position,
    theme: position.teamId === 'blue' ? blueTheme : exerciseTheme,
    exerciseTitle: context.exerciseTitle,
    classification: context.classification,
    scenarioName: context.scenarioName,
    gameName: context.gameName,
    playingNote: PLAYING_NOTE,
    commandTree,
    mapConfig,
  }
}
