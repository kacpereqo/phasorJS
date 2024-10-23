<template>
  <div id="canvasContainer" ref="canvasContainer">
    <canvas ref="canvas" width="300" height="300" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Drawer } from './Canvas'

const canvas = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLCanvasElement | null>(null)
const drawer = new Drawer()

function initEventListeners(): void {
  window.addEventListener('resize', resize)
}

function resize() {
  if (!canvasContainer.value) return

  let width = canvasContainer.value!.clientWidth
  let height = canvasContainer.value!.clientHeight

  drawer.resize(width, height)
}

onMounted(() => {
  drawer.init(canvas.value!)
  drawer.draw()
  resize()
  initEventListeners()
})
</script>

<style scoped>
#canvasContainer {
  width: 100%;
  height: 100%;
}
</style>
