import { defineStore } from 'pinia'
import { scheduleRepository } from 'src/services/ScheduleRepository'
import { arrivalCalculator } from 'src/domain/arrival/ArrivalCalculator'
import { useAppPrefsStore } from 'src/stores/appPrefsStore'


/**
 * @typedef {"loading"|"countdown"|"tomorrow"|"no_service"} ScreenMode
 */

export const useArrivalStore = defineStore('arrival', {
  state: () => ({
    /** @type {ScreenMode} */
    screenMode: 'loading',
    /** @type {string|null} */
    arrivalAtIso: null,
    /** @type {string} */
    arrivalLabel: '—',
    /** @type {number|null} */
    secondsLeft: null,
    /** @type {string|null} */
    dayTypeUsed: null,
    /** @type {string|null} */
    error: null,
    /** @type {number|null} */
    progress: null,
    /** @type {number|null} */
    _startSecondsLeft: null,

    /** @type {number|null} */
    _tickId: null
  }),

  actions: {
    /**
     * Recalculate arrival state based on current preferences.
     * @returns {Promise<void>}
     */
    async recalculate() {
      this.stopTick()
      this.screenMode = 'loading'
      this.error = null
      this.progress = null
      this._startSecondsLeft = null

      const prefs = useAppPrefsStore()

      const routeData = await scheduleRepository.getRouteData(prefs.selectedRouteId)
      if (!routeData) {
        this.screenMode = 'no_service'
        this.arrivalAtIso = null
        this.arrivalLabel = 'Нет рейсов'
        this.arrivalLabel = String(prefs.selectedRouteId) === '15'
        ? 'Нет данных'
        : 'Маршрут пока не добавлен'
        this.secondsLeft = null
        this.progress = null
        this._startSecondsLeft = null
        this.dayTypeUsed = null
        this.error = 'Route data is not available.'
        return
      }

      const now = new Date()

      const result = arrivalCalculator.calculateNextArrival({
        routeId: prefs.selectedRouteId,
        direction: prefs.selectedDirection,
        stopIndex: prefs.selectedStopIndex,
        now,
        routeData,
        getCumulativeToStop: scheduleRepository.getCumulativeToStop.bind(scheduleRepository)
      })

      this.arrivalAtIso = result.arrivalAtIso
      this.dayTypeUsed = result.dayTypeUsed

      if (result.mode === 'no_service' || !result.arrivalAtIso) {
        this.screenMode = 'no_service'
        this.arrivalLabel = 'Рейсов нет'
        this.secondsLeft = null
        return
      }

      if (result.mode === 'tomorrow') {
        this.screenMode = 'tomorrow'
        this.arrivalLabel = this._formatTomorrowLabel(result.arrivalAtIso)
        this.secondsLeft = null
        this.progress = null
        this._startSecondsLeft = null
        return
      }

      // countdown
      this.screenMode = 'countdown'
      this._updateCountdownLabel()
      this._startSecondsLeft = this.secondsLeft
      this.startTick()
    },

    /**
     * Start countdown tick.
     * @returns {void}
     */
    startTick() {
      if (this._tickId !== null) return
      this._tickId = window.setInterval(() => {
        this._updateCountdownLabel()
      }, 1000)
    },

    /**
     * Stop countdown tick.
     * @returns {void}
     */
    stopTick() {
      if (this._tickId === null) return
      window.clearInterval(this._tickId)
      this._tickId = null
    },

    /**
     * Update label/secondsLeft for countdown mode.
     * When time is up, trigger recalculation for the next trip.
     *
     * @returns {void}
     */
    _updateCountdownLabel() {
      if (this.screenMode !== 'countdown' || !this.arrivalAtIso) return

      const nowMs = Date.now()
      const targetMs = new Date(this.arrivalAtIso).getTime()
      const diffSec = Math.floor((targetMs - nowMs) / 1000)

      if (diffSec <= 0) {
        this.recalculate()
        return
      }

      this.secondsLeft = diffSec
      this.arrivalLabel = this._formatMmSs(diffSec)
      const start = Number(this._startSecondsLeft ?? diffSec) || diffSec
      this.progress = start > 0 ? Math.min(1, Math.max(0, 1 - diffSec / start)) : 0
    },

    /**
     * Format "Завтра HH:MM" label.
     *
     * @param {string} iso
     * @returns {string}
     */
    _formatTomorrowLabel(iso) {
      const d = new Date(iso)
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      return `Завтра ${hh}:${mm}`
    },

    /**
     * Format seconds into "MM:SS".
     *
     * @param {number} sec
     * @returns {string}
     */
    _formatMmSs(sec) {
      const m = Math.floor(sec / 60)
      const s = sec % 60
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
  }
})
