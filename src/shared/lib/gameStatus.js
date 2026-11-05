export const STATUS_LABEL = {
  ready: 'Ready',
  running: 'Running',
  paused: 'Paused',
  ended: 'Ended',
}

export function statusLabel(status) {
  return STATUS_LABEL[status] || 'Ready'
}
