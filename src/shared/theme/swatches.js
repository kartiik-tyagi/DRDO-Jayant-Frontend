export const swatches = [
  { id: 'blue', name: 'Blue', color: '#2f6fed' },
  { id: 'red', name: 'Red', color: '#d45b4a' },
  { id: 'green', name: 'Green', color: '#3caf72' },
  { id: 'amber', name: 'Amber', color: '#d4b15a' },
  { id: 'orange', name: 'Orange', color: '#e07a3d' },
  { id: 'violet', name: 'Violet', color: '#8b6cc9' },
  { id: 'teal', name: 'Teal', color: '#2aa8a0' },
  { id: 'magenta', name: 'Magenta', color: '#c44b8a' },
  { id: 'olive', name: 'Olive', color: '#6b7a3a' },
  { id: 'sky', name: 'Sky', color: '#5aa6d6' },
  { id: 'sand', name: 'Sand', color: '#c4a574' },
  { id: 'slate', name: 'Slate', color: '#6d7c8a' },
]

export const marks = {
  halo: '#f7fbf8',
  outline: '#102018',
  objective: '#d4b15a',
  replay: '#e0b450',
}

export function swatchById(id) {
  return swatches.find((item) => item.id === id) || null
}
