<template>
  <div id="stop-modal" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true"
       aria-labelledby="stop-modal-title">
    <!-- Backdrop -->
    <div id="stop-modal-backdrop" class="absolute inset-0 bg-black/35 backdrop-blur-[2px]"></div>

    <!-- Bottom sheet -->
    <div class="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-4 pb-4">
      <div class="stop-sheet relative rounded-[28px] border border-white/25
             bg-white/20 backdrop-blur-xl overflow-hidden">
        <!-- Handle -->
        <div class="pt-3 flex justify-center">
          <div class="h-1.5 w-12 rounded-full bg-white/40"></div>
        </div>

        <!-- Header -->
        <div class="px-5 pt-3 pb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="stop-modal-title" class="text-[18px] font-extrabold text-white drop-shadow">
              Выберите остановку
            </h2>
            <p class="mt-1 text-[13px] text-white/85">
              Поиск по названию
            </p>
          </div>

          <button id="stop-modal-close" type="button"
                  class="stop-close-btn shrink-0 rounded-[14px] px-3 py-2 text-white/90" aria-label="Закрыть">
            ✕
          </button>
        </div>

        <!-- Search -->
        <div class="px-5 pb-4">
          <div class="relative">
            <input id="stop-search" type="text" class="w-full rounded-[18px] bg-white/90 px-4 py-3 pr-10 text-[15px] font-semibold text-[#0b2540]
                   shadow-[0_14px_24px_rgba(0,0,0,0.18)] outline-none"
                   placeholder="Например: вокзал, площадь, университет…" autocomplete="off" />
            <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#003b7a]/60">
                  🔎
                </span>
          </div>
        </div>

        <!-- List -->
        <div class="px-3 pb-4">
          <div id="stop-list" class="stop-list max-h-[340px] overflow-auto overscroll-contain px-2">
            <!-- items will be injected -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//
</script>
