<template>
  <div>
    <div class="inputBox">
      <input
        class="font-body"
        type="text"
        required="required"
        @blur="updateValue"
        v-model="displayValue"
        :readonly="disabled"
      />
      <span class="field-label font-label"> {{ label }} </span>
      <span v-if="props.unit.length != 0" class="field-unit font-label">
        {{ unit }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, watch } from 'vue'
import { SimulationMagnitude } from '../../lib/SimulationMagnitud'

/** Value to display */
const displayValue = ref('')
/** The source of true, dictates the real stored value */
const currentValue = ref('')

onMounted(() => {
  displayValue.value = props.initialValue
  currentValue.value = props.initialValue
})

const emit = defineEmits(['fieldUpdated', 'clearSuccesful'])

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

  initialValue: {
    required: false,
    type: String,
    default: ''
  },

  width: {
    required: false,
    type: String,
    default: '30ch'
  },

  disabled: {
    required: false,
    type: Boolean,
    default: false
  },

  /** Works as a signal,
   * when True: clear the input values.
   * IMPORTANT : Must be set to false again by parent if want to reset again
   * when False: Do nothing */
  clear: {
    required: false,
    type: Boolean,
    default: false
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
 * Watches for changes in currentValue (Source of truth). And emits the
 * the signal to parent component the input value has changed.
 */
watch(currentValue, (newVal, oldVal) => {
  emit('fieldUpdated', new SimulationMagnitude(newVal, props.label, props.unit))
})

/**
 * Watches the clear prop. If the clear signal is on, it forces the currentValue
 * and displayValue to empty themselves: Clearing the info.
 * Emits the signal that values were succesfully cleared.
 */
watch(
  () => props.clear,
  (newClearSignal, oldClearSignal) => {
    if (newClearSignal == true) {
      console.log('RESET SIGNAL!')
      displayValue.value = ''
      currentValue.value = ''
      emit('clearSuccesful')
    }
  }
)

/**
 * Check if value written by user is valid, if not return it to the last valid value
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
  }
}
</script>

<style scoped>
.inputBox {
  position: relative;
  width: 30ch;
  display: inline-block;
}

.inputBox input {
  width: v-bind(width);
  padding: 1.2ch;
  border: 1px solid var(--outline);
  background: var(--background);
  border-radius: 5px;
  outline: none;
  color: text;
  transition: 0.5s;
}

.inputBox input:valid,
.inputBox input:focus {
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

.inputBox input:valid ~ .field-label,
.inputBox input:focus ~ .field-label {
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

.inputBox input:valid ~ .field-unit,
.inputBox input:focus ~ .field-unit {
  color: var(--primary);
}
</style>
