<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="css">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  display: flex;
  height: 100%;
}

body,
html {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  height: 100vh;
  width: 100vw;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style-type: none;
}
</style>
