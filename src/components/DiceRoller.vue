<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  sides?: number
  result?: number
  duration?: number
  size?: number
  diceColor?: string
  dotColor?: string
}>(), { sides: 6, duration: 1000, size: 120, diceColor: '#b9e33c', dotColor: '#344515' })

const emit = defineEmits<{ complete: [value: number] }>()
const value = ref(1)
const rolling = ref(true)
let ticker: ReturnType<typeof setInterval> | undefined
let timer: ReturnType<typeof setTimeout> | undefined

const sides = computed(() => Math.max(2, Math.floor(props.sides)))
const result = computed(() => props.result == null
  ? Math.floor(Math.random() * sides.value) + 1
  : Math.min(sides.value, Math.max(1, Math.round(props.result))))
const dots = computed(() => Array.from({ length: value.value }, (_, index) => index))
const isD6 = computed(() => sides.value === 6 && value.value <= 6)

function clearTimers() {
  if (ticker) clearInterval(ticker)
  if (timer) clearTimeout(timer)
}

function roll() {
  clearTimers()
  rolling.value = true
  value.value = Math.floor(Math.random() * sides.value) + 1
  ticker = setInterval(() => { value.value = Math.floor(Math.random() * sides.value) + 1 }, 70)
  timer = setTimeout(() => {
    clearTimers()
    value.value = result.value
    rolling.value = false
    emit('complete', value.value)
  }, props.duration)
}

onMounted(roll)
watch([() => props.sides, () => props.result], roll)
onBeforeUnmount(clearTimers)
</script>

<template>
  <div class="dice-wrap" :style="{ width: `${size}px`, height: `${size}px` }" aria-label="骰子">
    <div class="cube" :class="{ rolling }" :style="{ width: `${size}px`, height: `${size}px`, '--half-size': `${size / 2}px`, '--dice-color': diceColor, '--dot-color': dotColor }">
      <div v-for="face in ['front', 'back', 'right', 'left', 'top', 'bottom']" :key="face" class="face" :class="face">
        <div v-if="face === 'front' && isD6" class="dots"><i v-for="dot in dots" :key="dot" /></div>
        <span v-else-if="face === 'front'">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dice-wrap { display: inline-grid; place-items: center; perspective: 650px; }
.cube { position: relative; transform: rotate(-12deg) rotateX(-8deg) rotateY(-12deg); transform-style: preserve-3d; }
.face { position: absolute; display: grid; width: 100%; height: 100%; place-items: center; color: var(--dot-color); background: var(--dice-color); border: 1px solid rgba(255,255,255,.72); box-shadow: inset -10px -12px 18px rgba(70,105,8,.18), inset 8px 8px 15px rgba(255,255,255,.35); backface-visibility: hidden; }
.front { transform: translateZ(var(--half-size)); }
.back { transform: rotateY(180deg) translateZ(var(--half-size)); filter: brightness(.76); }
.right { transform: rotateY(90deg) translateZ(var(--half-size)); filter: brightness(.88); }
.left { transform: rotateY(-90deg) translateZ(var(--half-size)); filter: brightness(.7); }
.top { transform: rotateX(90deg) translateZ(var(--half-size)); filter: brightness(1.08); }
.bottom { transform: rotateX(-90deg) translateZ(var(--half-size)); filter: brightness(.66); }
.rolling { animation: roll .7s linear infinite; }
.dots { display: grid; width: 58%; height: 58%; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 1fr; gap: 6px; align-items: center; justify-items: center; transform: rotate(12deg); }
.dots i { width: 13px; height: 13px; border-radius: 50%; background: var(--dot-color); }
.face > span { font-size: 50px; font-weight: 800; transform: rotate(12deg); }
@keyframes roll { 0% { transform: rotate(-12deg) rotateX(-8deg) rotateY(-12deg); } 100% { transform: rotate(708deg) rotateX(712deg) rotateY(708deg); } }
</style>
