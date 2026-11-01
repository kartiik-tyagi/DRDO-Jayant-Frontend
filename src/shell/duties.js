export function dutiesFor(position) {
  const items = [
    { id: 'situation', label: 'Situation', path: '/situation' },
    { id: 'command', label: 'Command', path: '/command' },
    { id: 'plans', label: 'Plans', path: '/plans' },
  ]
  if (position?.id === 'apex') {
    items.push({ id: 'control', label: 'Control', path: '/control' })
  }
  return items
}
