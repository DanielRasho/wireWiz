<template>
  <div class="sidebar" :class="{ active: isVisible }">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<style scoped>
.sidebar {
  height: 100vh;
  width: 0;
  padding: 0;

  background-color: var(--background);
  border-right: 1px solid black;

  display: flex;
  flex-direction: column;
  align-items: start;

  transition: 0.3s ease-in-out;
}

.active {
  width: 38ch;
  padding: 3ch;
}
</style>
