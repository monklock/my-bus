<template>
  <section class="route-buttons" id="route-buttons">
    <button type="button" data-route="15" class="route-btn btn-secondary" >
      <img :src="bus" alt="" width="22" height="22" class="mr-2"> 15
    </button>

    <button type="button" data-route="16" class="route-btn btn-secondary route-btn--alt">
      <img :src="bus" alt="" width="22" height="22" class="mr-2">  16
    </button>

    <button type="button" data-route="80" class="route-btn btn-secondary">
      <img :src="bus" alt="" width="22" height="22" class="mr-1"> 80
    </button>
  </section>
</template>

<script setup>
import bus from 'src/assets/mybus.svg'
</script>
