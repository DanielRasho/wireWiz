<script setup>
import NumberInput from './components/atoms/numberInput.vue'
import selectField from './components/atoms/selectField.vue'
import buttonPush from './components/atoms/buttonPush.vue'
import numberInputAdvanced from './components/molecules/numberInputAdvanced.vue'
import switchButton from './components/atoms/switchButton.vue'
import sideBar from './components/organisms/sideBar.vue'
import numberText from './components/atoms/numberText.vue'
import simulationDisplay from './components/organisms/simulationDisplay.vue'
import numberDisplay from './components/atoms/numberDisplay.vue'
import { computed, ref, toRaw } from 'vue'
import { EMPTY_CONTEXT } from './lib/SimulationContext'
import {
  WireMaterial,
  WIRE_MATERIALS,
  diameterUnits
} from './lib/WireMaterials'
import { SimulationEngine } from './lib/SimulationEngine'
import { AWGToMeters } from './lib/Utils'
import NoneLogo from './assets/none.jpg'
import AluminumLogo from './assets/aluminumLogo.png'
import CopperLogo from './assets/copperLogo.png'
import GoldLogo from './assets/goldLogo.png'
import SilverLogo from './assets/silverLogo.png'
import GraphiteLogo from './assets/graphiteLogo.png'

const isSimulationOn = ref(false)

const context = ref(Object.assign({}, EMPTY_CONTEXT))

const engine = ref(new SimulationEngine())

const clearSignal = ref(false)

const materialImage = ref(NoneLogo)

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
  clearSignal.value = false
  materialImage.value = NoneLogo
}

const showInputBar = computed(() => {
  return !isSimulationOn.value
})

const showOutputBar = computed(() => {
  return isSimulationOn.value
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

  switch (materialName) {
    case 'Gold':
      materialImage.value = GoldLogo
      break
    case 'Silver':
      materialImage.value = SilverLogo
      break
    case 'Copper':
      materialImage.value = CopperLogo
      break
    case 'Aluminum':
      materialImage.value = AluminumLogo
      break
    case 'Graphite':
      materialImage.value = GraphiteLogo
      break
    case '':
      materialImage.value = GraphiteLogo
    default:
      materialImage.value = NoneLogo
      break
  }
}

const flickWalkingSimulation = (value) => {
  engine.value.setSimulationType(value)
}
</script>

<template>
  <div id="window">
    <side-bar :is-visible="showInputBar">
      <h1 class="font-title">Properties</h1>
      <number-input
        class="input"
        label="Length"
        unit="m"
        :clear="clearSignal"
        @field-updated="
          (n) => {
            context.length = n
          }
        "
        @clear-succesful="clearSignalOff"
      />
      <number-input-advanced
        class="input"
        label="Diameter"
        :units="Object.values(diameterUnits)"
        :clear="clearSignal"
        @field-updated="
          (n) => {
            context.diameter = n
          }
        "
        @clear-succesful="clearSignalOff"
      />
      <number-input
        class="input"
        label="Voltage"
        unit="V"
        :clear="clearSignal"
        @field-updated="
          (n) => {
            context.voltage = n
          }
        "
        @clear-succesful="clearSignalOff"
      />
      <select-field
        class="input"
        label="Material"
        :options="materialsList"
        :clear="clearSignal"
        @field-updated="getMaterialFromName"
        @clear-succesful="clearSignalOff"
      />
      <switch-button
        class="input"
        @switch-updated="flickWalkingSimulation"
        :clear="clearSignal"
        @clear-succesful="clearSignalOff"
      />
      <button-push class="submit-btn" width="25ch" @click="startSimulation">
        Simulate <i class="fa-solid fa-play"></i>
      </button-push>
      <button-push class="clear-btn" width="25ch" @click="clearSignalOn">
        Clear <i class="fa-solid fa-trash"></i>
      </button-push>
    </side-bar>
    <main>
      <number-display
        :class="'left'"
        :value="-context.voltage.value"
        postfix="V"
      />
      <number-display
        :class="'right'"
        :value="context.voltage.value"
        postfix="V"
      />
      <p class="info font-subtitle">
        Length: {{ context.length.value.toExponential(3)
        }}{{ context.length.unit }}, Diameter:
        {{
          (context.diameter.unit === diameterUnits.AWG
            ? AWGToMeters(context.diameter.value)
            : context.diameter.value
          ).toExponential(3)
        }}mm²
      </p>
      <simulation-display
        :sim-info="engine"
        :is-simulation-on="isSimulationOn"
        class="display"
      />
      <img :src="materialImage" class="material" />
    </main>
    <side-bar :is-visible="showOutputBar">
      <h1 class="font-title">Technical Info</h1>
      <number-text
        class="input"
        label="Resistance"
        :text="engine.resistance"
        unit="Ohms"
      />
      <number-text
        class="input"
        label="Current"
        :text="engine.electricCurrent"
        unit="A"
      />
      <number-text class="input" label="Power" :text="engine.power" unit="W" />
      <number-text
        class="input"
        label="Drag Speed"
        :text="engine.dragVelocity"
        unit="m/s"
      />
      <number-text
        class="input"
        label="Travel time"
        :text="engine.electronTravelTime"
        unit="min"
      />

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
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 10% 10% 50% 20% 10%;
  grid-template-areas:
    '. . .'
    'info info info'
    'left display right'
    '. material .'
    '. . .';
  position: relative;
  width: 100%;
}

.info {
  grid-area: info;
  justify-self: center;
  align-self: end;
}

.left {
  grid-area: left;
}

.right {
  grid-area: right;
}

.display {
  grid-area: display;
  align-self: center;
}

.material {
  grid-area: material;
  justify-self: center;
  align-self: center;
  height: 100%;
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
