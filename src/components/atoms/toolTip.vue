<template>
  <i class="fa-regular fa-circle-question tooltip">
    <span> {{ message }} </span>
  </i>
</template>

<script setup>

const props = defineProps({
  message: {
    required: true,
    type: String,
    default: 'This is a help message :)'
  },
  width: {
    required: false,
    type: String,
    default: '20ch'
  }
})
</script>

<style scoped>
.tooltip {
  color: var(--outline);
  font-size: 1.2rem;
  transition: 0.5s;
  position: relative;
}
.tooltip:hover {
  color: var(--on-info);
}

.tooltip span {
  --scale: 0;
  /* Center align vertically */
  position: absolute;
  top: 50%;
  width: v-bind(width);
  padding: 1ch;
  color: var(--on-info);
  background-color: var(--info);
  transform: translateX(2ch) translateY(-50%) scale(var(--scale));
  border-radius: 3px;

  font-family: 'Lexend Deca', sans-serif;
  font-size: 0.8rem;
  font-weight: lighter;

  transition: 0.2s;

  z-index: 100;
}

.tooltip:hover span {
  --scale: 1;
}
</style>
