<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
