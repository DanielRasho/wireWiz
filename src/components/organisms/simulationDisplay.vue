<template>
  <div id="simulationContainer"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { AnimationEngine } from '../../lib/AnimationEngine'

let engine

onMounted(() => {
  engine = new AnimationEngine(document.getElementById('simulationContainer'))
  engine.start()
})
</script>

<style scoped>
#simulationContainer {
  width: 70%;
  aspect-ratio: 6 / 2;
  border: 1px solid white;
}
</style>
