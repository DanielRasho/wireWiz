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
import { ref, defineEmits, onMounted, computed } from 'vue'
import { SimulationMagnitude } from '../../lib/model'

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
  },

  /**
   * Must be a Predicate (Function that recives a value and return a boolean) :
   * Used for for double-cheking if input is correct
   * if not, will return tu last value correct value.
   */
  guardInput: {
    required: false,
    type: Function,
    default: (_) => {
      return false
    }
  }
})

/**
 * Check if value is valid, if not return it to the last valid value
 * stored in currentValue, otherwise emit the <fieldUpdate> event.
 * @param {*} event input value after user exit writting
 */
function updateValue(event) {
  let futureValue = event.target.value
  if (Number.isNaN(parseFloat(futureValue)) || props.guardInput(futureValue)) {
    console.log(`Not valid value for ${props.label}`)
    displayValue.value = currentValue.value
  } else {
    console.log(`Valid value for ${props.label}`)
    currentValue.value = parseFloat(futureValue)
    emit(
      'fieldUpdated',
      new SimulationMagnitude(currentValue.value, props.label, props.unit)
    )
  }
}
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
