import { CommandTree } from '../../shared/ui/CommandTree'
import { Panel } from '../../shared/ui/Panel'
import { useSessionStore } from '../session/useSessionStore'

export default function CommandView() {
  const session = useSessionStore((state) => state.session)
  const selectedId = useSessionStore((state) => state.selectedId)
  const select = useSessionStore((state) => state.select)

  return (
    <Panel title="Playing command" subtitle={session?.playingNote}>
      <CommandTree root={session?.commandTree} selectedId={selectedId} onSelect={select} />
    </Panel>
  )
}
