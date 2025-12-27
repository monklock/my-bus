<template>
  <q-page class="home-page">

    <!-- Direction switch -->
    <DirectionSwitch
      v-model="selectedDirection"
      :labels="directionLabels"
      @update:model-value="onDirectionChange"
    />

    <!-- Main arrival circle -->
    <ArrivalCircle
      :mode="screenMode"
      :arrival-label="arrivalLabel"
      :caption="circleCaption"
      :route-label="routeLabel"
    />

    <!-- Stop selector -->
    <StopSelector
      :stop-name="selectedStopName"
      @open="openStopPicker"
    />

    <!-- Route picker -->
    <RoutePicker
      v-model="selectedRouteId"
      :available="availableRoutes"
      @update:model-value="onRouteChange"
    />

    <!-- Stop picker dialog -->
    <StopPickerDialog
      v-model="isStopPickerOpen"
      :stops="stops"
      :selected-index="selectedStopIndex"
      :direction="selectedDirection"
      @select="onStopSelect"
    />

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * UI components
 */
import DirectionSwitch from 'components/home/DirectionSwitch.vue'
import ArrivalCircle from 'components/home/ArrivalCircle.vue'
import StopSelector from 'components/home/StopSelector.vue'
import RoutePicker from 'components/home/RoutePicker.vue'
import StopPickerDialog from 'components/home/StopPickerDialog.vue'

/**
 * -------------------------
 * Runtime state (UI only)
 * -------------------------
 */

/**
 * Selected route (default: 15)
 * @type {import('vue').Ref<string>}
 */
const selectedRouteId = ref('15')

/**
 * Selected direction (A = from Enakievo)
 * @type {import('vue').Ref<'A' | 'B'>}
 */
const selectedDirection = ref('A')

/**
 * Selected stop index
 * @type {import('vue').Ref<number>}
 */
const selectedStopIndex = ref(0)

/**
 * Stops list (loaded later)
 * @type {import('vue').Ref<string[]>}
 */
const stops = ref([])

/**
 * Screen mode:
 * loading | countdown | tomorrow | no_service
 * @type {import('vue').Ref<string>}
 */
const screenMode = ref('loading')

/**
 * Dialog state
 */
const isStopPickerOpen = ref(false)

/**
 * -------------------------
 * Derived UI values
 * -------------------------
 */

/**
 * Stop name for UI
 */
const selectedStopName = computed(() => {
  return stops.value[selectedStopIndex.value] ?? '—'
})

/**
 * Label inside circle (MM:SS or "Завтра HH:MM")
 */
const arrivalLabel = ref('—')

/**
 * Caption under timer
 */
const circleCaption = computed(() => {
  return screenMode.value === 'countdown' ? 'МИНУТ' : ''
})

/**
 * Route label under circle
 */
const routeLabel = computed(() => {
  return `Маршрут ${selectedRouteId.value}`
})

/**
 * Direction labels
 */
const directionLabels = {
  A: 'Енакиево',
  B: 'Карло-Марксово'
}

/**
 * Available routes (16/80 can be disabled later)
 */
const availableRoutes = ['15', '16', '80']

/**
 * -------------------------
 * Event handlers
 * -------------------------
 */

/**
 * Handle direction change
 * @param {'A' | 'B'} dir
 */
function onDirectionChange(dir) {
  selectedDirection.value = dir
  recalculate()
}

/**
 * Handle route change
 * @param {string} routeId
 */
function onRouteChange(routeId) {
  selectedRouteId.value = routeId
  recalculate()
}

/**
 * Open stop picker dialog
 */
function openStopPicker() {
  isStopPickerOpen.value = true
}

/**
 * Handle stop selection
 * @param {number} index
 */
function onStopSelect(index) {
  selectedStopIndex.value = index
  isStopPickerOpen.value = false
  recalculate()
}

/**
 * -------------------------
 * Core orchestration
 * -------------------------
 */

/**
 * Recalculate arrival state
 * (logic will be implemented later)
 */
function recalculate() {
  screenMode.value = 'loading'

  // TODO:
  // - load route data
  // - calculate arrival time
  // - set screenMode
  // - set arrivalLabel
}

/**
 * -------------------------
 * Lifecycle
 * -------------------------
 */

onMounted(() => {
  // Initial boot with defaults
  recalculate()
})

onUnmounted(() => {
  // TODO: clear timers if added
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
