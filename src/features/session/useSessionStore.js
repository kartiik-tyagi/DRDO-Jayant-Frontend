import { create } from 'zustand'
import dayjs from 'dayjs'
import { findNode } from '../../shared/lib/tree'

const START = '2026-10-28T06:00:00'
const startEpochMs = dayjs(START).valueOf()

function initialSelection(session) {
  if (!session) return null
  return findNode(session.commandTree, session.position.id)?.id || session.commandTree?.id || null
}

export const useSessionStore = create((set, get) => ({
  session: null,
  selectedId: null,
  status: 'ready',
  epochMs: startEpochMs,
  signIn: (session) =>
    set({
      session,
      selectedId: initialSelection(session),
      status: 'ready',
      epochMs: startEpochMs,
    }),
  signOut: () =>
    set({
      session: null,
      selectedId: null,
      status: 'ready',
      epochMs: startEpochMs,
    }),
  select: (id) => set({ selectedId: id }),
  start: () => {
    const { status } = get()
    if (status === 'running' || status === 'paused') return
    set({ status: 'running' })
  },
  pause: () => {
    if (get().status === 'running') set({ status: 'paused' })
  },
  resume: () => {
    if (get().status === 'paused') set({ status: 'running' })
  },
  restart: () => set({ status: 'ready', epochMs: startEpochMs }),
  end: () => {
    const { status } = get()
    if (status === 'ready' || status === 'ended') return
    set({ status: 'ended' })
  },
  tick: () => {
    const { status, epochMs } = get()
    if (status !== 'running') return
    set({ epochMs: epochMs + 60 * 1000 })
  },
}))
