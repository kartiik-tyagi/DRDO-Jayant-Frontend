import { useState } from 'react'
import { EMPTY_LIST } from '../../shared/lib/empty'
import { useSessionStore } from './useSessionStore'

export function useSections() {
  const sections = useSessionStore((state) => state.session?.sections ?? EMPTY_LIST)
  const [sectionId, setSectionId] = useState(null)
  const selected = sections.some((section) => section.id === sectionId) ? sectionId : null
  return { sections, sectionId: selected, select: setSectionId }
}
