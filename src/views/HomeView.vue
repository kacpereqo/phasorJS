<template>
  <main id="container">
    <div id="sidebar">
      <CanvasSidebar />
    </div>
    <div id="canvas">
      <CanvasDrawer />
    </div>
  </main>
</template>

<script setup lang="ts">
import CanvasSidebar from '@/components/CanvasSidebar.vue'
import CanvasDrawer from '@/components/CanvasDrawer.vue'
</script>

<style lang="css" scoped>
#container {
  display: flex;
  width: 100%;
  height: 100%;
}

#sidebar {
  width: 200px;
}

#canvas {
  flex: 1;
  max-width: clamp(300px, 100%, 100%);
}
</style>
