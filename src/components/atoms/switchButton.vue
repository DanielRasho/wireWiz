<template>
  <div class="container">
    <label class="switch-label font-body">{{ label }}</label>
    <input type="checkbox" class="theme-checkbox" v-model="currentValue" />

    <tool-tip
      message="Activate to watch a more aproximate representation of electron movement along a wire."
    ></tool-tip>
  </div>
</template>

<script setup>
import toolTip from './toolTip.vue'
import { ref, onMounted, watch } from 'vue'

/** The source of true, dictates the real stored value */
const currentValue = ref(false)

const emit = defineEmits(['switchUpdated', 'clearSuccesful'])

onMounted(() => {
  currentValue.value = props.initialValue
})

const props = defineProps({
  initialValue: {
    required: true,
    type: Boolean,
    default: false
  },
  label: {
    required: true,
    type: String,
    default: 'Random Walking'
  },
  width: {
    required: false,
    type: String,
    default: '30ch'
  },
  /** Works as a signal,
   * when True: clear the input values.
   * IMPORTANT : Must be set to false again by parent if want to reset again
   * when False: Do nothing */
  clear: {
    required: false,
    type: Boolean,
    default: false
  }
})

/**
 * Watches for changes in currentValue (Source of truth). And emits the
 * the signal to parent component the input value has changed.
 */
watch(currentValue, (newVal, oldVal) => {
  emit('switchUpdated', newVal)
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
      displayValue.value = false
      currentValue.value = false
      emit('clearSuccesful')
    }
  }
)
</script>

<style scoped>
.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: v-bind(width);
}

.switch-container {
  width: 100%;
}

.switch-label {
  color: var(--outline);
  text-transform: uppercase;
  margin-right: 2ch;
}

.theme-checkbox {
  --toggle-size: 1ch;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 6.25em;
  height: 3.125em;
  background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(50%, var(--background)),
      color-stop(50%, var(--primary))
    )
    no-repeat;
  background: -o-linear-gradient(
      left,
      var(--background) 50%,
      var(--primary) 50%
    )
    no-repeat;
  background: linear-gradient(
      to right,
      var(--background) 50%,
      var(--primary) 50%
    )
    no-repeat;
  background-size: 205%;
  background-position: 0;
  -webkit-transition: 0.4s;
  -o-transition: 0.4s;
  transition: 0.4s;
  border: 2px solid var(--outline);
  border-radius: 99em;
  position: relative;
  cursor: pointer;
  font-size: var(--toggle-size);
  margin-right: 2ch;
}

.theme-checkbox::before {
  content: '';
  width: 2.25em;
  height: 2.25em;
  position: absolute;
  /* Center align vertically */
  top: 50%;
  transform: translateY(-50%);
  left: 0.438em;
  background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(50%, var(--outline)),
      color-stop(50%, var(--primary))
    )
    no-repeat;
  background: -o-linear-gradient(
      left,
      var(--background) 50%,
      var(--primary) 50%
    )
    no-repeat;
  background: linear-gradient(
      to right,
      var(--background) 50%,
      var(--primary) 50%
    )
    no-repeat;
  background-size: 205%;
  background-position: 100%;
  border-radius: 50%;
  -webkit-transition: 0.4s;
  -o-transition: 0.4s;
  transition: 0.4s;
}

.theme-checkbox:checked::before {
  left: calc(100% - 2.25em - 0.438em);
  background-position: 0;
}

.theme-checkbox:checked {
  background-position: 100%;
  border: 0 solid var(--outline);
}

.tooltip {
  position: absolute;
  right: 0;
  top: 25%;
  transform: translateX(100%);
}
</style>
