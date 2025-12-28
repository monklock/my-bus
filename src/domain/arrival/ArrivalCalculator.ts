import { resolveDayType } from './DayTypeResolver'

/**
 * @typedef {"A"|"B"} Direction
 * @typedef {"mon_sat"|"sun_holiday"} DayType
 *
 * @typedef {Object} CalculateInput
 * @property {string} routeId
 * @property {Direction} direction
 * @property {number} stopIndex
 * @property {Date} now
 * @property {any} routeData
 * @property {(stopsData:any, direction:Direction, stopIndex:number)=>number} getCumulativeToStop
 *
 * @typedef {"countdown"|"tomorrow"|"no_service"} ArrivalMode
 *
 * @typedef {Object} CalculateResult
 * @property {ArrivalMode} mode
 * @property {string|null} arrivalAtIso
 * @property {DayType|null} dayTypeUsed
 */

export class ArrivalCalculator {
  /**
   * Calculate the next ARRIVAL time at the selected stop.
   * This MUST always represent arrival at the stop (departure + cumulative).
   *
   * @param {CalculateInput} input
   * @returns {CalculateResult}
   */
  calculateNextArrival(input) {
    const { routeData, direction, stopIndex, now, getCumulativeToStop } = input

    if (!routeData?.schedule || !routeData?.stops) {
      return { mode: 'no_service', arrivalAtIso: null, dayTypeUsed: null }
    }

    const todayType = resolveDayType(now)
    const todayArrival = this._findNextArrivalForDate({
      routeData,
      direction,
      stopIndex,
      baseDate: now,
      dayType: todayType,
      getCumulativeToStop
    })

    if (todayArrival) {
      return { mode: 'countdown', arrivalAtIso: todayArrival.toISOString(), dayTypeUsed: todayType }
    }

    // No more trips today -> tomorrow earliest
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const tomorrowType = resolveDayType(tomorrow)
    const tomorrowArrival = this._findFirstArrivalForDate({
      routeData,
      direction,
      stopIndex,
      baseDate: tomorrow,
      dayType: tomorrowType,
      getCumulativeToStop
    })

    if (!tomorrowArrival) {
      return { mode: 'no_service', arrivalAtIso: null, dayTypeUsed: null }
    }

    return { mode: 'tomorrow', arrivalAtIso: tomorrowArrival.toISOString(), dayTypeUsed: tomorrowType }
  }

  /**
   * Find next arrival >= now for a given date and dayType.
   *
   * @param {Object} args
   * @param {any} args.routeData
   * @param {Direction} args.direction
   * @param {number} args.stopIndex
   * @param {Date} args.baseDate
   * @param {DayType} args.dayType
   * @param {(stopsData:any, direction:Direction, stopIndex:number)=>number} args.getCumulativeToStop
   * @returns {Date|null}
   */
  _findNextArrivalForDate(args) {
    const { routeData, direction, stopIndex, baseDate, dayType, getCumulativeToStop } = args
    const now = baseDate
    const list = this._getDepartureTimes(routeData, dayType, direction)
    if (!list.length) return null

    const cumMin = Number(getCumulativeToStop(routeData.stops, direction, stopIndex) ?? 0)

    /** @type {Date|null} */
    let best = null

    for (const t of list) {
      const dep = this._timeToDate(baseDate, t)
      const arr = new Date(dep.getTime() + cumMin * 60 * 1000)
      if (arr.getTime() < now.getTime()) continue
      if (!best || arr.getTime() < best.getTime()) best = arr
    }

    return best
  }

  /**
   * Find earliest arrival for a given date and dayType.
   *
   * @param {Object} args
   * @param {any} args.routeData
   * @param {Direction} args.direction
   * @param {number} args.stopIndex
   * @param {Date} args.baseDate
   * @param {DayType} args.dayType
   * @param {(stopsData:any, direction:Direction, stopIndex:number)=>number} args.getCumulativeToStop
   * @returns {Date|null}
   */
  _findFirstArrivalForDate(args) {
    const { routeData, direction, stopIndex, baseDate, dayType, getCumulativeToStop } = args
    const list = this._getDepartureTimes(routeData, dayType, direction)
    if (!list.length) return null

    const cumMin = Number(getCumulativeToStop(routeData.stops, direction, stopIndex) ?? 0)

    // Earliest departure -> earliest arrival (since cumMin is constant for a stop)
    const dep = this._timeToDate(baseDate, list[0])
    return new Date(dep.getTime() + cumMin * 60 * 1000)
  }

  /**
   * Get departure times list for direction and dayType.
   *
   * @param {any} routeData
   * @param {DayType} dayType
   * @param {Direction} direction
   * @returns {string[]}
   */
  _getDepartureTimes(routeData, dayType, direction) {
    const set = routeData?.schedule?.[dayType]
    if (!set) return []

    const key = direction === 'A' ? 'from_enakievo' : 'from_karlomarksovo'
    const list = Array.isArray(set[key]) ? set[key] : []

    // Ensure sorted order (safe if already sorted)
    return list.slice().sort()
  }

  /**
   * Convert "HH:MM" to a Date on a given base day.
   *
   * @param {Date} baseDate
   * @param {string} timeStr
   * @returns {Date}
   */
  _timeToDate(baseDate, timeStr) {
    const [hh, mm] = String(timeStr).split(':').map((v) => Number(v))
    const d = new Date(baseDate)
    d.setHours(Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0, 0)
    return d
  }
}

export const arrivalCalculator = new ArrivalCalculator()
