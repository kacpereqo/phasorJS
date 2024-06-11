<template>
  <main class="home-view">
    <canvas
      width="300"
      height="300"
      ref="canvas"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @wheel="onWheel"
    >
    </canvas>
    <div class="zoom">
      <input type="range" min="0" max="360" @input="onSliderChange" />
      />
      <button @click="zoomIn">+</button>
      <button @click="rotationAnimation += 1">-</button>
      <button @click="resetZoom">Reset</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)

const rotationAnimation = ref(0)

const gridColor = 'gray'
const bacakgroundColor = 'white'

let cellSize = 20

let zoom = 1

interface Vector {
  lenght: number
  rotation: number
  attachedTo: Vector | null
  color?: string
}

interface Position {
  x: number
  y: number
}

function calculatePosition(vector: Vector) {
  let position: Position = { x: 0, y: 0 }

  // for (;;) {
  //   if (vector.attachedTo === null) {
  //     break
  //   } else {
  //     const rotationInRadians =
  //       ((vector.attachedTo.rotation + rotationAnimation.value) * Math.PI) / 180
  //     const x = position.x + vector.attachedTo.lenght * Math.cos(rotationInRadians)
  //     const y = position.y + vector.attachedTo.lenght * Math.sin(rotationInRadians)
  //     position = { x, y }
  //     vector = vector.attachedTo
  //   }
  // }
  return {
    x: position.x * zoom,
    y: position.y * zoom
  }
}

let VectorArray = ref<Vector[]>([{ lenght: 200, rotation: 90, attachedTo: null, color: 'red' }])
VectorArray.value.push({
  lenght: 100,
  rotation: 45,
  attachedTo: VectorArray.value[0],
  color: 'blue'
})

function onSliderChange(event: Event) {
  const target = event.target as HTMLInputElement
  rotationAnimation.value = parseInt(target.value)
}

function drawVector(ctx: CanvasRenderingContext2D, vector: Vector, rotationAnimation: number) {
  // center X round to the nearest cell

  if (!canvas.value) return
  if (!ctx) return

  ctx.strokeStyle = vector.color || 'black'

  const rotationInRadians = ((vector.rotation + rotationAnimation) * Math.PI) / 180

  let x = canvas.value.width / 2 / (cellSize * zoom)
  let y = canvas.value.height / 2 / (cellSize * zoom)

  if (!isZooming) {
    x = Math.floor(x)
    y = Math.floor(y)
  }

  x = x * cellSize * zoom
  y = y * cellSize * zoom

  x += offsetX
  y += offsetY

  // const startPostion = calculatePosition(vector)

  const startPostion = { x, y }

  ctx.beginPath()
  ctx.moveTo(startPostion.x + x, startPostion.y + y)

  const addX = vector.lenght * Math.cos(rotationInRadians) * zoom
  const addY = vector.lenght * Math.sin(Math.abs(rotationInRadians)) * zoom

  ctx.lineTo(x + addX, y + addY)

  // draw arrow head
  const arrowHeadSize = 10 * zoom

  const angle = Math.atan2(addY, addX)
  const angle1 = angle - Math.PI / 6
  const angle2 = angle + Math.PI / 6

  const x1 = x + addX - arrowHeadSize * Math.cos(angle1)
  const y1 = y + addY - arrowHeadSize * Math.sin(angle1)

  const x2 = x + addX - arrowHeadSize * Math.cos(angle2)
  const y2 = y + addY - arrowHeadSize * Math.sin(angle2)

  ctx.moveTo(x + addX, y + addY)
  ctx.lineTo(x1, y1)

  ctx.moveTo(x + addX, y + addY)
  ctx.lineTo(x2, y2)

  ctx.stroke()
}

let offsetX = 0
let offsetY = 0

let startOffsetX = 0
let startOffsetY = 0

let isDragging = false

function onWheel(event: WheelEvent) {
  if (event.deltaY > 0) {
    zoomOut()
  } else {
    zoomIn()
  }
}

function onMouseDown(event: MouseEvent) {
  isDragging = true

  startOffsetX = event.offsetX
  startOffsetY = event.offsetY
}

function onMouseMove(event: MouseEvent) {
  if (isDragging) {
    offsetX += event.offsetX - startOffsetX
    offsetY += event.offsetY - startOffsetY

    startOffsetX = event.offsetX
    startOffsetY = event.offsetY
  }
}

function onMouseUp() {
  isDragging = false
}

let isZooming = false

function onWindowResize() {
  if (canvas.value) {
    canvas.value.width = document.body.clientWidth
    canvas.value.height = document.body.clientHeight
    cellSize = canvas.value.width / 10
  }
}

function initEvents() {
  window.addEventListener('resize', onWindowResize)
}

function drawSmallGrid(ctx: CanvasRenderingContext2D) {
  if (!canvas.value) return

  ctx.strokeStyle = gridColor
  ctx.lineWidth = 1

  for (let i = 0; i < canvas.value.width; i += (cellSize / 5) * zoom) {
    ctx.beginPath()
    const start = i + (offsetX % ((cellSize * zoom) / 5))
    const end = canvas.value.height + i

    ctx.moveTo(start, 0)
    ctx.lineTo(start, end)
    ctx.stroke()
  }

  for (let i = 0; i < canvas.value.height; i += (cellSize / 5) * zoom) {
    const start = i + (offsetY % ((cellSize * zoom) / 5))
    const end = canvas.value.width + i
    ctx.beginPath()
    ctx.moveTo(0, start)
    ctx.lineTo(end, start)
    ctx.stroke()
  }
}

function zoomIn() {
  if (canvas.value) {
    isZooming = true
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        zoom *= 1.005
      }, i * 10)
    }
    setTimeout(() => {
      isZooming = false
    }, 100)
  }
}

function zoomOut() {
  if (canvas.value) {
    isZooming = true
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        zoom /= 1.005
      }, i * 10)
    }
    setTimeout(() => {
      isZooming = false
    }, 100)
  }
}

function resetZoom() {
  if (canvas.value) {
    isZooming = true

    const zoomPerIteration = (zoom - 1) / 10
    const offsetXPerIteration = offsetX / 10
    const offsetYPerIteration = offsetY / 10

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        zoom -= zoomPerIteration
        offsetY -= offsetYPerIteration
        offsetX -= offsetXPerIteration
      }, i * 20)
    }
    setTimeout(() => {
      zoom = 1
      offsetX = 0
      offsetY = 0
      isZooming = false
    }, 200)
  }
}

function log(base: number, val: number) {
  return Math.log(val) / Math.log(base)
}

function drawMainAxis(ctx: CanvasRenderingContext2D) {
  if (!canvas.value) return

  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2

  // round 0 to the nearest cell

  let x = canvas.value.width / 2 / (cellSize * zoom)
  let y = canvas.value.height / 2 / (cellSize * zoom)

  x = x * cellSize * zoom
  y = y * cellSize * zoom

  ctx.beginPath()

  ctx.moveTo(x + offsetX, 0)
  ctx.lineTo(x + offsetX, canvas.value.height)

  ctx.moveTo(0, y + offsetY)
  ctx.lineTo(canvas.value.width, y + offsetY)

  ctx.stroke()
}

function drawNumbers(ctx: CanvasRenderingContext2D) {
  if (!canvas.value) return

  ctx.lineWidth = 2

  const zoomFactor = Math.pow(3, log(10, zoom) % 1)

  const lenght = cellSize * zoomFactor

  const axisX = canvas.value.height / 2 // horizontal axis P=(0, axisX)
  const axisY = canvas.value.width / 2 // vertical axis P=(axisY, 0)

  const offsetToAxisX = (axisY - Math.floor(axisX / lenght) * lenght) % lenght
  const offsetToAxisY = (axisX - Math.floor(axisY / lenght) * lenght) % lenght

  for (let i = 0; i <= canvas.value.width; i += lenght) {
    ctx.beginPath()
    const start = i + (offsetX % lenght)
    const end = canvas.value.height

    // ctx.moveTo(start + offsetToAxisX, axisX - 10 + offsetY)
    // ctx.lineTo(start + offsetToAxisX, axisX + 10 + offsetY)

    //draw numbers on x axis

    const axisOffset = Math.floor(canvas.value.width / lenght / 2)

    ctx.font = '16px thin Roboto'
    ctx.strokeText(
      `${(1 / Math.pow(10, Math.floor(log(10, zoom)))) * (Math.floor(i / lenght) - axisOffset - Math.floor(Math.abs(offsetX) / lenght) * sign(offsetX))}`,
      start + offsetToAxisX,
      axisX + 20 + offsetY
    )

    ctx.stroke()
  }
}

function sign(x: number) {
  return x > 0 ? 1 : x < 0 ? -1 : 0
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  if (!canvas.value) return

  ctx.strokeStyle = gridColor
  ctx.lineWidth = 2

  const zoomFactor = Math.pow(3, log(10, zoom) % 1)

  const lenght = cellSize * zoomFactor

  const axisX = canvas.value.height / 2 // horizontal axis P=(0, axisX)
  const axisY = canvas.value.width / 2 // vertical axis P=(axisY, 0)

  const offsetToAxisX = (axisY - Math.floor(axisX / lenght) * lenght) % lenght
  const offsetToAxisY = (axisX - Math.floor(axisY / lenght) * lenght) % lenght

  for (let i = 0; i < canvas.value.width; i += lenght) {
    ctx.beginPath()
    const start = i + (offsetX % lenght)
    const end = canvas.value.height

    ctx.moveTo(start + offsetToAxisX, -start)
    ctx.lineTo(start + offsetToAxisX, end)
    ctx.stroke()
  }

  for (let i = 0; i < canvas.value.height; i += lenght) {
    const start = i + (offsetY % lenght) + offsetToAxisY
    const end = canvas.value.width + offsetToAxisY

    ctx.beginPath()
    ctx.moveTo(0, start)
    ctx.lineTo(end, start)
    ctx.stroke()
  }
}

function fillBackground(ctx: CanvasRenderingContext2D) {
  if (!canvas.value) return

  ctx.fillStyle = bacakgroundColor
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
}

function render() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  fillBackground(ctx)
  drawGrid(ctx)
  // drawSmallGrid(ctx)
  drawMainAxis(ctx)
  // VectorArray.value.forEach((vector) => drawVector(ctx, vector, rotationAnimation.value))
  // rotationAnimation.value += 1
  drawNumbers(ctx)
  requestAnimationFrame(render)
}

onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      canvas.value.height = window.innerHeight
      canvas.value.width = window.innerWidth
      cellSize = canvas.value.width / 10

      initEvents()
      requestAnimationFrame(render)
    }
  }
})
</script>

<style scoped>
.zoom {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 100;
  display: flex;
  flex-direction: column;
}
</style>
