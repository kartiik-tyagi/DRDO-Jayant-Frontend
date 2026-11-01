import { useEffect, useRef } from 'react'
import { useDirectoryStore } from '../features/directory/useDirectoryStore'
import { useSignedUserId } from '../features/directory/useNavigation'
import { useToastStore } from '../features/feedback/useToastStore'
import { useSessionStore } from '../features/session/useSessionStore'
import { EMPTY_LIST } from '../shared/lib/empty'
import { playTone } from '../shared/lib/tone'

export function DirectoryGate({ children }) {
  const ready = useSessionStore((state) => state.ready)
  const userId = useSignedUserId()
  const load = useDirectoryStore((state) => state.load)
  const reset = useDirectoryStore((state) => state.reset)
  const alerts = useDirectoryStore((state) => state.data?.alerts ?? EMPTY_LIST)
  const muted = useDirectoryStore((state) => state.data?.alertMuted)
  const sound = useDirectoryStore((state) => state.data?.alertSound)
  const seen = useRef(new Set())

  useEffect(() => {
    if (!ready || !userId) {
      reset()
      return undefined
    }
    load(userId).catch((error) => useToastStore.getState().push(error?.message || 'The directory could not be opened.', 'error'))
    return () => reset()
  }, [ready, userId, load, reset])

  useEffect(() => {
    const ids = alerts.map((alert) => alert.id)
    const fresh = ids.filter((id) => !seen.current.has(id))
    seen.current = new Set(ids)
    if (fresh.length && sound && !muted) playTone()
  }, [alerts, muted, sound])

  return children
}
