<template>
  <section class="arrival">
    <div class="arrival__timer timer-wrapper">
      <svg viewBox="0 0 260 260" class="arrival__svg" aria-hidden="true">
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#22c55e" />
          </linearGradient>
        </defs>

        <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="12"></circle>

        <circle
          id="timer-ring"
          class="timer-ring"
          cx="130"
          cy="130"
          r="110"
          fill="none"
          stroke="url(#timerGradient)"
          stroke-width="12"
          stroke-linecap="round"
          :style="ringStyle"
        ></circle>
      </svg>

      <div class="arrival__inner timer-inner-shadow">
        <div class="arrival__inner2"></div>

        <div class="arrival__content">
          <div id="timer-text" class="arrival__time">{{ timeText }}</div>
          <div v-if="unitText" class="arrival__unit">{{ unitText }}</div>
          <div class="arrival__route">{{ routeText }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timer-ring {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.35s linear;
}
</style>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** @type {"loading"|"countdown"|"tomorrow"|"no_service"} */
  mode: { type: String, required: true },

  /** @type {string} */
  arrivalLabel: { type: String, required: true },

  /** @type {string} */
  caption: { type: String, default: '' },

  /** @type {string} */
  routeLabel: { type: String, default: '' },

  /** @type {number|null} */
  progress: { type: Number, default: null }
})

const timeText = computed(() => {
  if (props.mode === 'loading') return '…'
  return props.arrivalLabel || '—'
})

const unitText = computed(() => {
  return props.mode === 'countdown' ? (props.caption || '') : ''
})

const routeText = computed(() => {
  return props.routeLabel || '—'
})

const R = 110
const CIRC = 2 * Math.PI * R

const ringStyle = computed(() => {
  // If progress is not available or not in countdown, hide ring nicely
  if (props.mode !== 'countdown' || props.progress === null || !Number.isFinite(props.progress)) {
    return {
      strokeDasharray: `${CIRC}`,
      strokeDashoffset: `${CIRC}`
    }
  }

  const p = Math.min(1, Math.max(0, props.progress))
  // 0 -> empty, 1 -> full
  const offset = CIRC * (1 - p)

  return {
    strokeDasharray: `${CIRC}`,
    strokeDashoffset: `${offset}`
  }
})
</script>

