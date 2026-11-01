export function playTone() {
  const Context = window.AudioContext || window.webkitAudioContext
  if (!Context) return
  try {
    const context = new Context()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = 880
    gain.gain.value = 0.05
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.12)
    oscillator.onended = () => context.close()
  } catch {
    /* the browser can block audio until a gesture */
  }
}
