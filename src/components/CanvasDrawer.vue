<template>
  <div id="sidebar" ref="sidebar">
    <canvas ref="canvas" width="300" height="300" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const sidebar = ref<HTMLCanvasElement | null>(null)

function resize() {
  if (!canvas.value) return
  if (!sidebar.value) return

  canvas.value.width = sidebar.value.parentElement?.clientWidth as number
  canvas.value.height = sidebar.value.parentElement?.clientHeight as number
}

interface Point {
  x: number
  y: number
}

function drawLine(ctx: CanvasRenderingContext2D, start: Point, end: Point): void {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke()
}

function drawHorizontalAxis(ctx: CanvasRenderingContext2D): void {
  drawLine(ctx, { x: -width / 2, y: 0 }, { x: width / 2, y: 0 })
}

function drawVerticalAxis(ctx: CanvasRenderingContext2D): void {
  drawLine(ctx, { x: -width / 2, y: 0 }, { x: width / 2, y: 0 })
}

function draw(): void {
  // draw line from center to top

  if (!canvas.value) return

  let ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.translate(canvas.value.width / 2, canvas.value.height / 2)

  // #### ///

  drawHorizontalAxis(ctx)
  drawVerticalAxis(ctx)
}

function initEventListeners(): void {
  window.addEventListener('resize', () => {
    resize()
    draw()
  })
}

function init() {
  if (!canvas.value) return
  resize()
}

onMounted(() => {
  initEventListeners()
  init()
  draw()
})
</script>

<style scoped></style>
