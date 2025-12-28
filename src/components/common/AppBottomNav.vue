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


  <nav class="mt-auto rounded-[28px] bottom-nav px-3 py-3">
    <div class="bottom-nav__group rounded-[22px] px-2 py-2 flex items-stretch gap-3">
      <!-- Автобус (active) -->
      <button class="bottom-nav__item is-active flex-1 flex flex-col items-center justify-center gap-1 py-2">
        <svg class="bottom-nav__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="3" width="16" height="14" rx="3" stroke="currentColor" stroke-width="2" />
          <path d="M4 9h16" stroke="currentColor" stroke-width="2" />
          <rect x="6" y="5" width="4" height="3" rx="1" stroke="currentColor" stroke-width="1.6" />
          <rect x="14" y="5" width="4" height="3" rx="1" stroke="currentColor" stroke-width="1.6" />
          <path d="M7 13h2M15 13h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <circle cx="8" cy="18" r="1.8" fill="currentColor" />
          <circle cx="16" cy="18" r="1.8" fill="currentColor" />
        </svg>
        <span class="bottom-nav__label">Автобусы</span>
      </button>

      <!-- Такси -->
      <button class="bottom-nav__item flex-1 flex flex-col items-center justify-center gap-1 py-2">
        <svg class="bottom-nav__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 10l1.5-4a2 2 0 0 1 1.9-1.3h1.2A2 2 0 0 1 14.5 6l1.5 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <rect x="4" y="10" width="16" height="7" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M10 4h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M8 13h2M14 13h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path
            d="M9 11h1M11 11h1M13 11h1M15 11h1"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <circle cx="8" cy="17" r="1.8" fill="currentColor" />
          <circle cx="16" cy="17" r="1.8" fill="currentColor" />
        </svg>
        <span class="bottom-nav__label">Такси</span>
      </button>

      <!-- Настройки -->
      <button class="bottom-nav__item flex-1 flex flex-col items-center justify-center gap-1 py-2">
        <svg class="bottom-nav__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
          <path
            d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.4-2.3.6c-.3-.3-.7-.5-1.1-.7L15.1 4H8.9l-.4 2.3c-.4.2-.8.4-1.1.7l-2.3-.6-2 3.4L5 11c0 .3-.1.7-.1 1s0 .7.1 1l-1.9 1.2 2 3.4 2.3-.6c.3.3.7.5 1.1.7l.4 2.3h6.2l.4-2.3c.4-.2.8-.4 1.1-.7l2.3.6 2-3.4L18.9 13c.1-.3.1-.7.1-1Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
        <span class="bottom-nav__label">Настройки</span>
      </button>
    </div>
  </nav>



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
