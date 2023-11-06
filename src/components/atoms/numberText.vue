<template>
  <div>
    <div class="inputBox">
      <span
        class="font-body text-container"
        :class="{ 'text-container-filled': !isEmpty }"
      >
        {{ text }}
      </span>
      <span
        class="field-label font-label"
        :class="{ 'field-label-filled': !isEmpty }"
      >
        {{ label }}
      </span>
      <span
        v-if="unit.length != 0"
        class="field-unit font-label"
        :class="{ 'field-unit-filled': !isEmpty }"
      >
        {{ unit }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, computed } from 'vue'

const emit = defineEmits(['fieldUpdated'])

const isEmpty = computed(() => {
  return props.text.length == 0
})

const props = defineProps({
  label: {
    required: true,
    type: String,
    default: 'Label'
  },

  unit: {
    required: false,
    type: String,
    default: ''
  },

  text: {
    required: false,
    type: String,
    default: ''
  },

  width: {
    required: false,
    type: String,
    default: '30ch'
  }
})
</script>

<style scoped>
.inputBox {
  position: relative;
  width: 30ch;
  display: inline-block;
}

.text-container {
  display: inline-block;
  width: v-bind(width);
  height: 4.5ch;
  padding: 1.2ch;
  border: 1px solid var(--outline);
  background: var(--background);
  border-radius: 5px;
  outline: none;
  color: text;
  transition: 0.5s;
}

.text-container-filled {
  border: 1px solid var(--primary);
}

.field-label {
  position: absolute;
  left: 0px;
  /* Center align vertically */
  top: 50%;
  transform: translateY(-50%);

  padding: 2ch 2ch;
  pointer-events: none;
  color: var(--outline);
  text-transform: uppercase;

  transition: 0.5s;
}

.field-label-filled {
  color: var(--primary);
  top: 0;
  transform: translateX(1rem) translateY(-50%);
  padding: 0 2ch;
  background: var(--background);
  border-left: 1px solid var(--primary);
  border-right: 1px solid var(--primary);
  letter-spacing: 0.2em;
}

.field-unit {
  position: absolute;
  right: 1.6ch;
  /* Center align vertically */
  top: 50%;
  transform: translateY(-50%);

  padding: 1ch;
  color: var(--outline);
  background: var(--background);

  transition: 0.5s;
}

.field-unit-filled {
  color: var(--primary);
}
</style>
