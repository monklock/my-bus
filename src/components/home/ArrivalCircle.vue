<template>
  <section class="mt-6 flex justify-start">
    <div class="timer-wrapper relative
                 w-[190px] h-[190px]
                 xs:w-[215px] xs:h-[215px]
                 sm:w-[215px] sm:h-[215px]
                 md:w-[220px] md:h-[220px]">
      <!-- SVG-кольцо -->
      <svg viewBox="0 0 260 260" class="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#22c55e" />
          </linearGradient>
        </defs>

        <!-- Бледная подложка под прогресс -->
        <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="12"></circle>

        <!-- Активное кольцо с градиентом -->
        <circle id="timer-ring" class="timer-ring" cx="130" cy="130" r="110" fill="none"
                stroke="url(#timerGradient)" stroke-width="12" stroke-linecap="round"></circle>
      </svg>

      <!-- Внутренний круг -->
      <div
        class="timer-inner-shadow absolute inset-[30px] rounded-full bg-gradient-to-b from-[#e9f2ff] to-[#cde5ff]">
        <div class="absolute inset-[20px] rounded-full bg-gradient-to-b from-[#f3f7ff] to-[#d9e8ff]"></div>

        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div id="timer-text" class="font-extrabold text-[36px] sm:text-[40px] tracking-tight text-[#1d4ed8]">
            01:00
          </div>
          <div class="mt-1 text-[13px] sm:text-[14px] font-semibold uppercase text-[#1d4ed8]/80">
            МИНУТ
          </div>
          <div class="mt-1 text-[14px] sm:text-[15px] font-medium text-[#003b7a]/75">
            Маршрут 16
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
//
</script>
