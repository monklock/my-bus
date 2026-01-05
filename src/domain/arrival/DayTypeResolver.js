/**
 * @typedef {"mon_sat"|"sun_holiday"} DayType
 */

/**
 * Resolve day type for the provided date.
 * Holidays are not handled yet (MVP).
 *
 * @param {Date} date
 * @returns {DayType}
 */
export function resolveDayType(date) {
  const day = date.getDay() // 0=Sun ... 6=Sat
  return day === 0 ? 'sun_holiday' : 'mon_sat'
}
