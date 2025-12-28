<template>
  <q-footer class="bg-white text-dark">
    <q-tabs
      class="w-full"
      dense
      align="justify"
      :model-value="activeTab"
      @update:model-value="onTabChange"
    >
      <q-tab name="buses" icon="directions_bus" label="Автобусы" />
      <q-tab name="taxi" icon="local_taxi" label="Такси" />
      <q-tab name="settings" icon="settings" label="Настройки" />
    </q-tabs>
  </q-footer>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * Map route names to bottom navigation tabs.
 * @type {Record<string, 'buses'|'taxi'|'settings'>}
 */
const routeNameToTab = {
  buses: 'buses',
  taxi: 'taxi',
  settings: 'settings'
}

/**
 * Active tab derived from current route.
 * Home page is not a tab; it highlights "buses" by default.
 */
const activeTab = computed(() => {
  const name = String(route.name ?? '')
  return routeNameToTab[name] ?? 'buses'
})

/**
 * Handle tab selection.
 * @param {'buses'|'taxi'|'settings'} tab
 * @returns {void}
 */
function onTabChange(tab) {
  if (tab === 'buses') router.push({ name: 'buses' })
  if (tab === 'taxi') router.push({ name: 'taxi' })
  if (tab === 'settings') router.push({ name: 'settings' })
}
</script>
