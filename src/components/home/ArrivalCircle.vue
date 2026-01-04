<template>
  <section class="arrival">
    <div class="arrival__timer timer-wrapper">
      <svg viewBox="0 0 260 260" class="arrival__svg" aria-hidden="true">
        <defs>
          <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#22c55e" />
          </linearGradient>
        </defs>

        <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="12"></circle>

        <circle
          id="timer-ring"
          class="timer-ring"
          cx="130"
          cy="130"
          r="110"
          fill="none"
          stroke="url(#timerGradient)"
          stroke-width="12"
          stroke-linecap="round"
        ></circle>
      </svg>

      <div class="arrival__inner timer-inner-shadow">
        <div class="arrival__inner2"></div>

        <div class="arrival__content">
          <div id="timer-text" class="arrival__time">01:00</div>
          <div class="arrival__unit">МИНУТ</div>
          <div class="arrival__route">Маршрут 16</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
//
</script>
