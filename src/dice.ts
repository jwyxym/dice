import { createApp, h } from 'vue'
import DiceRoller from './components/DiceRoller.vue'

export interface DiceOptions {
  sides?: number
  result?: number
  duration?: number
  size?: number
  diceColor?: string
  dotColor?: string
  /** 动画结束后保留最终骰面的时间，单位 ms。 */
  stay?: number
  title?: string
  description?: string
}

/** 打开一个骰子动画，并在动画结束后返回点数。 */
export function rollDice(options: DiceOptions = {}): Promise<number> {
  const sides = Math.max(2, Math.floor(options.sides ?? 6))
  const result = options.result == null ? undefined : Math.min(sides, Math.max(1, Math.round(options.result)))

  return new Promise((resolve) => {
    const host = document.createElement('div')
    host.className = 'dice-service-host'
    Object.assign(host.style, { position: 'fixed', inset: '0', zIndex: '9999', display: 'grid', placeItems: 'center', pointerEvents: 'none' })
    document.body.appendChild(host)

    let settled = false
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    const app = createApp({
      render: () => h(DiceRoller, { ...options, sides, result, onComplete: finish }),
    })

    function finish(value?: number) {
      if (settled || value === undefined) return
      settled = true
      holdTimer = setTimeout(() => {
        resolve(value)
        app.unmount()
        host.remove()
      }, Math.max(0, options.stay ?? 0))
    }

    app.mount(host)
  })
}

export default rollDice
