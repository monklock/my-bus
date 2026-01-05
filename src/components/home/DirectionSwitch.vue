<template>
  <section class="mt-2 flex items-center justify-between gap-3" id="dir-switch">
    <button
      type="button"
      data-dir="A"
      class="dir-btn dir-btn--a flex items-center justify-center px-5 py-3 font-semibold text-[16px] md:text-[18px] transition-all duration-200"
      :class="buttonClass('A')"
      @click="setDir('A')"
    >
      Енакиево
    </button>

    <button
      type="button"
      data-dir="B"
      class="dir-btn dir-btn--b flex items-center justify-center px-5 py-3 font-semibold text-[16px] md:text-[18px] transition-all duration-200"
      :class="buttonClass('B')"
      @click="setDir('B')"
    >
      <span class="-mt-[2px] truncate max-w-full">Карло-Марксово</span>
    </button>
  </section>
</template>

<script setup>
const props = defineProps({
  /** @type {"A"|"B"} */
  modelValue: { type: String, required: true },

  /** @type {{A?: string, B?: string}|null} */
  labels: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

/**
 * Set selected direction.
 *
 * @param {"A"|"B"} dir
 * @returns {void}
 */
function setDir(dir) {
  if (props.modelValue === dir) return
  emit('update:modelValue', dir)
}

/**
 * Compute button classes based on active state.
 * Keeps your current look:
 * - active: pill (rounded-[999px]) + "btn-main is-active"
 * - inactive: rounded-[18px] + "btn-secondary is-inactive"
 *
 * @param {"A"|"B"} dir
 * @returns {string}
 */
function buttonClass(dir) {
  const isActive = props.modelValue === dir

  if (isActive) {
    return 'btn-main is-active rounded-[999px] bg-[#00a8ff] text-white shadow-md scale-[1.02]'
  }

  return 'btn-secondary is-inactive rounded-[18px] bg-[#00a8ff] text-white opacity-80'
}
</script>
