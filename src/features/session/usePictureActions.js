import { useSessionStore } from './useSessionStore'

export function usePictureActions({ onFilters, onThemes, onControl } = {}) {
  const requestExtent = useSessionStore((state) => state.requestExtent)
  return (id) => {
    if (id === 'extent') requestExtent()
    if (id === 'filters') onFilters?.()
    if (id === 'themes') onThemes?.()
    if (id === 'exercise-control') onControl?.()
  }
}
