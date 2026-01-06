<template>
  <div
    id="stop-modal"
    class="fixed inset-0 z-[9999]"
    :class="props.modelValue ? 'block' : 'hidden'"
    role="dialog"
    aria-modal="true"
    aria-labelledby="stop-modal-title"
  >
    <!-- Backdrop (must cover bottom nav visually) -->
    <div
      id="stop-modal-backdrop"
      class="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
      @click="close"
    ></div>

    <!-- Bottom sheet -->
    <div class="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-4 pb-4 z-50">
      <div
        class="stop-sheet relative overflow-hidden rounded-[28px]
               border border-white/35 "
      >
        <!-- Handle -->
        <div class="pt-3 flex justify-center">
          <div class="h-1.5 w-12 rounded-full bg-white/55"></div>
        </div>

        <!-- Header -->
        <div class="px-5 pt-3 pb-4 flex items-start justify-between gap-3">
          <div>
            <div id="stop-modal-title" class="text-[18px] font-extrabold text-white drop-shadow">
              Выберите остановку
            </div>
            <p class="mt-1 text-[13px] text-white/85">
              Поиск по названию
            </p>
          </div>

          <button
            id="stop-modal-close"
            type="button"
            class="stop-close-btn shrink-0 rounded-[14px] px-3 py-2 text-white/90
                   bg-white/18 border border-white/25
                   shadow-[0_10px_18px_rgba(0,0,0,0.18)]
                   hover:bg-white/22 transition"
            aria-label="Закрыть"
            @click="close"
          >
            ✕
          </button>
        </div>

        <!-- Search -->
        <div class="px-5 pb-4">
          <div class="relative">
            <input
              id="stop-search"
              ref="searchEl"
              v-model="query"
              type="text"
              class="w-full rounded-[18px] bg-white px-4 py-3 pr-10 text-[15px] font-semibold text-[#0b2540]
                     shadow-[0_14px_24px_rgba(0,0,0,0.18)] outline-none"
              placeholder="Например: вокзал, площадь, университет…"
              autocomplete="off"
            />
            <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#003b7a]/50">
              🔎
            </span>
          </div>
        </div>

        <!-- List -->
        <div class="px-3 pb-4">
          <div id="stop-list" class="stop-list max-h-[340px] overflow-auto overscroll-contain px-2">
            <button
              v-for="item in filteredStops"
              :key="item.index"
              type="button"
              class="stop-item"
              @click="select(item.index)"
            >
              <div class="flex items-center justify-between gap-3 w-full">
                <div class="min-w-0">
                  <div class="truncate text-[16px] font-bold text-[#0b2540]">
                    {{ item.name }}
                  </div>
                </div>

                <span
                  class="stop-item__chip"
                  :class="item.index === props.selectedIndex ? 'bg-[#00a8ff]' : 'bg-[#00a8ff]/85'"
                >
                  {{ item.index === props.selectedIndex ? 'Выбрано' : 'Выбрать' }}
                </span>
              </div>
            </button>

            <div v-if="filteredStops.length === 0" class="px-3 py-6 text-white/90 text-[14px]">
              Ничего не найдено
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  /** @type {boolean} */
  modelValue: { type: Boolean, required: true },

  /** @type {string[]} */
  stops: { type: Array, default: () => [] },

  /** @type {number} */
  selectedIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue', 'select'])

/**
 * Search query.
 * @type {import('vue').Ref<string>}
 */
const query = ref('')

/**
 * Input ref for autofocus on open.
 * @type {import('vue').Ref<HTMLInputElement|null>}
 */
const searchEl = ref(null)

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (!isOpen) {
      query.value = ''
      return
    }
    await nextTick()
  }
)

/**
 * Normalize for search.
 *
 * @param {string} value
 * @returns {string}
 */
function normalize(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ')
}

const filteredStops = computed(() => {
  const q = normalize(query.value)
  return (props.stops ?? [])
    .map((name, index) => ({ name, index }))
    .filter((x) => (q ? normalize(x.name).includes(q) : true))
})

/**
 * Close dialog.
 *
 * @returns {void}
 */
function close() {
  emit('update:modelValue', false)
}

/**
 * Select stop index and close.
 *
 * @param {number} index
 * @returns {void}
 */
function select(index) {
  emit('select', index)
  emit('update:modelValue', false)
}
</script>
