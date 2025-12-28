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

    // replace with dynamic loader when adding 16/80
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
        const dirA = raw?.directions?.A ?? {}
          const dirB = raw?.directions?.B ?? {}

          const stopsA = Array.isArray(dirA?.stops) ? dirA.stops : []
          const cumA = Array.isArray(dirA?.cumulative_min) ? dirA.cumulative_min : []
          const segA = Array.isArray(dirA?.segments_min) ? dirA.segments_min : []

          const stopsB = Array.isArray(dirB?.stops) ? dirB.stops : []
          const cumB = Array.isArray(dirB?.cumulative_min) ? dirB.cumulative_min : []
          const segB = Array.isArray(dirB?.segments_min) ? dirB.segments_min : []

          const total = Number(raw?.total_trip_min ?? (cumA.length ? cumA[cumA.length - 1] : 0)) || 0

          return {
            total_trip_min: total,
            directions: {
              A: { stops: stopsA, segments_min: segA, cumulative_min: cumA },
              B: { stops: stopsB, segments_min: segB, cumulative_min: cumB }
            }
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
     const dir = stopsData?.directions?.[direction]
     const cum = Array.isArray(dir?.cumulative_min) ? dir.cumulative_min : []

     if (!Number.isFinite(stopIndex)) return 0
     if (stopIndex < 0 || stopIndex >= cum.length) return 0

     return Number(cum[stopIndex] ?? 0) || 0
  }
}

export const scheduleRepository = new ScheduleRepository()
