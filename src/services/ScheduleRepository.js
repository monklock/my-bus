/**
 * @typedef {"15"|"16"|"80"} RouteId
 * @typedef {"A"|"B"} Direction
 *
 * @typedef {Object} RouteScheduleServiceSet
 * @property {string[]} from_enakievo
 * @property {string[]} from_karlomarksovo
 *
 * @typedef {Object} RouteSchedule
 * @property {RouteScheduleServiceSet} mon_sat
 * @property {RouteScheduleServiceSet} sun_holiday
 *
 * @typedef {Object} RouteStops
 * @property {string[]} stops
 * @property {number[]} cumulative_min
 * @property {number} total_trip_min
 *
 * @typedef {Object} RouteData
 * @property {RouteId} route_id
 * @property {string} title
 * @property {RouteStops} stops
 * @property {RouteSchedule} schedule
 */

export class ScheduleRepository {
  /**
   * Load and normalize route data.
   * Must be offline-friendly (bundled JSON) and later support remote updates.
   *
   * @param {RouteId|string} routeId
   * @returns {Promise<RouteData|null>} Returns null if route data is not available.
   */
  async getRouteData(routeId) {
    const rid = String(routeId)

    // TODO: replace with dynamic loader when adding 16/80
    if (rid !== '15') {
      return null
    }

    const stopsRaw = await import('src/data/routes/route-15/stops.json')
    const scheduleRaw = await import('src/data/routes/route-15/schedule.json')

    const stops = this._normalizeStops(stopsRaw.default ?? stopsRaw)
    const schedule = this._normalizeSchedule(scheduleRaw.default ?? scheduleRaw)

    return {
      route_id: /** @type {any} */ (rid),
      title: schedule.title ?? '—',
      stops,
      schedule
    }
  }

  /**
   * Normalize stops JSON to a stable internal format.
   *
   * @param {any} raw
   * @returns {RouteStops}
   */
  _normalizeStops(raw) {
    const stops = Array.isArray(raw?.stops) ? raw.stops : []
    const cumulative = Array.isArray(raw?.cumulative_min) ? raw.cumulative_min : []
    const total = cumulative.length > 0 ? cumulative[cumulative.length - 1] : 0

    return {
      stops,
      cumulative_min: cumulative,
      total_trip_min: total
    }
  }

  /**
   * Normalize schedule JSON (simple format).
   *
   * @param {any} raw
   * @returns {RouteSchedule & {title?: string}}
   */
  _normalizeSchedule(raw) {
    const serviceSets = Array.isArray(raw?.service_sets) ? raw.service_sets : []

    /** @type {any} */
    const byId = {}
    for (const set of serviceSets) {
      if (!set?.service_id || !set?.departures) continue
      byId[set.service_id] = set.departures
    }

    return {
      title: raw?.title,
      mon_sat: {
        from_enakievo: byId?.mon_sat?.from_enakievo ?? [],
        from_karlomarksovo: byId?.mon_sat?.from_karlomarksovo ?? []
      },
      sun_holiday: {
        from_enakievo: byId?.sun_holiday?.from_enakievo ?? [],
        from_karlomarksovo: byId?.sun_holiday?.from_karlomarksovo ?? []
      }
    }
  }

  /**
   * Get cumulative minutes to a stop for a given direction.
   * A: cumulative_min[stopIndex]
   * B: total - cumulative_min[stopIndexInA] where stopIndexInA is mirrored.
   *
   * @param {RouteStops} stopsData
   * @param {Direction} direction
   * @param {number} stopIndex
   * @returns {number}
   */
  getCumulativeToStop(stopsData, direction, stopIndex) {
    const stopsCount = stopsData.stops.length
    const cum = stopsData.cumulative_min
    const total = stopsData.total_trip_min

    if (stopIndex < 0 || stopIndex >= stopsCount) return 0
    if (direction === 'A') return Number(cum[stopIndex] ?? 0)

    const mirroredA = (stopsCount - 1) - stopIndex
    const valA = Number(cum[mirroredA] ?? 0)
    return Math.max(0, total - valA)
  }
}

export const scheduleRepository = new ScheduleRepository()
