import { EmptyState } from '../../shared/ui/EmptyState'
import { Panel } from '../../shared/ui/Panel'

export default function PlansView() {
  return (
    <Panel
      title="Plans"
      subtitle="Intentions for this appointment will be written here. This review shows the place, not the workflow."
    >
      <EmptyState title="No intentions yet" message="The planning surface stays empty until a layout is chosen." />
    </Panel>
  )
}
