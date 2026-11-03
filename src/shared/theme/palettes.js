const type = {
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  borderRadius: 8,
}

const dayStatus = {
  error: '#b42318',
  errorContrast: '#fffdf8',
  warning: '#8a5a00',
  warningContrast: '#fffdf8',
  success: '#14663a',
  successContrast: '#f7fbf8',
  info: '#1e4f86',
  infoContrast: '#f7f9fc',
}

const nightStatus = {
  error: '#f0a39a',
  errorContrast: '#2a1210',
  warning: '#e0c27a',
  warningContrast: '#1c160c',
  success: '#3caf72',
  successContrast: '#062116',
  info: '#8eb7e0',
  infoContrast: '#0c1218',
}

const contrastDayStatus = {
  error: '#9b0000',
  errorContrast: '#ffffff',
  warning: '#6b4e00',
  warningContrast: '#ffffff',
  success: '#005c00',
  successContrast: '#ffffff',
  info: '#0033a0',
  infoContrast: '#ffffff',
}

const contrastNightStatus = {
  error: '#ff6b6b',
  errorContrast: '#2a0000',
  warning: '#ffe14a',
  warningContrast: '#000000',
  success: '#5dff7a',
  successContrast: '#00210a',
  info: '#7ecbff',
  infoContrast: '#001018',
}

function channel(hex, shift) {
  const value = (parseInt(hex.slice(1), 16) >> shift) & 255
  const amount = value / 255
  return amount <= 0.04045 ? amount / 12.92 : ((amount + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  return 0.2126 * channel(hex, 16) + 0.7152 * channel(hex, 8) + 0.0722 * channel(hex, 0)
}

function contrast(ink, ground) {
  const left = luminance(ink)
  const right = luminance(ground)
  const hi = Math.max(left, right)
  const lo = Math.min(left, right)
  return (hi + 0.05) / (lo + 0.05)
}

function appearance(row, status) {
  return {
    ...type,
    ...status,
    ...row,
    secondary: row.primary,
    secondaryContrast: row.primaryContrast,
  }
}

function assertContrast(row) {
  const pairs = [
    ['body on panel', row.textPrimary, row.backgroundPaper],
    ['caption on panel', row.textSecondary, row.backgroundPaper],
    ['body on page', row.textPrimary, row.backgroundDefault],
    ['action text', row.primaryContrast, row.primary],
  ]
  for (const [label, ink, ground] of pairs) {
    if (contrast(ink, ground) < 4.5) throw new Error(`${row.id} fails contrast for ${label}`)
  }
}

export const palettes = [
  appearance({ id: 'field-night', name: 'Field, night', family: 'Field', mode: 'dark', primary: '#3caf72', primaryContrast: '#062116', backgroundDefault: '#0d1411', backgroundPaper: '#16211c', textPrimary: '#e8f0ea', textSecondary: '#b7c6bd', divider: 'rgba(232, 240, 234, 0.16)' }, nightStatus),
  appearance({ id: 'field-day', name: 'Field, day', family: 'Field', mode: 'light', primary: '#14663a', primaryContrast: '#f7fbf8', backgroundDefault: '#e7f2ea', backgroundPaper: '#f7fbf8', textPrimary: '#102018', textSecondary: '#3d5246', divider: 'rgba(16, 32, 24, 0.14)' }, dayStatus),
  appearance({ id: 'watch-night', name: 'Watch, night', family: 'Watch', mode: 'dark', primary: '#8eb7e0', primaryContrast: '#0c1218', backgroundDefault: '#0c1218', backgroundPaper: '#152033', textPrimary: '#e7eef6', textSecondary: '#b7c6d6', divider: 'rgba(231, 238, 246, 0.16)' }, nightStatus),
  appearance({ id: 'watch-day', name: 'Watch, day', family: 'Watch', mode: 'light', primary: '#1e4f86', primaryContrast: '#f7f9fc', backgroundDefault: '#e8eef6', backgroundPaper: '#f7f9fc', textPrimary: '#0c1218', textSecondary: '#3d4d63', divider: 'rgba(12, 18, 24, 0.14)' }, dayStatus),
  appearance({ id: 'sand-night', name: 'Sand, night', family: 'Sand', mode: 'dark', primary: '#e0c27a', primaryContrast: '#1c160c', backgroundDefault: '#16130e', backgroundPaper: '#241f17', textPrimary: '#f6f1e6', textSecondary: '#cbbfa8', divider: 'rgba(246, 241, 230, 0.16)' }, nightStatus),
  appearance({ id: 'sand-day', name: 'Sand, day', family: 'Sand', mode: 'light', primary: '#5a4616', primaryContrast: '#fffdf8', backgroundDefault: '#f4f0e6', backgroundPaper: '#fffdf8', textPrimary: '#1c1914', textSecondary: '#5c564c', divider: 'rgba(28, 25, 20, 0.14)' }, dayStatus),
  appearance({ id: 'slate-night', name: 'Slate, night', family: 'Slate', mode: 'dark', primary: '#8eb4d4', primaryContrast: '#101418', backgroundDefault: '#101418', backgroundPaper: '#1b222a', textPrimary: '#e8eef3', textSecondary: '#b4c0cc', divider: 'rgba(232, 238, 243, 0.16)' }, nightStatus),
  appearance({ id: 'slate-day', name: 'Slate, day', family: 'Slate', mode: 'light', primary: '#1f4b6e', primaryContrast: '#f8f9fb', backgroundDefault: '#eef1f4', backgroundPaper: '#f8f9fb', textPrimary: '#12161b', textSecondary: '#4a5562', divider: 'rgba(18, 22, 27, 0.14)' }, dayStatus),
  appearance({ id: 'sea-night', name: 'Sea, night', family: 'Sea', mode: 'dark', primary: '#3dbebf', primaryContrast: '#071416', backgroundDefault: '#071416', backgroundPaper: '#102226', textPrimary: '#e7f6f6', textSecondary: '#b7d0d0', divider: 'rgba(231, 246, 246, 0.16)' }, nightStatus),
  appearance({ id: 'sea-day', name: 'Sea, day', family: 'Sea', mode: 'light', primary: '#0f5c5c', primaryContrast: '#f4fbfb', backgroundDefault: '#e5f4f4', backgroundPaper: '#f4fbfb', textPrimary: '#06201f', textSecondary: '#3a5554', divider: 'rgba(6, 32, 31, 0.14)' }, dayStatus),
  appearance({ id: 'air-night', name: 'Air, night', family: 'Air', mode: 'dark', primary: '#79b8ff', primaryContrast: '#10141c', backgroundDefault: '#10141c', backgroundPaper: '#1a2230', textPrimary: '#e8f1fb', textSecondary: '#b7c6d8', divider: 'rgba(232, 241, 251, 0.16)' }, nightStatus),
  appearance({ id: 'air-day', name: 'Air, day', family: 'Air', mode: 'light', primary: '#0d4f8b', primaryContrast: '#f5f9fd', backgroundDefault: '#e8f1fb', backgroundPaper: '#f5f9fd', textPrimary: '#0c1218', textSecondary: '#3d4d63', divider: 'rgba(12, 18, 24, 0.14)' }, dayStatus),
  appearance({ id: 'dusk-night', name: 'Dusk, night', family: 'Dusk', mode: 'dark', primary: '#e0a060', primaryContrast: '#1c120c', backgroundDefault: '#140e12', backgroundPaper: '#241820', textPrimary: '#f6eee8', textSecondary: '#d4c4b4', divider: 'rgba(246, 238, 232, 0.16)' }, nightStatus),
  appearance({ id: 'dusk-day', name: 'Dusk, day', family: 'Dusk', mode: 'light', primary: '#8c3a32', primaryContrast: '#fff8f6', backgroundDefault: '#f6ebe8', backgroundPaper: '#fff8f6', textPrimary: '#1c1210', textSecondary: '#5c463f', divider: 'rgba(28, 18, 16, 0.14)' }, dayStatus),
  appearance({ id: 'olive-night', name: 'Olive, night', family: 'Olive', mode: 'dark', primary: '#a3b56a', primaryContrast: '#12140e', backgroundDefault: '#12140e', backgroundPaper: '#1c2116', textPrimary: '#eef1e4', textSecondary: '#c5ccb4', divider: 'rgba(238, 241, 228, 0.16)' }, nightStatus),
  appearance({ id: 'olive-day', name: 'Olive, day', family: 'Olive', mode: 'light', primary: '#3f4d22', primaryContrast: '#f8faf3', backgroundDefault: '#eef1e4', backgroundPaper: '#f8faf3', textPrimary: '#14180e', textSecondary: '#454a38', divider: 'rgba(20, 24, 14, 0.14)' }, dayStatus),
  appearance({ id: 'crimson-night', name: 'Crimson, night', family: 'Crimson', mode: 'dark', primary: '#e07a7a', primaryContrast: '#140c0c', backgroundDefault: '#140c0c', backgroundPaper: '#241416', textPrimary: '#f8ecec', textSecondary: '#d4b8b8', divider: 'rgba(248, 236, 236, 0.16)' }, nightStatus),
  appearance({ id: 'crimson-day', name: 'Crimson, day', family: 'Crimson', mode: 'light', primary: '#8e1e24', primaryContrast: '#fff7f7', backgroundDefault: '#f8ecec', backgroundPaper: '#fff7f7', textPrimary: '#1c1010', textSecondary: '#5c3d3d', divider: 'rgba(28, 16, 16, 0.14)' }, dayStatus),
  appearance({ id: 'contrast-night', name: 'High contrast, night', family: 'High contrast', mode: 'dark', primary: '#ffe14a', primaryContrast: '#000000', backgroundDefault: '#000000', backgroundPaper: '#0a0a0a', textPrimary: '#ffffff', textSecondary: '#e6e6e6', divider: 'rgba(255, 255, 255, 0.55)' }, contrastNightStatus),
  appearance({ id: 'contrast-day', name: 'High contrast, day', family: 'High contrast', mode: 'light', primary: '#0033a0', primaryContrast: '#ffffff', backgroundDefault: '#f2f2f2', backgroundPaper: '#ffffff', textPrimary: '#000000', textSecondary: '#1a1a1a', divider: 'rgba(0, 0, 0, 0.45)' }, contrastDayStatus),
]

palettes.forEach(assertContrast)

export function paletteById(id) {
  return palettes.find((item) => item.id === id) || null
}

export const loginPalette = paletteById('field-night')
