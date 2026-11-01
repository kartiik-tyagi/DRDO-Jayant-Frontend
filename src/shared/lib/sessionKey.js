import { logger } from './logger'

const KEY = 'jayant.session'

export function readSessionKey() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return { userId: null }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.userId !== 'string' || !parsed.userId) {
      sessionStorage.removeItem(KEY)
      logger.warn('session.storage_invalid')
      return { userId: null, invalid: true }
    }
    return { userId: parsed.userId }
  } catch (error) {
    logger.warn('session.storage_unreadable', { message: error?.message || 'storage unavailable' })
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      /* storage can be blocked */
    }
    return { userId: null, invalid: true }
  }
}

export function writeSessionKey(userId) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ userId }))
    return true
  } catch (error) {
    logger.warn('session.storage_unavailable', { message: error?.message || 'storage unavailable' })
    return false
  }
}

export function clearSessionKey() {
  try {
    sessionStorage.removeItem(KEY)
  } catch (error) {
    logger.warn('session.storage_unavailable', { message: error?.message || 'storage unavailable' })
  }
}
