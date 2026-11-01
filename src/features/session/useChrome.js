import { useState } from 'react'
import { useSessionStore } from './useSessionStore'

export function useChrome() {
  const requestExtent = useSessionStore((state) => state.requestExtent)
  const [expanded, setExpanded] = useState(false)
  const [panel, setPanel] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const select = (id) => {
    if (id === 'extent') {
      requestExtent()
      return
    }
    setPanel((current) => (current === id ? null : id))
  }

  return {
    expanded,
    setExpanded,
    panel,
    closePanel: () => setPanel(null),
    menuOpen,
    setMenuOpen,
    select,
  }
}
