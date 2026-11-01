import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import Shell from '../shell/Shell'
import { SessionGate } from './SessionGate'
import { ThemeBridge } from './ThemeBridge'
import { queryClient } from './queryClient'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeBridge>
          <SessionGate>
            <Shell />
          </SessionGate>
        </ThemeBridge>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
