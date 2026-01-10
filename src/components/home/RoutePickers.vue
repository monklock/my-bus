<template>
  <section class="route-buttons" id="route-buttons">
        <button
          type="button"
          data-route="15"
          class="route-btn"
          :class="buttonClass('15')"
          @click="pick('15')"
        >
    <img :src="bus" alt="" width="22" height="22" class="mr-2"> 15
  </button>
        <button
          type="button"
          data-route="16"
          class="route-btn route-btn--alt"
          :class="buttonClass('16')"
          @click="pick('16')"
        >
    <img :src="bus" alt="" width="22" height="22" class="mr-2">  16
  </button>

  <button
          type="button"
          data-route="80"
          class="route-btn"
          :class="buttonClass('80')"
         @click="pick('80')"
       >
    <img :src="bus" alt="" width="22" height="22" class="mr-1"> 80
  </button>
  </section>
</template>

<script setup>
import bus from 'src/assets/mybus.svg'

const props = defineProps({
    /** @type {("15"|"16"|"80"|string)} */
    modelValue: { type: String, required: true },

   /** @type {string[]} */
      available: { type: Array, default: () => ['15', '16', '80'] }
})

const emit = defineEmits([
      'update:modelValue'
    ])

/**
    * @param {string} routeId
    * @returns {void}
   */
  function pick(routeId) {
        emit('update:modelValue', String(routeId))
      }

  /**
    * @param {string} routeId
    * @returns {string}
    */
 function buttonClass(routeId) {
        return String(props.modelValue) === String(routeId) ? 'btn-main' : 'btn-secondary'
       }
</script>
