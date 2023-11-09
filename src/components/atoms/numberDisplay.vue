<template>
  <div class="displayContainer">
    <span v-if="props.value >= 0" class="plus font-title"
      >+{{ props.value }}{{ props.postfix }}</span
    >
    <span v-if="props.value < 0" class="minus font-title"
      >{{ props.value }}{{ props.postfix }}</span
    >
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  value: {
    required: true,
    type: Number,
    default: 0
  },
  postfix: {
    required: false,
    type: String,
    default: ''
  },
  positiveColor: {
    required: false,
    type: String,
    default: 'var(--primary)'
  },
  negativeColor: {
    required: false,
    type: String,
    default: 'var(--on-info)'
  }
})

const positiveColor = ref(props.positiveColor)
const negativeColor = ref(props.negativeColor)
</script>

<style scoped>
.displayContainer {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
}

.plus {
  color: v-bind(positiveColor);
}

.minus {
  color: v-bind(negativeColor);
}
</style>
