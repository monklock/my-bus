<template>
  <q-page class="home-page">

    <DirectionSwitch
      v-model="prefs.selectedDirection"
      :labels="directionLabels"
      @update:model-value="prefs.setDirection"
    />

    <ArrivalCircle
      :mode="arrival.screenMode"
      :arrival-label="arrival.arrivalLabel"
      :caption="circleCaption"
      :route-label="routeLabel"
    />

    <StopSelector
      :stop-name="selectedStopName"
      @open="isStopPickerOpen = true"
    />

    <RoutePicker
      v-model="prefs.selectedRouteId"
      :available="availableRoutes"
      @update:model-value="prefs.setRoute"
    />

    <StopPickerDialog
      v-model="isStopPickerOpen"
      :stops="stops"
      :selected-index="prefs.selectedStopIndex"
      :direction="prefs.selectedDirection"
      @select="onStopSelect"
    />

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { scheduleRepository } from 'src/services/ScheduleRepository'
import { useAppPrefsStore } from 'src/stores/appPrefsStore'
import { useArrivalStore } from 'src/stores/arrivalStore'

import DirectionSwitch from 'components/home/DirectionSwitch.vue'
import ArrivalCircle from 'components/home/ArrivalCircle.vue'
import StopSelector from 'components/home/StopSelector.vue'
import RoutePicker from 'components/home/RoutePicker.vue'
import StopPickerDialog from 'components/home/StopPickerDialog.vue'

const prefs = useAppPrefsStore()
const arrival = useArrivalStore()

/**
 * Dialog state
 * @type {import('vue').Ref<boolean>}
 */
const isStopPickerOpen = ref(false)

/**
 * Stops list for current route (for the dialog + label).
 * @type {import('vue').Ref<string[]>}
 */
const stops = ref([])

/**
 * Labels for directions (UI)
 */
const directionLabels = {
  A: 'Енакиево',
  B: 'Карло-Марксово'
}

/**
 * Available routes (16/80 may show no_service until data is added)
 */
const availableRoutes = ['15', '16', '80']

/**
 * Route label under circle
 */
const routeLabel = computed(() => `Маршрут ${prefs.selectedRouteId}`)

/**
 * Circle caption (UX contract)
 */
const circleCaption = computed(() => {
  return arrival.screenMode === 'countdown' ? 'МИНУТ' : ''
})

/**
 * Stop name derived from stops list + selected index.
 */
const selectedStopName = computed(() => {
  return stops.value[prefs.selectedStopIndex] ?? '—'
})

/**
 * Load stops list for current route to support stop picker.
 * This is UI-only; calculations use repository inside arrivalStore.
 *
 * @returns {Promise<void>}
 */
async function loadStopsForRoute() {
  const routeData = await scheduleRepository.getRouteData(prefs.selectedRouteId)
  stops.value = routeData?.stops?.stops ?? []
}

/**
 * Handle stop selection from dialog.
 * @param {number} index
 * @returns {void}
 */
function onStopSelect(index) {
  prefs.setStopIndex(index)
  isStopPickerOpen.value = false
}

/**
 * Persist prefs without extra plugins (optional).
 * Remove if you already use pinia persistence plugin.
 */
const PREFS_KEY = 'my-bus:prefs'

/**
 * @returns {void}
 */
function loadPrefsFromStorage() {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return
    const data = JSON.parse(raw)

    if (data?.selectedRouteId) prefs.setRoute(String(data.selectedRouteId))
    if (data?.selectedDirection === 'A' || data?.selectedDirection === 'B') {
      prefs.setDirection(data.selectedDirection)
    }
    if (Number.isFinite(data?.selectedStopIndex)) {
      prefs.setStopIndex(Number(data.selectedStopIndex))
    }
  } catch {
    // ignore
  }
}

/**
 * @returns {void}
 */
function savePrefsToStorage() {
  const payload = {
    selectedRouteId: prefs.selectedRouteId,
    selectedDirection: prefs.selectedDirection,
    selectedStopIndex: prefs.selectedStopIndex
  }
  localStorage.setItem(PREFS_KEY, JSON.stringify(payload))
}

let unsubscribe = null

onMounted(async () => {
  // 1) Restore persisted prefs (optional)
  loadPrefsFromStorage()

  // 2) Persist changes (optional)
  unsubscribe = prefs.$subscribe(() => savePrefsToStorage())

  // 3) Load stops list for UI
  await loadStopsForRoute()

  // 4) Initial calculation with defaults/restored prefs
  await arrival.recalculate()
})

onUnmounted(() => {
  arrival.stopTick()
  if (typeof unsubscribe === 'function') unsubscribe()
})

/**
 * Recalculate whenever any preference changes.
 * - Route change: reload stops list
 * - Any change: recalculate arrival
 */
watch(
  () => [prefs.selectedRouteId, prefs.selectedDirection, prefs.selectedStopIndex],
  async ([routeId], [prevRouteId]) => {
    if (routeId !== prevRouteId) {
      await loadStopsForRoute()
      // ensure selectedStopIndex still valid for new route
      if (prefs.selectedStopIndex >= stops.value.length) prefs.setStopIndex(0)
    }
    await arrival.recalculate()
  }
)
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
