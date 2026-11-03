const type = {
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  borderRadius: 8,
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

function appearance(row) {
  return {
    ...type,
    ...row,
    secondary: row.primary,
    secondaryContrast: row.primaryContrast,
  }
}

function assertContrast(row) {
  const pairs = [
    ['body on panel', row.textPrimary, row.backgroundPaper, 4.5],
    ['caption on panel', row.textSecondary, row.backgroundPaper, 4.5],
    ['body on page', row.textPrimary, row.backgroundDefault, 4.5],
    ['action text', row.primaryContrast, row.primary, 4.5],
    ['error on panel', row.error, row.backgroundPaper, 4.5],
    ['error on page', row.error, row.backgroundDefault, 4.5],
    ['error text', row.errorContrast, row.error, 4.5],
    ['warning on panel', row.warning, row.backgroundPaper, 4.5],
    ['warning on page', row.warning, row.backgroundDefault, 4.5],
    ['warning text', row.warningContrast, row.warning, 4.5],
    ['success on panel', row.success, row.backgroundPaper, 4.5],
    ['success on page', row.success, row.backgroundDefault, 4.5],
    ['success text', row.successContrast, row.success, 4.5],
    ['info on panel', row.info, row.backgroundPaper, 4.5],
    ['info on page', row.info, row.backgroundDefault, 4.5],
    ['info text', row.infoContrast, row.info, 4.5],
    ['quiet text on panel', row.textDisabled, row.backgroundPaper, 3.2],
    ['quiet text on page', row.textDisabled, row.backgroundDefault, 3.2],
  ]
  for (const [label, ink, ground, floor] of pairs) {
    if (contrast(ink, ground) < floor) throw new Error(`${row.id} fails contrast for ${label}`)
  }
}

export const palettes = [
  appearance({ id: 'field-night', name: 'Pine, night', family: 'Pine', mode: 'dark', primary: '#3ddea0', primaryContrast: '#05281c', backgroundDefault: '#0c3d2e', backgroundPaper: '#145c45', textPrimary: '#e7fff4', textSecondary: '#b7e6d0', textDisabled: '#89bda5', divider: 'rgba(231, 255, 244, 0.28)', error: '#e3c4bf', errorContrast: '#4a2b26', warning: '#ddc7a7', warningContrast: '#433623', success: '#caecd3', successContrast: '#264a30', info: '#b8c9e0', infoContrast: '#26364a' }),
  appearance({ id: 'field-day', name: 'Pine, day', family: 'Pine', mode: 'light', primary: '#0d6b3c', primaryContrast: '#f3fff8', backgroundDefault: '#d8f5e4', backgroundPaper: '#9ed9b4', textPrimary: '#06281a', textSecondary: '#1a4d34', textDisabled: '#3b6852', divider: 'rgba(6, 40, 26, 0.22)', error: '#6b362e', errorContrast: '#eee8e7', warning: '#584322', warningContrast: '#eeebe7', success: '#224f46', successContrast: '#e7eeed', info: '#2b486e', infoContrast: '#e7eaee' }),
  appearance({ id: 'watch-night', name: 'Cobalt, night', family: 'Cobalt', mode: 'dark', primary: '#6aa6ff', primaryContrast: '#061428', backgroundDefault: '#0c2a5c', backgroundPaper: '#143d82', textPrimary: '#e8f1ff', textSecondary: '#b9cff5', textDisabled: '#899cbd', divider: 'rgba(232, 241, 255, 0.28)', error: '#ddb6b0', errorContrast: '#4a2b26', warning: '#dac7a9', warningContrast: '#433623', success: '#a9dac3', successContrast: '#234334', info: '#a9ccda', infoContrast: '#233a43' }),
  appearance({ id: 'watch-day', name: 'Cobalt, day', family: 'Cobalt', mode: 'light', primary: '#0d3f91', primaryContrast: '#f4f8ff', backgroundDefault: '#d5e4ff', backgroundPaper: '#a9c4f5', textPrimary: '#061433', textSecondary: '#1a3a73', textDisabled: '#495e83', divider: 'rgba(6, 20, 51, 0.22)', error: '#64322b', errorContrast: '#eee8e7', warning: '#513d1f', warningContrast: '#eeebe7', success: '#1d4934', successContrast: '#e7eeeb', info: '#17303b', infoContrast: '#e7ecee' }),
  appearance({ id: 'sand-night', name: 'Amber, night', family: 'Amber', mode: 'dark', primary: '#f0b429', primaryContrast: '#2a1c04', backgroundDefault: '#4a3208', backgroundPaper: '#6b4a0e', textPrimary: '#fff6e0', textSecondary: '#f0d7a0', textDisabled: '#c1b190', divider: 'rgba(255, 246, 224, 0.28)', error: '#ead1cd', errorContrast: '#4a2b26', warning: '#eddcd4', warningContrast: '#4a3226', success: '#a7ddc4', successContrast: '#234334', info: '#b8c9e0', infoContrast: '#26364a' }),
  appearance({ id: 'sand-day', name: 'Amber, day', family: 'Amber', mode: 'light', primary: '#8a5a00', primaryContrast: '#fff8e8', backgroundDefault: '#ffe8b8', backgroundPaper: '#f5c96a', textPrimary: '#2a1c04', textSecondary: '#5c4010', textDisabled: '#766342', divider: 'rgba(42, 28, 4, 0.22)', error: '#6b362e', errorContrast: '#eee8e7', warning: '#6b422e', warningContrast: '#eee9e7', success: '#1f513a', successContrast: '#e7eeeb', info: '#2e486b', infoContrast: '#e7eaee' }),
  appearance({ id: 'slate-night', name: 'Graphite, night', family: 'Graphite', mode: 'dark', primary: '#d5dbe3', primaryContrast: '#1a1e24', backgroundDefault: '#2a2e33', backgroundPaper: '#3d4450', textPrimary: '#f4f6f8', textSecondary: '#c5ccd6', textDisabled: '#93a0b3', divider: 'rgba(244, 246, 248, 0.28)', error: '#e0bdb8', errorContrast: '#4a2b26', warning: '#dac7a9', warningContrast: '#433623', success: '#a9dac3', successContrast: '#234334', info: '#a9bfda', infoContrast: '#233143' }),
  appearance({ id: 'slate-day', name: 'Graphite, day', family: 'Graphite', mode: 'light', primary: '#2c3444', primaryContrast: '#f7f8fa', backgroundDefault: '#e4e7ec', backgroundPaper: '#c5cad3', textPrimary: '#121418', textSecondary: '#3a4150', textDisabled: '#566076', divider: 'rgba(18, 20, 24, 0.22)', error: '#6b362e', errorContrast: '#eee8e7', warning: '#564225', warningContrast: '#eeebe7', success: '#224f3a', successContrast: '#e7eeeb', info: '#284d5d', infoContrast: '#e7ecee' }),
  appearance({ id: 'sea-night', name: 'Lagoon, night', family: 'Lagoon', mode: 'dark', primary: '#2ad4e0', primaryContrast: '#042428', backgroundDefault: '#043e45', backgroundPaper: '#0a6270', textPrimary: '#e5fbff', textSecondary: '#a9e4ee', textDisabled: '#a4c6cc', divider: 'rgba(229, 251, 255, 0.28)', error: '#ead1cd', errorContrast: '#4a2b26', warning: '#e2d0b6', warningContrast: '#4a3c26', success: '#a7ddc4', successContrast: '#234334', info: '#c6d4e7', infoContrast: '#26364a' }),
  appearance({ id: 'sea-day', name: 'Lagoon, day', family: 'Lagoon', mode: 'light', primary: '#0a6e78', primaryContrast: '#f2feff', backgroundDefault: '#c6f3f6', backgroundPaper: '#7fdde6', textPrimary: '#04282c', textSecondary: '#0d4e56', textDisabled: '#3e6a6f', divider: 'rgba(4, 40, 44, 0.22)', error: '#6b362e', errorContrast: '#eee8e7', warning: '#5d4828', warningContrast: '#eeebe7', success: '#1f513a', successContrast: '#e7eeeb', info: '#2e486b', infoContrast: '#e7eaee' }),
  appearance({ id: 'air-night', name: 'Iris, night', family: 'Iris', mode: 'dark', primary: '#b794f6', primaryContrast: '#1a0e33', backgroundDefault: '#2e1858', backgroundPaper: '#45247f', textPrimary: '#f3ecff', textSecondary: '#d0c0f0', textDisabled: '#9b89bd', divider: 'rgba(243, 236, 255, 0.28)', error: '#ddaea7', errorContrast: '#432723', warning: '#d4bd9b', warningContrast: '#3d311f', success: '#a9dac3', successContrast: '#234334', info: '#a7bedd', infoContrast: '#233143' }),
  appearance({ id: 'air-day', name: 'Iris, day', family: 'Iris', mode: 'light', primary: '#5b2d91', primaryContrast: '#f8f4ff', backgroundDefault: '#e4d6ff', backgroundPaper: '#c4a6f5', textPrimary: '#1c0d33', textSecondary: '#4a2880', textDisabled: '#5b467c', divider: 'rgba(28, 13, 51, 0.22)', error: '#582922', errorContrast: '#eee8e7', warning: '#47371f', warningContrast: '#eeebe7', success: '#1c402f', successContrast: '#e7eeeb', info: '#223a58', infoContrast: '#e7eaee' }),
  appearance({ id: 'dusk-night', name: 'Copper, night', family: 'Copper', mode: 'dark', primary: '#f08a3c', primaryContrast: '#2a1206', backgroundDefault: '#4a220c', backgroundPaper: '#6e3414', textPrimary: '#fff1e8', textSecondary: '#f0c4a8', textDisabled: '#bd9d89', divider: 'rgba(255, 241, 232, 0.28)', error: '#e3bfc0', errorContrast: '#4a2627', warning: '#dad4a9', warningContrast: '#433f23', success: '#a9dac3', successContrast: '#234334', info: '#b8c9e0', infoContrast: '#26364a' }),
  appearance({ id: 'dusk-day', name: 'Copper, day', family: 'Copper', mode: 'light', primary: '#b84a12', primaryContrast: '#fff6f0', backgroundDefault: '#ffd7c2', backgroundPaper: '#f5a97a', textPrimary: '#2a1208', textSecondary: '#6b3214', textDisabled: '#6f4f3e', divider: 'rgba(42, 18, 8, 0.22)', error: '#672830', errorContrast: '#eee7e8', warning: '#423a1a', warningContrast: '#eeede7', success: '#1a422f', successContrast: '#e7eeeb', info: '#253e5f', infoContrast: '#e7eaee' }),
  appearance({ id: 'olive-night', name: 'Moss, night', family: 'Moss', mode: 'dark', primary: '#b6e04a', primaryContrast: '#1a2406', backgroundDefault: '#2e3d0c', backgroundPaper: '#4a6214', textPrimary: '#f4ffe4', textSecondary: '#d2e8a0', textDisabled: '#b6c497', divider: 'rgba(244, 255, 228, 0.28)', error: '#ead1cd', errorContrast: '#4a2b26', warning: '#e5d5bd', warningContrast: '#4a3c26', success: '#aee0c9', successContrast: '#264a39', info: '#cdd9ea', infoContrast: '#26364a' }),
  appearance({ id: 'olive-day', name: 'Moss, day', family: 'Moss', mode: 'light', primary: '#4f6b0e', primaryContrast: '#f7ffe8', backgroundDefault: '#e4f5b8', backgroundPaper: '#c6e06a', textPrimary: '#1c2608', textSecondary: '#3d5210', textDisabled: '#606f3e', divider: 'rgba(28, 38, 8, 0.22)', error: '#723a31', errorContrast: '#eee8e7', warning: '#5f4825', warningContrast: '#eeebe7', success: '#25563f', successContrast: '#e7eeeb', info: '#2e4d76', infoContrast: '#e7eaee' }),
  appearance({ id: 'crimson-night', name: 'Crimson, night', family: 'Crimson', mode: 'dark', primary: '#f06078', primaryContrast: '#2a060c', backgroundDefault: '#4a1018', backgroundPaper: '#721828', textPrimary: '#ffe8ec', textSecondary: '#f0b0bc', textDisabled: '#bd8993', divider: 'rgba(255, 232, 236, 0.28)', error: '#ddb7a7', errorContrast: '#432c23', warning: '#d4bd9b', warningContrast: '#3d311f', success: '#a9dac3', successContrast: '#234334', info: '#a7bedd', infoContrast: '#233143' }),
  appearance({ id: 'crimson-day', name: 'Crimson, day', family: 'Crimson', mode: 'light', primary: '#a11428', primaryContrast: '#fff5f6', backgroundDefault: '#ffd0d8', backgroundPaper: '#f5a0b0', textPrimary: '#2a0810', textSecondary: '#6e2030', textDisabled: '#7c4651', divider: 'rgba(42, 8, 16, 0.22)', error: '#583422', errorContrast: '#eee9e7', warning: '#47371f', warningContrast: '#eeebe7', success: '#1c402f', successContrast: '#e7eeeb', info: '#253a56', infoContrast: '#e7eaee' }),
  appearance({ id: 'contrast-night', name: 'High contrast, night', family: 'High contrast', mode: 'dark', primary: '#ffe14a', primaryContrast: '#000000', backgroundDefault: '#000000', backgroundPaper: '#141414', textPrimary: '#ffffff', textSecondary: '#e0e0e0', textDisabled: '#9a9a9a', divider: 'rgba(255, 255, 255, 0.55)', error: '#ff6b6b', errorContrast: '#2a0000', warning: '#ffe14a', warningContrast: '#000000', success: '#5dff7a', successContrast: '#00210a', info: '#7ecbff', infoContrast: '#001018' }),
  appearance({ id: 'contrast-day', name: 'High contrast, day', family: 'High contrast', mode: 'light', primary: '#111111', primaryContrast: '#ffffff', backgroundDefault: '#f2f2f2', backgroundPaper: '#ffffff', textPrimary: '#000000', textSecondary: '#1a1a1a', textDisabled: '#5c5c5c', divider: 'rgba(0, 0, 0, 0.45)', error: '#9b0000', errorContrast: '#ffffff', warning: '#6b4e00', warningContrast: '#ffffff', success: '#005c00', successContrast: '#ffffff', info: '#0033a0', infoContrast: '#ffffff' }),
]

palettes.forEach(assertContrast)

export function paletteById(id) {
  return palettes.find((item) => item.id === id) || null
}

export const loginPalette = paletteById('field-night')