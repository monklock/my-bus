<template>
  <q-layout view="lHh Lpr lFf 44">
    <q-header elevated>
      <!-- Empty by design: each page has its own header/hero -->
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <AppBottomNav />
  </q-layout>
</template>

<script setup>
import AppBottomNav from 'components/common/AppBottomNav.vue'
</script>
