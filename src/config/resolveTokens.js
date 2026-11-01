export function readPath(source, path) {
  return path.split('.').reduce((current, key) => {
    if (current == null) return undefined
    return current[key]
  }, source)
}

export function resolveTokens(template, config) {
  if (typeof template !== 'string') return ''
  return template.replace(/\{([a-zA-Z0-9_.]+)\}/g, (_, path) => {
    const value = readPath(config, path)
    return value == null ? '' : String(value)
  })
}
