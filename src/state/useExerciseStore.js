import { create } from 'zustand'
import dayjs from 'dayjs'

export const useExerciseStore = create((set, get) => ({
  selectedId: null,
  epochMs: null,
  running: false,
  rate: 1,
  select: (id) => set({ selectedId: id }),
  initClock: (clock) => {
    const parsed = dayjs(clock?.start)
    set({
      epochMs: parsed.isValid() ? parsed.valueOf() : Date.now(),
      running: Boolean(clock?.running),
      rate: Number(clock?.rate) > 0 ? Number(clock.rate) : 1,
    })
  },
  toggleRunning: () => set({ running: !get().running }),
  tick: () => {
    const { epochMs, rate } = get()
    if (epochMs == null) return
    set({ epochMs: epochMs + 1000 * rate })
  },
}))
