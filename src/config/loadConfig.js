const FILES = ['app', 'theme', 'layout', 'navigation', 'scenario', 'forces', 'map']

export async function loadConfig() {
  const entries = await Promise.all(
    FILES.map(async (name) => {
      const response = await fetch(`/config/${name}.json`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Could not load /config/${name}.json (${response.status})`)
      }
      return [name, await response.json()]
    }),
  )
  return Object.fromEntries(entries)
}
