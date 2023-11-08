<template>
  <div class="sidebar" :class="{ active: isVisible }">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isVisible: {
    required: true,
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.sidebar {
  height: 100vh;

  padding: 0;
  width: 0;
  min-width: 0;

  background-color: var(--background);
  border-right: 1px solid black;
  border-left: 1px solid black;

  display: flex;
  flex-direction: column;
  align-items: start;
  transition: 0.5s ease-in-out;

  overflow: hidden;
}

.active {
  padding: 3ch;
  width: 38ch;
  min-width: 38ch;
  overflow: visible;
}
</style>
