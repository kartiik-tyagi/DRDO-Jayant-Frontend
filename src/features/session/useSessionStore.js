import { create } from 'zustand'
import dayjs from 'dayjs'
import { resumeSession } from '../../shared/api/client'
import { logger } from '../../shared/lib/logger'
import { clearSessionKey, readSessionKey, writeSessionKey } from '../../shared/lib/sessionKey'

const FALLBACK = '2026-10-28T06:00:00'

let restoring = null

function signedInState(session) {
  return {
    session,
    ready: true,
    notice: null,
    status: 'ready',
    epochMs: dayjs(session.clockStart || FALLBACK).valueOf(),
    resetToken: 0,
    phaseId: null,
  }
}

export const useSessionStore = create((set, get) => ({
  session: null,
  ready: false,
  notice: null,
  status: 'ready',
  epochMs: dayjs(FALLBACK).valueOf(),
  resetToken: 0,
  phaseId: null,
  restore: () => {
    if (get().ready) return Promise.resolve()
    if (restoring) return restoring
    restoring = (async () => {
      const saved = readSessionKey()
      if (!saved.userId) {
        set({
          ready: true,
          session: null,
          notice: saved.invalid ? 'The saved session is not valid.' : null,
        })
        return
      }
      try {
        const session = await resumeSession(saved.userId)
        set(signedInState(session))
        logger.info('session.restored', { userId: saved.userId })
      } catch (error) {
        clearSessionKey()
        set({
          ready: true,
          session: null,
          notice: error?.message || 'The session could not be restored.',
        })
      }
    })().finally(() => {
      restoring = null
    })
    return restoring
  },
  signIn: (session) => {
    const persisted = writeSessionKey(session.profile.id)
    set(signedInState(session))
    logger.info('auth.signed_in', { userId: session.profile.id, persisted })
  },
  signOut: () => {
    const userId = get().session?.profile?.id || null
    clearSessionKey()
    logger.info('auth.signed_out', { userId })
    set({
      session: null,
      ready: true,
      notice: null,
      status: 'ready',
      epochMs: dayjs(FALLBACK).valueOf(),
      resetToken: 0,
      phaseId: null,
    })
  },
  clearNotice: () => set({ notice: null }),
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
