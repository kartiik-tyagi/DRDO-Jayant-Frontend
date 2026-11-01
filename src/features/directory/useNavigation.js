import { useSessionStore } from '../../features/session/useSessionStore'
import { EMPTY_LIST } from '../../shared/lib/empty'
import { useDirectoryStore } from '../../features/directory/useDirectoryStore'

export function useNavigation() {
  const sessionNavigation = useSessionStore((state) => state.session?.navigation ?? EMPTY_LIST)
  const directoryNavigation = useDirectoryStore((state) => state.data?.navigation)
  return directoryNavigation?.length ? directoryNavigation : sessionNavigation
}

export function useSignedUserId() {
  return useSessionStore((state) => state.session?.profile?.id || null)
}
