import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { DraftDialog } from '../shared/ui/DraftDialog'
import { EntityDialog } from '../shared/ui/EntityDialog'
import { ToastHost } from '../shared/ui/ToastHost'
import Shell from '../shell/Shell'
import { DirectoryGate } from './DirectoryGate'
import { SessionGate } from './SessionGate'
import { ThemeBridge } from './ThemeBridge'
import { queryClient } from './queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeBridge>
          <SessionGate>
            <DirectoryGate>
              <Shell />
              <ToastHost />
              <EntityDialog />
              <DraftDialog />
            </DirectoryGate>
          </SessionGate>
        </ThemeBridge>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
