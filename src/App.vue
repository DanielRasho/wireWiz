<script setup>
import NumberInput from './components/atoms/numberInput.vue'
import selectField from './components/atoms/selectField.vue'
import buttonPush from './components/atoms/buttonPush.vue'
import numberInputAdvanced from './components/molecules/numberInputAdvanced.vue'
import sideBar from './components/organisms/sideBar.vue'
import numberText from './components/atoms/numberText.vue'
import simulationDisplay from './components/organisms/simulationDisplay.vue'
import { computed, ref, toRaw } from 'vue'
import { EMPTY_CONTEXT } from './lib/SimulationContext'
import {
  WireMaterial,
  WIRE_MATERIALS,
  diameterUnits
} from './lib/WireMaterials'
import { SimulationEngine } from './lib/SimulationEngine'

const isSimulationOn = ref(false)

const context = ref(Object.assign({}, EMPTY_CONTEXT))

const engine = ref(new SimulationEngine())

const clearSignal = ref(false)

const materialsList = Object.values(WIRE_MATERIALS).map((material) => {
  const materialDensity = parseFloat(
    material.chargeDensity.value
  ).toExponential(3)
  return `${material.name} (${materialDensity} ${material.chargeDensity.unit})`
})

function startSimulation() {
  console.log(context)
  // Check if all fields are fulfilled.
  if (
    context.value.diameter.value == '' ||
    context.value.length.value == '' ||
    context.value.voltage.value == '' ||
    context.value.material.name == ''
  ) {
    alert('All fields must be filled >:[')
  } else {
    isSimulationOn.value = true
    engine.value.calculateFields(toRaw(context.value))
  }
}

function endSimulation() {
  isSimulationOn.value = false
}

/**
 * Sends signal to inputs to clear themselves.
 */
function clearSignalOn() {
  clearSignal.value = true
}

/**
 * Restablish clear signal to false, so it can be sent again in the future.
 */
function clearSignalOff() {
  console.log(context.value)
  clearSignal.value = false
}

const showInputBar = computed(() => {
  return isSimulationOn.value == true ? false : true
})

const showOutputBar = computed(() => {
  return isSimulationOn.value == true ? true : false
})

/**
 * Recives a selected value from select-field tag, and search
 * the Wire material that matches the given value.
 * @param {String} selectedOption
 * @returns {WireMaterial} Matching material from WireMaterials Enum.
 */
function getMaterialFromName(event) {
  let materialName = event.split(' ')[0]
  context.value.material = Object.values(WIRE_MATERIALS).find(
    (o) => o.name == materialName
  )
}
</script>

<template>
  <div id="window">
    <side-bar :is-visible="showInputBar">
      <h1 class="font-title">Properties</h1>
      <number-input class="input" label="Length" unit="m" :clear="clearSignal" @field-updated="(n) => {
        context.length = n
      }
        " @clear-succesful="clearSignalOff" />
      <number-input-advanced class="input" label="Diameter" :units="Object.values(diameterUnits)" :clear="clearSignal"
        @field-updated="(n) => {
          context.diameter = n
          console.log(context)
        }
          " @clear-succesful="clearSignalOff" />
      <number-input class="input" label="Voltage" unit="V" :clear="clearSignal" @field-updated="(n) => {
        context.voltage = n
      }
        " @clear-succesful="clearSignalOff" />
      <select-field class="input" label="Material" :options="materialsList" :clear="clearSignal"
        @field-updated="getMaterialFromName" @clear-succesful="clearSignalOff" />
      <button-push class="submit-btn" width="25ch" @click="startSimulation">
        Simulate <i class="fa-solid fa-play"></i>
      </button-push>
      <button-push class="clear-btn" width="25ch" @click="clearSignalOn">
        Clear <i class="fa-solid fa-trash"></i>
      </button-push>
    </side-bar>
    <main>
      <simulation-display :sim-info="engine" :is-simulation-on="isSimulationOn" />
    </main>
    <side-bar :is-visible="showOutputBar">
      <h1 class="font-title">Technical Info</h1>
      <number-text class="input" label="Resistance" :text="engine.resistance" unit="Ohms" />
      <number-text class="input" label="Current" :text="engine.electricCurrent" unit="A" />
      <number-text class="input" label="Power" :text="engine.power" unit="W" />
      <number-text class="input" label="Drag Speed" :text="engine.dragVelocity" unit="m/s" />
      <number-text class="input" label="Travel time" :text="engine.electronTravelTime" unit="min" />

      <button-push class="stop-btn" width="25ch" @click="endSimulation">
        Stop <i class="fa-solid fa-pause"></i>
      </button-push>
    </side-bar>
  </div>
</template>

<style scoped>
#window {
  display: flex;
  justify-content: space-between;
}

main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.input {
  margin-top: 3ch;
}

.submit-btn,
.stop-btn,
.clear-btn {
  margin-top: 10ch;
  align-self: center;
}

.submit-btn :deep(.front) {
  background-color: var(--green-accent);
  border: 7px solid var(--green-accent-dark);
  color: var(--on-green-accent);
}

.submit-btn :deep(.front) i {
  color: var(--on-green-accent);
}

.submit-btn :deep(.edge) {
  background-color: rgb(35, 60, 35);
}

.stop-btn :deep(.front) i,
.clear-btn :deep(.front) i {
  color: var(--on-orange-accent);
}
</style>
