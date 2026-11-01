function appointment(fields, children = []) {
  return {
    kind: 'appointment',
    canSignIn: true,
    teamId: 'blue',
    teamName: 'Blue',
    ...fields,
    children,
  }
}

function asset(fields) {
  return {
    kind: 'asset',
    canSignIn: false,
    teamId: 'blue',
    teamName: 'Blue',
    children: [],
    ...fields,
  }
}

export const DEMO_PASSWORD = 'layout'

export const exerciseTheme = {
  mode: 'dark',
  primary: '#1f6b45',
  secondary: '#d4b15a',
  backgroundDefault: '#0d1411',
  backgroundPaper: '#16211c',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

export const blueTheme = {
  mode: 'dark',
  primary: '#1d4e89',
  secondary: '#d4b15a',
  backgroundDefault: '#0c1218',
  backgroundPaper: '#152033',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

export const forceTree = appointment(
  {
    id: 'cosc',
    title: 'CoSC',
    service: 'Joint',
    parentId: null,
    parentTitle: null,
    callsign: 'CoSC',
    latitude: 28.61,
    longitude: 77.21,
  },
  [
    appointment(
      {
        id: 'etc',
        title: 'Eastern Theatre Commander',
        service: 'Joint',
        parentId: 'cosc',
        parentTitle: 'CoSC',
        callsign: 'E-THR',
        latitude: 22.57,
        longitude: 88.36,
      },
      [
        appointment({
          id: 'esc',
          title: 'Eastern Strike Corps Commander',
          service: 'Army',
          parentId: 'etc',
          parentTitle: 'Eastern Theatre Commander',
          callsign: 'E-CORPS',
          latitude: 26.14,
          longitude: 91.74,
        }),
        appointment({
          id: 'aoc',
          title: 'Eastern Air Command AoC',
          service: 'Air',
          parentId: 'etc',
          parentTitle: 'Eastern Theatre Commander',
          callsign: 'E-AOC',
          latitude: 24.82,
          longitude: 92.79,
        }),
        asset({
          id: 'east-airbase',
          title: 'Eastern Airbase',
          service: 'Air',
          parentId: 'etc',
          parentTitle: 'Eastern Theatre Commander',
          callsign: 'E-AIR',
          latitude: 27.05,
          longitude: 94.02,
        }),
      ],
    ),
    appointment(
      {
        id: 'wtc',
        title: 'Western Theatre Commander',
        service: 'Joint',
        parentId: 'cosc',
        parentTitle: 'CoSC',
        callsign: 'W-THR',
        latitude: 26.91,
        longitude: 75.79,
      },
      [
        appointment({
          id: 'foc',
          title: 'Western Naval Command FoC',
          service: 'Navy',
          parentId: 'wtc',
          parentTitle: 'Western Theatre Commander',
          callsign: 'W-FOC',
          latitude: 18.94,
          longitude: 72.84,
        }),
        asset({
          id: 'west-port',
          title: 'Western Port',
          service: 'Navy',
          parentId: 'wtc',
          parentTitle: 'Western Theatre Commander',
          callsign: 'W-PORT',
          latitude: 22.3,
          longitude: 70.8,
        }),
      ],
    ),
    appointment({
      id: 'ntc',
      title: 'Northern Theatre Commander',
      service: 'Joint',
      parentId: 'cosc',
      parentTitle: 'CoSC',
      callsign: 'N-THR',
      latitude: 32.73,
      longitude: 74.86,
    }),
  ],
)

export const apexPosition = {
  id: 'apex',
  title: 'APEX',
  kind: 'appointment',
  canSignIn: true,
  service: 'Control',
  teamId: 'control',
  teamName: 'Control',
  parentId: null,
  parentTitle: null,
  callsign: 'APEX',
  latitude: null,
  longitude: null,
  children: [],
}

export const GAME_OPEN = true

function collectAppointments(node, list = []) {
  if (node.kind === 'appointment') list.push(node)
  for (const child of node.children || []) collectAppointments(child, list)
  return list
}

export const loginContext = {
  exerciseTitle: 'Exercise Jayant',
  classification: 'EXERCISE',
  scenarioName: 'Northern Approach',
  gameName: 'Game Alpha',
  gameOpen: GAME_OPEN,
  backgroundImage: '/login-background.svg',
  passwordHint: 'Demo password: layout',
  theme: exerciseTheme,
  positions: GAME_OPEN ? [apexPosition, ...collectAppointments(forceTree)] : [apexPosition],
}

export const mapConfig = {
  title: 'Situation',
  view: {
    latitude: 24.5,
    longitude: 82,
    zoom: 5,
    minZoom: 3,
    maxZoom: 18,
  },
  gis: {
    name: 'Local GIS',
    base: {
      id: 'base-map',
      name: 'Countries',
      type: 'wms',
      url: 'http://127.0.0.1:8080/geoserver/wms',
      layers: 'ne:countries',
      format: 'image/png',
      transparent: false,
      version: '1.1.1',
      attribution: 'Local GIS server',
    },
    overlays: [
      {
        id: 'places',
        name: 'Places',
        type: 'wms',
        url: 'http://127.0.0.1:8080/geoserver/wms',
        layers: 'ne:populated_places',
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        visible: true,
        attribution: 'Local GIS server',
      },
    ],
  },
  sides: {
    blue: '#2f6fed',
    control: '#d4b15a',
    neutral: '#c2b280',
  },
}

export const PLAYING_NOTE =
  'Playing order of battle for Game Alpha, taken from the Blue standard order of battle.'
