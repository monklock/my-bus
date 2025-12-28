import { defineStore } from 'pinia'

/**
 * @typedef {"15"|"16"|"80"} RouteId
 * @typedef {"A"|"B"} Direction
 */

export const useAppPrefsStore = defineStore('appPrefs', {
  state: () => ({
    /** @type {RouteId} */
    selectedRouteId: '15',
    /** @type {Direction} */
    selectedDirection: 'A',
    /** @type {number} */
    selectedStopIndex: 0
  }),

  actions: {
    /**
     * @param {RouteId|string} routeId
     * @returns {void}
     */
    setRoute(routeId) {
      this.selectedRouteId = /** @type {any} */ (String(routeId))
    },

    /**
     * @param {Direction} direction
     * @returns {void}
     */
    setDirection(direction) {
      this.selectedDirection = direction
    },

    /**
     * @param {number} index
     * @returns {void}
     */
    setStopIndex(index) {
      this.selectedStopIndex = Number.isFinite(index) ? index : 0
    }
  },

  // If you already have pinia persistence plugin, enable it here.
  // persist: true,
})
