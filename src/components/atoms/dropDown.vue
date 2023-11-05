<template>
  <div v-if="isActive" class="option">
    <div
      v-for="option in options"
      @click="onSelect(option)"
      :class="{ 'option-active': currentValue == option }"
    >
      {{ option }}
    </div>
  </div>
</template>

<script setup>
function onSelect(selectedOption) {
  emit('optionSelected', selectedOption)
}

const emit = defineEmits(['optionSelected'])

const props = defineProps({
  currentValue: {
    required: true,
    type: String,
    default: ''
  },
  isActive: {
    required: true,
    type: Boolean,
    default: true
  },

  options: {
    required: true,
    type: Array,
    default: ['option1', 'option2', 'option3']
  },

  width: {
    required: false,
    type: String,
    default: '30ch'
  }
})
</script>

<style scoped>
.option {
  position: absolute;
  top: calc(105% + 1rem);
  left: 20%;
  width: v-bind(width);
  background: var(--primary);
  box-shadow:
    rgba(0, 0, 0, 0.8) 0px 19px 38px,
    rgba(0, 0, 0, 0.8) 0px 15px 12px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 200;
}
.option div {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: 0.3s;
}

.option-active,
.option div:hover {
  background-color: var(--text);
  color: var(--primary);
}
</style>
