<script setup lang="ts">
import { computed, ref } from 'vue'
import DiceRoller from './components/DiceRoller.vue'
import { rollDice } from './dice'

const sides = ref(6)
const result = ref<number | undefined>()
const lastResult = ref<number | null>(null)
const previewResult = computed<number | undefined>(() => result.value)

async function openDice() {
  lastResult.value = await rollDice({
    sides: sides.value,
    result: result.value,
    stay: 1000,
    size: 80,
    diceColor: 'white',
    dotColor: 'black'
  })
}
</script>

<template>
  <main>
    <DiceRoller :sides="sides" :result="previewResult" :size="150" />
    <div class="controls">
      <select v-model.number="sides" aria-label="骰子面数">
        <option v-for="n in [4, 6, 8, 10, 12, 20]" :key="n" :value="n">D{{ n }}</option>
      </select>
      <select v-model.number="result" aria-label="骰子结果">
        <option :value="undefined">随机</option>
        <option v-for="n in sides" :key="n" :value="n">{{ n }}</option>
      </select>
      <button type="button" @click="openDice">函数调用</button>
    </div>
    <small v-if="lastResult !== null">{{ lastResult }}</small>
  </main>
</template>

<style>
:root { background: transparent; font-family: system-ui, sans-serif; }
body { min-width: 320px; min-height: 100vh; margin: 0; }
main { display: grid; min-height: 100vh; place-content: center; justify-items: center; gap: 28px; background: transparent; }
.controls { display: flex; gap: 8px; }
select, button { padding: 8px 12px; color: #263018; background: #f4fbdc; border: 1px solid #b9d56d; border-radius: 7px; font: inherit; cursor: pointer; }
button { background: #c8ef4b; font-weight: 600; }
small { color: #56633d; }
</style>
