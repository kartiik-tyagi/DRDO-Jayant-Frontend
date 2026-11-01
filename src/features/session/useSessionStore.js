import { create } from 'zustand'
import dayjs from 'dayjs'

const FALLBACK = '2026-10-28T06:00:00'

export const useSessionStore = create((set, get) => ({
  session: null,
  status: 'ready',
  epochMs: dayjs(FALLBACK).valueOf(),
  resetToken: 0,
  phaseId: null,
  signIn: (session) =>
    set({
      session,
      status: 'ready',
      epochMs: dayjs(session.clockStart || FALLBACK).valueOf(),
      resetToken: 0,
      phaseId: null,
    }),
  signOut: () =>
    set({
      session: null,
      status: 'ready',
      epochMs: dayjs(FALLBACK).valueOf(),
      resetToken: 0,
      phaseId: null,
    }),
  setScenario: (id) =>
    set((state) => {
      if (!state.session?.canSelectScenario) return state
      if (!state.session.scenarios.some((item) => item.id === id)) return state
      return { session: { ...state.session, selectedScenarioId: id } }
    }),
  setTheme: (themeId) =>
    set((state) => {
      const theme = state.session?.themes.find((item) => item.id === themeId)
      if (!theme) return state
      return { session: { ...state.session, theme } }
    }),
  setFilter: (id, visible) =>
    set((state) => {
      if (!state.session?.filters.some((filter) => filter.id === id)) return state
      return {
        phaseId: null,
        session: {
          ...state.session,
          filters: state.session.filters.map((filter) => (filter.id === id ? { ...filter, visible } : filter)),
        },
      }
    }),
  applyPhase: (phaseId) =>
    set((state) => {
      const phase = state.session?.phases.find((item) => item.id === phaseId)
      if (!phase) return state
      const show = new Set(phase.filterIds)
      return {
        phaseId,
        session: {
          ...state.session,
          filters: state.session.filters.map((filter) => ({ ...filter, visible: show.has(filter.id) })),
        },
      }
    }),
  requestExtent: () => set((state) => ({ resetToken: state.resetToken + 1 })),
  start: () => {
    const { status, session } = get()
    if (!session?.canControlGame) return
    if (status === 'running' || status === 'paused') return
    set({ status: 'running' })
  },
  pause: () => {
    const { status, session } = get()
    if (!session?.canControlGame || status !== 'running') return
    set({ status: 'paused' })
  },
  resume: () => {
    const { status, session } = get()
    if (!session?.canControlGame || status !== 'paused') return
    set({ status: 'running' })
  },
  restart: () => {
    if (!get().session?.canControlGame) return
    set({ status: 'ready', epochMs: dayjs(get().session.clockStart || FALLBACK).valueOf() })
  },
  end: () => {
    const { status, session } = get()
    if (!session?.canControlGame) return
    if (status === 'ready' || status === 'ended') return
    set({ status: 'ended' })
  },
  tick: () => {
    const { status, epochMs } = get()
    if (status !== 'running') return
    set({ epochMs: epochMs + 60 * 1000 })
  },
}))
