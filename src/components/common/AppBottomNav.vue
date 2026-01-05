<template>
  <q-footer class="mt-auto rounded-[28px] bottom-nav px-2 py-2 ">
    <q-tabs
      class="bottom-nav__group rounded-[22px] px-1 py-1 flex items-stretch"
      dense
      align="justify"
    >
      <q-route-tab :to="{ name: 'home' }" icon="departure_board" label="Главная"   class="bottom-nav__item flex-1 flex flex-col items-center justify-center  py-2 " />
      <q-route-tab :to="{ name: 'buses' }" icon="directions_bus" label="Автобусы"  class="bottom-nav__item flex-1 flex flex-col items-center justify-center  py-2" />
      <q-route-tab :to="{ name: 'taxi' }" icon="local_taxi"      label="Такси"     class="bottom-nav__item flex-1 flex flex-col items-center justify-center  py-2" />
      <q-route-tab :to="{ name: 'settings' }" icon="settings"    label="Настройки" class="bottom-nav__item flex-1 flex flex-col items-center justify-center  py-2" />
    </q-tabs>
  </q-footer>
</template>


