<template>
  <div>
    <div class="inputBox">
      <input
        class="font-body"
        type="text"
        required="required"
        @blur="updateValue"
        :placeholder="props.placeholder"
        v-model="displayValue"
      />
      <span class="field-label font-label"> {{ label }} </span>
      <span
        v-if="props.units.length != 0"
        class="field-unit font-label"
        @click="showUnitDropDown"
        @optionSelected="updateCurrentUnit"
        v-click-outside-element="hideUnitDropDown"
      >
        {{ currentUnit }}
        <drop-down
          :is-active="isDropDownActive"
          :current-value="currentUnit"
          :options="units"
          @option-selected="changeUnit"
          class="dropdown"
        ></drop-down>
      </span>
    </div>
    <tool-tip
      message="You can change the metric unit by clicking it!"
    ></tool-tip>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import dropDown from '../atoms/dropDown.vue'
import ToolTip from '../atoms/toolTip.vue'

/** Value to display */
const displayValue = ref('')
/** Last valid value */
const currentValue = ref('')

const currentUnit = ref('unit')

const isDropDownActive = ref(false)

const emit = defineEmits(['fieldUpdated'])

function showUnitDropDown() {
  isDropDownActive.value = !isDropDownActive.value
}

function hideUnitDropDown() {
  isDropDownActive.value = false
}

function changeUnit(newUnit) {
  currentUnit.value = newUnit
}

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
      new SimulationMagnitude(
        currentValue.value,
        props.label,
        currentUnit.value
      )
    )
  }
}

onMounted(() => {
  currentUnit.value = props.units[0]
})

const props = defineProps({
  label: {
    required: true,
    type: String,
    default: 'Label'
  },

  units: {
    required: true,
    type: Array,
    default: ['unit1', 'unit2', 'unit3']
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

  cursor: pointer;

  transition: 0.5s;

  z-index: 100;
}

.inputBox input:valid ~ .field-unit,
.inputBox input:focus ~ .field-unit {
  color: var(--primary);
}
.field-unit:hover {
  color: var(--secondary) !important;
}
</style>
