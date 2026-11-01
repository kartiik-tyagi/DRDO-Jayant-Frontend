import { create } from 'zustand'

export const useToastStore = create((set, get) => ({
  items: [],
  push(message, severity = 'info') {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    set({ items: [...get().items, { id, message, severity }] })
    window.setTimeout(() => get().dismiss(id), 4200)
  },
  dismiss(id) {
    set({ items: get().items.filter((item) => item.id !== id) })
  },
}))
