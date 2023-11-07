<template>
  <div class="select-field">
    <div class="inputBox" @click="toogleActive">
      <input
        class="font-body"
        :class="{ 'inputBox-active': isFilled || isActive }"
        :value="currentValue"
        type="text"
        required="required"
        value="dff"
        v-click-outside-element="hideDropDown"
        readonly
      />
      <span
        :class="{ 'inputBox-label-active': isFilled || isActive }"
        class="field-label font-label"
      >
        {{ label }}
      </span>
      <i
        :class="{ 'inputBox-arrow-active': isFilled || isActive }"
        class="fa-solid fa-chevron-right field-arrow"
      ></i>
    </div>

    <drop-down
      :current-value="currentValue"
      :is-active="isActive"
      :options="options"
      @option-selected="selectOption"
    ></drop-down>
  </div>
</template>

<script setup>
import { ref, defineEmits, computed, watch } from 'vue'
import dropDown from './dropDown.vue'

const isActive = ref(false)
const currentValue = ref('')
const isFilled = computed(() => {
  return currentValue.value.length != 0 ? true : false
})

function toogleActive() {
  isActive.value = !isActive.value
}

function hideDropDown() {
  isActive.value = false
}

function selectOption(selectedOption) {
  currentValue.value = selectedOption
}

const emit = defineEmits(['fieldUpdated', 'clearSuccesful'])

const props = defineProps({
  label: {
    required: true,
    type: String,
    default: 'Label'
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
  emit('fieldUpdated', newVal)
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
      currentValue.value = ''
      emit('clearSuccesful')
    }
  }
)
</script>

<style scoped>
.select-field {
  position: relative;
  display: inline-block;
}

.inputBox {
  position: relative;
  width: 30ch;
  display: inline-block;
  cursor: pointer !important;
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
  cursor: pointer !important;
}

.inputBox .inputBox-active {
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

.inputBox-label-active {
  color: var(--primary);
  top: 0;
  transform: translateX(1rem) translateY(-50%);
  padding: 0 2ch;
  background: var(--background);
  border-left: 1px solid var(--primary);
  border-right: 1px solid var(--primary);
  letter-spacing: 0.2em;
}

.field-arrow {
  position: absolute;
  right: 1.6ch;
  /* Center align vertically */
  top: 50%;
  transform: translateY(-50%) rotate(0deg);

  padding: 1ch;
  color: var(--outline);

  transition: 0.5s;
}

.inputBox-arrow-active {
  color: var(--primary);
  transform: translateY(-50%) rotate(90deg);
}
</style>
