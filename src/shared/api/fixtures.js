const fieldTheme = {
  id: 'field',
  name: 'Field',
  mode: 'dark',
  primary: '#3caf72',
  primaryContrast: '#062116',
  secondary: '#d4b15a',
  secondaryContrast: '#1c1914',
  backgroundDefault: '#0d1411',
  backgroundPaper: '#16211c',
  textPrimary: '#e8f0ea',
  textSecondary: '#b7c6bd',
  divider: 'rgba(232, 240, 234, 0.16)',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

const nightTheme = {
  id: 'night',
  name: 'Night watch',
  mode: 'dark',
  primary: '#8eb7e0',
  primaryContrast: '#0c1218',
  secondary: '#d4b15a',
  secondaryContrast: '#1c1914',
  backgroundDefault: '#0c1218',
  backgroundPaper: '#152033',
  textPrimary: '#e7eef6',
  textSecondary: '#b7c6d6',
  divider: 'rgba(231, 238, 246, 0.16)',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

const sandTheme = {
  id: 'sand',
  name: 'Sand',
  mode: 'light',
  primary: '#5a4616',
  primaryContrast: '#fffdf8',
  secondary: '#1f6b45',
  secondaryContrast: '#f7fbf8',
  backgroundDefault: '#f4f0e6',
  backgroundPaper: '#fffdf8',
  textPrimary: '#1c1914',
  textSecondary: '#5c564c',
  divider: 'rgba(28, 25, 20, 0.14)',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

export const DEMO_PASSWORD = '123'

export const themes = [fieldTheme, nightTheme, sandTheme]

export const exerciseTheme = {
  mode: fieldTheme.mode,
  primary: fieldTheme.primary,
  primaryContrast: fieldTheme.primaryContrast,
  secondary: fieldTheme.secondary,
  secondaryContrast: fieldTheme.secondaryContrast,
  backgroundDefault: fieldTheme.backgroundDefault,
  backgroundPaper: fieldTheme.backgroundPaper,
  textPrimary: fieldTheme.textPrimary,
  textSecondary: fieldTheme.textSecondary,
  divider: fieldTheme.divider,
  fontFamily: fieldTheme.fontFamily,
  borderRadius: fieldTheme.borderRadius,
}

const mapFilters = [
  { id: 'countries', label: 'Countries', group: 'Base', layers: 'ne:countries', base: true, transparent: false },
  { id: 'places', label: 'Populated places', group: 'Reference', layers: 'ne:populated_places', base: false, transparent: true },
  { id: 'coast', label: 'Coastline', group: 'Reference', layers: 'ne:coastlines', base: false, transparent: true },
  { id: 'boundaries', label: 'Boundaries', group: 'Reference', layers: 'ne:boundary_lines', base: false, transparent: true },
  { id: 'disputed', label: 'Disputed areas', group: 'Reference', layers: 'ne:disputed_areas', base: false, transparent: true },
]

const resourceCatalog = [
  { id: 'fuel', name: 'Fuel', detail: 'Bulk fuel for the active game', status: 'Open' },
  { id: 'ammunition', name: 'Ammunition', detail: 'Holdings released to this role', status: 'Open' },
  { id: 'air-effort', name: 'Air effort', detail: 'Sortie allocation', status: 'Held' },
  { id: 'shipping', name: 'Shipping', detail: 'Sea lift for the active game', status: 'Open' },
  { id: 'medical', name: 'Medical', detail: 'Field medical cover', status: 'Open' },
]

const planCatalog = [
  { id: 'northern-plan', name: 'Northern Approach', detail: 'Plan for the active scenario', status: 'Active' },
  { id: 'southern-plan', name: 'Southern Approach', detail: 'Held plan', status: 'Held' },
  { id: 'air-plan', name: 'Air support', detail: 'Air tasking for Game Alpha', status: 'Active' },
  { id: 'maritime-plan', name: 'Sea control', detail: 'Maritime plan for Game Alpha', status: 'Active' },
]

const mapItems = [
  { id: 'filters', label: 'Map filters', icon: 'layers' },
  { id: 'extent', label: 'Home extent', icon: 'extent' },
]

const gameItems = {
  resources: { id: 'resources', label: 'Resources', icon: 'resources' },
  plans: { id: 'plans', label: 'Plans', icon: 'plans' },
  control: { id: 'exercise-control', label: 'Exercise control', icon: 'control' },
}

function navigation(includeControl) {
  const items = [gameItems.resources, gameItems.plans]
  if (includeControl) items.push(gameItems.control)
  return [
    { id: 'map', label: 'Map', items: mapItems },
    { id: 'game', label: 'Game', items },
  ]
}

const grants = {
  apex: {
    canSelectScenario: true,
    canControlGame: true,
    filterIds: ['countries', 'places', 'coast', 'boundaries', 'disputed'],
    defaults: { countries: true, places: true, coast: false, boundaries: false, disputed: false },
    resourceIds: ['fuel', 'ammunition', 'air-effort', 'shipping', 'medical'],
    planIds: ['northern-plan', 'southern-plan', 'air-plan', 'maritime-plan'],
  },
  direction: {
    canSelectScenario: true,
    canControlGame: false,
    filterIds: ['countries', 'places', 'coast', 'boundaries'],
    defaults: { countries: true, places: true, coast: false, boundaries: true },
    resourceIds: ['fuel', 'ammunition', 'air-effort', 'medical'],
    planIds: ['northern-plan', 'southern-plan', 'air-plan'],
  },
  theatre: {
    canSelectScenario: false,
    canControlGame: false,
    filterIds: ['countries', 'places', 'coast'],
    defaults: { countries: true, places: true, coast: false },
    resourceIds: ['fuel', 'ammunition', 'medical'],
    planIds: ['northern-plan', 'southern-plan'],
  },
  air: {
    canSelectScenario: false,
    canControlGame: false,
    filterIds: ['countries', 'places', 'coast'],
    defaults: { countries: true, places: true, coast: false },
    resourceIds: ['fuel', 'air-effort'],
    planIds: ['air-plan', 'northern-plan'],
  },
  maritime: {
    canSelectScenario: false,
    canControlGame: false,
    filterIds: ['countries', 'coast', 'places'],
    defaults: { countries: true, places: false, coast: true },
    resourceIds: ['fuel', 'shipping'],
    planIds: ['maritime-plan'],
  },
}

const users = [
  { id: 'apex', title: 'APEX', role: 'Exercise control', service: 'Control', avatarUrl: '/avatars/apex.svg', themeId: 'night', grant: 'apex' },
  { id: 'cosc', title: 'CoSC', role: 'Joint direction', service: 'Joint', avatarUrl: '/avatars/cosc.svg', themeId: 'field', grant: 'direction' },
  { id: 'etc', title: 'Eastern Theatre Commander', role: 'Theatre picture', service: 'Joint', avatarUrl: '/avatars/east.svg', themeId: 'field', grant: 'theatre' },
  { id: 'wtc', title: 'Western Theatre Commander', role: 'Theatre picture', service: 'Joint', avatarUrl: '/avatars/west.svg', themeId: 'night', grant: 'theatre' },
  { id: 'ntc', title: 'Northern Theatre Commander', role: 'Theatre picture', service: 'Joint', avatarUrl: '/avatars/north.svg', themeId: 'field', grant: 'theatre' },
  { id: 'esc', title: 'Eastern Strike Corps Commander', role: 'Corps picture', service: 'Army', avatarUrl: '/avatars/corps.svg', themeId: 'field', grant: 'theatre' },
  { id: 'aoc', title: 'Eastern Air Command AoC', role: 'Air picture', service: 'Air', avatarUrl: '/avatars/air.svg', themeId: 'night', grant: 'air' },
  { id: 'foc', title: 'Western Naval Command FoC', role: 'Maritime picture', service: 'Navy', avatarUrl: '/avatars/navy.svg', themeId: 'night', grant: 'maritime' },
]

export const scenarios = [
  { id: 'northern', name: 'Northern Approach' },
  { id: 'southern', name: 'Southern Approach' },
]

export const games = [
  { id: 'alpha', name: 'Game Alpha', open: true },
  { id: 'bravo', name: 'Game Bravo', open: true },
  { id: 'charlie', name: 'Game Charlie', open: false },
]

let activeScenarioId = scenarios[0].id
let activeGameId = games[0].id

export function currentExercise() {
  const scenario = scenarios.find((item) => item.id === activeScenarioId) || scenarios[0]
  const game = games.find((item) => item.id === activeGameId) || games.find((item) => item.open) || games[0]
  return { scenario, game }
}

export function exerciseChoice() {
  const { scenario, game } = currentExercise()
  return { scenarioId: scenario.id, gameId: game.id }
}

export function adoptExercise(choice) {
  const rejected = {}
  if (!choice) return rejected
  if (choice.scenarioId) {
    if (scenarios.some((item) => item.id === choice.scenarioId)) activeScenarioId = choice.scenarioId
    else rejected.scenarioId = choice.scenarioId
  }
  if (choice.gameId) {
    const game = games.find((item) => item.id === choice.gameId)
    if (game?.open) activeGameId = game.id
    else rejected.game = { id: choice.gameId, code: game ? 'CLOSED' : 'UNKNOWN' }
  }
  return rejected
}

export function activateScenario(scenarioId) {
  const scenario = scenarios.find((item) => item.id === scenarioId)
  if (!scenario) return { ok: false, code: 'NOT_FOUND' }
  if (scenario.id === activeScenarioId) return { ok: true, unchanged: true, id: scenario.id, name: scenario.name }
  activeScenarioId = scenario.id
  return { ok: true, unchanged: false, id: scenario.id, name: scenario.name }
}

export function activateGame(gameId) {
  const game = games.find((item) => item.id === gameId)
  if (!game) return { ok: false, code: 'NOT_FOUND' }
  if (!game.open) return { ok: false, code: 'CLOSED' }
  if (game.id === activeGameId) return { ok: true, unchanged: true, id: game.id, name: game.name }
  activeGameId = game.id
  return { ok: true, unchanged: false, id: game.id, name: game.name }
}

export const phases = [
  { id: 'plan', label: 'Plan', filterIds: ['countries', 'boundaries', 'places'] },
  { id: 'conduct', label: 'Conduct', filterIds: ['countries', 'places', 'coast'] },
  { id: 'review', label: 'Review', filterIds: ['countries', 'coast', 'disputed'] },
]

export const mapView = {
  latitude: 24.5,
  longitude: 82,
  zoom: 5,
  minZoom: 3,
  maxZoom: 12,
}

export const mapService = 'http://127.0.0.1:8080/geoserver/wms'

export const clockStart = '2026-10-28T06:00:00'

const exerciseMeta = {
  exerciseTitle: 'Exercise Jayant',
  systemName: 'JAYANT',
  classification: 'EXERCISE',
  purpose: 'Situation picture',
  accessNotice: 'Authorised users only',
  backgroundImage: '/login-background.png',
  passwordHint: 'Exercise access: 123',
  theme: exerciseTheme,
  users: users.map(({ id, title, role, service, avatarUrl }) => ({ id, title, role, service, avatarUrl })),
}

export function loginContext() {
  const { scenario, game } = currentExercise()
  return {
    ...exerciseMeta,
    activeScenarioName: scenario?.name || '',
    activeGameName: game?.open ? game.name : '',
    gameOpen: Boolean(game?.open),
  }
}

function pick(catalog, ids) {
  return catalog.filter((item) => ids.includes(item.id))
}

export function sessionFor(userId) {
  const user = users.find((item) => item.id === userId)
  if (!user) return null
  const grant = grants[user.grant]
  const theme = themes.find((item) => item.id === user.themeId) || themes[0]
  const { scenario, game } = currentExercise()
  return {
    profile: {
      id: user.id,
      title: user.title,
      role: user.role,
      service: user.service,
      avatarUrl: user.avatarUrl,
    },
    theme,
    themes,
    scenarios: scenarios.map((item) => ({ ...item, active: item.id === scenario.id })),
    selectedScenarioId: scenario.id,
    activeScenarioId: scenario.id,
    activeGame: { id: game.id, name: game.name },
    games: games.map(({ id, name, open }) => ({ id, name, open })),
    navigation: navigation(grant.canControlGame),
    resources: pick(resourceCatalog, grant.resourceIds),
    plans: pick(planCatalog, grant.planIds),
    filters: mapFilters
      .filter((filter) => grant.filterIds.includes(filter.id))
      .map((filter) => ({ ...filter, visible: Boolean(grant.defaults[filter.id]) })),
    phases,
    canSelectScenario: grant.canSelectScenario,
    canSelectGame: grant.canControlGame,
    canControlGame: grant.canControlGame,
    mapView,
    mapService,
    clockStart,
    exerciseTitle: exerciseMeta.exerciseTitle,
    classification: exerciseMeta.classification,
  }
}
