<template>
  <header class="relative">
    <h1 class="home-title">
      Когда мой<br />автобус?
    </h1>
    <p class="mt-3 text-[16px] md:text-[18px] leading-snug text-[#003b7a]/85 ">
      Выберите направление<br />и маршрут
    </p>

    <!-- Автобус справа вверху -->
    <div class="absolute -top-1 right-2 w-[160px] xs:w-[170px] md:w-[190px] h-[100px] mt-3">
      <img :src="bgUrl" alt="Автобус" class="w-full h-full object-contain drop-shadow-xl" />
    </div>
  </header>
</template>

<script setup>
import bgUrl from 'src/assets/bus.png'
</script>
