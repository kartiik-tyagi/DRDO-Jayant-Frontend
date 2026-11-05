import { QueryClient } from '@tanstack/react-query'

// Memory only. Exercise data must not be written to local storage.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 5 * 60 * 1000,
    },
  },
})
