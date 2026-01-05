<template>
  <section class="mt-4">
    <span class="mb-3 flex items-center gap-2 text-[18px] font-extrabold text-[#00335b]">
      Текущая остановка
    </span>

    <!-- Trigger -->
    <button
      id="stop-picker-btn"
      type="button"
      class="w-full rounded-[18px] bg-white px-4 py-3.5 pr-10 text-[16px] font-semibold text-[#222f3e]
             shadow-[0_14px_24px_rgba(0,0,0,0.20)] text-left relative"
      aria-haspopup="dialog"
      aria-controls="stop-modal"
      :aria-expanded="false"
      @click="open"
    >
      <span id="stop-picker-value">{{ stopName }}</span>
      <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#003b7a]/70">
        ▼
      </span>
    </button>
  </section>
</template>

<script setup>
defineProps({
  /** @type {string} */
  stopName: { type: String, default: '—' }
})

const emit = defineEmits(['open'])

/**
 * Open stop picker dialog.
 *
 * @returns {void}
 */
function open() {
  emit('open')
}
</script>
