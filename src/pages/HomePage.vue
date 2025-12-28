<template>
  <q-page class="home-page flex justify-center min-h-screen">

    <HomeHeader />

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

    <RoutePickers
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
import { useArrivalStore } from 'src/stores/arrivalStore'
import { useAppPrefsStore } from 'src/stores/appPrefsStore'
import { appPrefsStorage } from 'src/services/AppPrefsStorage'

import DirectionSwitch from 'components/home/DirectionSwitch.vue'
import ArrivalCircle from 'components/home/ArrivalCircle.vue'
import StopSelector from 'components/home/StopSelector.vue'
import RoutePickers from 'components/home/RoutePickers.vue'
import StopPickerDialog from 'components/home/StopPickerDialog.vue'
import HomeHeader from 'components/home/HomeHeader.vue'

const prefs = useAppPrefsStore()
const arrival = useArrivalStore()

/**
 * Dialog state
 * @type {import('vue').Ref<boolean>}
 */
const isStopPickerOpen = ref(false)

  /**
   + * Raw stops data for the current route (A/B).
   + * @type {import('vue').Ref<any|null>}
   + */
  const routeStopsData = ref(null)

 /**
    * Visible stops list depends on selected direction.
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
  routeStopsData.value = routeData?.stops ?? null
  const dir = prefs.selectedDirection
  stops.value = routeStopsData.value?.directions?.[dir]?.stops ?? []
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


let unsubscribe = null

onMounted(async () => {

  // 1) Restore persisted prefs (optional)
  const saved = appPrefsStorage.load()
  if (saved) {
    if (saved?.selectedRouteId) prefs.setRoute(String(saved.selectedRouteId))
    if (saved?.selectedDirection === 'A' || saved?.selectedDirection === 'B') {
      prefs.setDirection(saved.selectedDirection)
    }
    if (Number.isFinite(saved?.selectedStopIndex)) {
      prefs.setStopIndex(Number(saved.selectedStopIndex))
    }
  }

// 2) Persist changes (optional)
  unsubscribe = prefs.$subscribe(() => {
    appPrefsStorage.save({
      selectedRouteId: prefs.selectedRouteId,
      selectedDirection: prefs.selectedDirection,
      selectedStopIndex: prefs.selectedStopIndex
    })
  })

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
  () => prefs.selectedRouteId,
  async (routeId, prevRouteId) => {
    if (routeId !== prevRouteId) {
      await loadStopsForRoute()
      if (prefs.selectedStopIndex >= stops.value.length) prefs.setStopIndex(0)
      await arrival.recalculate()
    }
  }
)

watch(
  () => prefs.selectedDirection,
  async (dir, prevDir) => {
    if (dir !== prevDir) {
      // Update visible stops for the new direction (A/B)
      stops.value = routeStopsData.value?.directions?.[dir]?.stops ?? []
      if (prefs.selectedStopIndex >= stops.value.length) prefs.setStopIndex(0)
      await arrival.recalculate()
    }
  }
)

watch(
  () => prefs.selectedStopIndex,
  async () => {
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
