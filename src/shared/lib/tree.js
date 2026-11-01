export function findNode(node, id) {
  if (!node || id == null) return null
  if (node.id === id) return node
  for (const child of node.children || []) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

export function flatten(node, list = []) {
  if (!node) return list
  list.push(node)
  for (const child of node.children || []) flatten(child, list)
  return list
}
