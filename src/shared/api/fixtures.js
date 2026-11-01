const fieldTheme = {
  id: 'field',
  name: 'Field',
  mode: 'dark',
  primary: '#1f6b45',
  secondary: '#d4b15a',
  backgroundDefault: '#0d1411',
  backgroundPaper: '#16211c',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

const nightTheme = {
  id: 'night',
  name: 'Night watch',
  mode: 'dark',
  primary: '#1d4e89',
  secondary: '#d4b15a',
  backgroundDefault: '#0c1218',
  backgroundPaper: '#152033',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

const sandTheme = {
  id: 'sand',
  name: 'Sand',
  mode: 'light',
  primary: '#6b5424',
  secondary: '#1f6b45',
  backgroundDefault: '#f3efe4',
  backgroundPaper: '#fffdf8',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

export const DEMO_PASSWORD = 'layout'

export const themes = [fieldTheme, nightTheme, sandTheme]

export const exerciseTheme = {
  mode: fieldTheme.mode,
  primary: fieldTheme.primary,
  secondary: fieldTheme.secondary,
  backgroundDefault: fieldTheme.backgroundDefault,
  backgroundPaper: fieldTheme.backgroundPaper,
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

const grants = {
  apex: {
    canSelectScenario: true,
    canControlGame: true,
    options: [
      { id: 'extent', label: 'Home extent' },
      { id: 'filters', label: 'Map filters' },
      { id: 'themes', label: 'Themes' },
      { id: 'exercise-control', label: 'Exercise control' },
    ],
    filterIds: ['countries', 'places', 'coast', 'boundaries', 'disputed'],
    defaults: { countries: true, places: true, coast: false, boundaries: false, disputed: false },
  },
  direction: {
    canSelectScenario: true,
    canControlGame: false,
    options: [
      { id: 'extent', label: 'Home extent' },
      { id: 'filters', label: 'Map filters' },
      { id: 'themes', label: 'Themes' },
    ],
    filterIds: ['countries', 'places', 'coast', 'boundaries'],
    defaults: { countries: true, places: true, coast: false, boundaries: true },
  },
  theatre: {
    canSelectScenario: false,
    canControlGame: false,
    options: [
      { id: 'extent', label: 'Home extent' },
      { id: 'filters', label: 'Map filters' },
      { id: 'themes', label: 'Themes' },
    ],
    filterIds: ['countries', 'places', 'coast'],
    defaults: { countries: true, places: true, coast: false },
  },
  air: {
    canSelectScenario: false,
    canControlGame: false,
    options: [
      { id: 'extent', label: 'Home extent' },
      { id: 'filters', label: 'Map filters' },
      { id: 'themes', label: 'Themes' },
    ],
    filterIds: ['countries', 'places', 'coast'],
    defaults: { countries: true, places: true, coast: false },
  },
  maritime: {
    canSelectScenario: false,
    canControlGame: false,
    options: [
      { id: 'extent', label: 'Home extent' },
      { id: 'filters', label: 'Map filters' },
      { id: 'themes', label: 'Themes' },
    ],
    filterIds: ['countries', 'coast', 'places'],
    defaults: { countries: true, places: false, coast: true },
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
  { id: 'northern', name: 'Northern Approach', active: true },
  { id: 'southern', name: 'Southern Approach', active: false },
]

export const activeGame = { id: 'alpha', name: 'Game Alpha', open: true }

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

const activeScenario = scenarios.find((item) => item.active)

export const loginContext = {
  exerciseTitle: 'Exercise Jayant',
  systemName: 'JAYANT',
  classification: 'EXERCISE',
  purpose: 'Situation picture',
  accessNotice: 'Authorised users only',
  activeScenarioName: activeScenario?.name || '',
  activeGameName: activeGame.open ? activeGame.name : '',
  gameOpen: activeGame.open,
  backgroundImage: '/login-background.svg',
  passwordHint: 'Exercise access: layout',
  theme: exerciseTheme,
  users: users.map(({ id, title, role, service, avatarUrl }) => ({ id, title, role, service, avatarUrl })),
}

export function sessionFor(userId) {
  const user = users.find((item) => item.id === userId)
  if (!user) return null
  const grant = grants[user.grant]
  const theme = themes.find((item) => item.id === user.themeId) || themes[0]
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
    scenarios,
    selectedScenarioId: activeScenario?.id || scenarios[0].id,
    activeScenarioId: activeScenario?.id || scenarios[0].id,
    activeGame: { id: activeGame.id, name: activeGame.name },
    options: grant.options,
    filters: mapFilters
      .filter((filter) => grant.filterIds.includes(filter.id))
      .map((filter) => ({ ...filter, visible: Boolean(grant.defaults[filter.id]) })),
    phases,
    canSelectScenario: grant.canSelectScenario,
    canControlGame: grant.canControlGame,
    mapView,
    mapService,
    clockStart,
    exerciseTitle: loginContext.exerciseTitle,
    classification: loginContext.classification,
  }
}
