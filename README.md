# Dice

A small Vue 3 dice roller library with a component and a function API.

## Install

```bash
npm install @jwyxym/dice
```

## Usage

```ts
import { rollDice } from 'dice'
import 'dice/style.css'

const result = await rollDice({
  sides: 6,
  result: 4,
  duration: 1000,
  stay: 600,
  size: 80,
  diceColor: '#ffffff',
  dotColor: '#111111',
})
```

You can also use the Vue component directly:

```vue
<script setup lang="ts">
import { DiceRoller } from 'dice'
import 'dice/style.css'
</script>

<template>
  <DiceRoller :sides="6" :result="3" :size="100" dice-color="#fff" dot-color="#111" />
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sides` | `number` | `6` | Dice sides. |
| `result` | `number` | random | Final result. |
| `duration` | `number` | `1000` | Rolling duration in ms. |
| `stay` | `number` | `0` | Time to keep the final dice visible after rolling in ms. Only used by `rollDice`. |
| `size` | `number` | `120` | Dice width and height in px. |
| `diceColor` | `string` | `#b9e33c` | Dice color. |
| `dotColor` | `string` | `#344515` | Dot and number color. |
