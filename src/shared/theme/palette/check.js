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

export function assertContrast(row) {
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
