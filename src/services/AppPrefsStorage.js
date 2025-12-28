/**
 * @typedef {"15"|"16"|"80"} RouteId
 * @typedef {"A"|"B"} Direction
 *
 * @typedef {Object} AppPrefsSnapshot
 * @property {RouteId|string} selectedRouteId
 * @property {Direction} selectedDirection
 * @property {number} selectedStopIndex
 */

const KEY = 'my-bus:prefs'

export class AppPrefsStorage {
  /**
   * Load persisted preferences.
   *
   * @returns {AppPrefsSnapshot|null}
   */
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return null
      const data = JSON.parse(raw)
      return data && typeof data === 'object' ? data : null
    } catch {
      return null
    }
  }

  /**
   * Save preferences snapshot.
   *
   * @param {AppPrefsSnapshot} snapshot
   * @returns {void}
   */
  save(snapshot) {
    try {
      localStorage.setItem(KEY, JSON.stringify(snapshot))
    } catch {
      // ignore
    }
  }
}

export const appPrefsStorage = new AppPrefsStorage()
