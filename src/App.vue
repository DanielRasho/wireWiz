<script setup>
import NumberInput from './components/atoms/numberInput.vue'
import selectField from './components/atoms/selectField.vue'
import buttonPush from './components/atoms/buttonPush.vue'
import numberInputdAdvanced from './components/molecules/numberInputAdvanced.vue'
import sideBar from './components/organisms/sideBar.vue'
import numberText from './components/atoms/numberText.vue'
import { computed, ref } from 'vue'
import { SimulationContext } from './lib/SimulationContext'
import { SimulationMagnitude } from './lib/SimulationMagnitud'
import { WireMaterial, WireMaterials, diameterUnits } from './lib/WireMaterials'
import { SimulationEngine } from './lib/SimulationEngine'

const isSimulationOn = ref(false)

const context = ref(
  new SimulationContext(
    new SimulationMagnitude('', 'Length', 'm'),
    new SimulationMagnitude('', 'Diameter', 'm'),
    new SimulationMagnitude('', 'Voltage', 'V'),
    new WireMaterial(
      '',
      new SimulationMagnitude(300, 'Charge Density', '1/m³'),
      new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
    )
  )
)

const engine = ref(new SimulationEngine(context.value))

const materialsList = Object.values(WireMaterials).map(
  (material) => `${material.name} (${material.chargeDensity.unit})`
)

function startSimulation() {
  isSimulationOn.value = true
  engine.value.calculateFields(context.value)
}

function endSimulation() {
  isSimulationOn.value = false
}

const showInputBar = computed(() => {
  return isSimulationOn.value == true ? false : true
})

const showOutputBar = computed(() => {
  return isSimulationOn.value == true ? true : false
})
</script>

<template>
  <div id="window">
    <side-bar :is-visible="showInputBar">
      <h1 class="font-title">Properties</h1>
      <number-input
        class="input"
        label="Length"
        unit="m"
        @field-updated="
          (n) => {
            context.length = n
          }
        "
      />
      <number-inputd-advanced
        class="input"
        label="Diameter"
        :units="Object.values(diameterUnits)"
        @field-updated="
          (n) => {
            context.diameter = n
            console.log(context)
          }
        "
      />
      <number-input
        class="input"
        label="Voltage"
        unit="V"
        @field-updated="
          (n) => {
            context.voltage = n
          }
        "
      />
      <select-field class="input" label="Material" :options="materialsList" />
      <button-push class="submit-btn" width="25ch" @click="startSimulation">
        Simulate <i class="fa-solid fa-play"></i>
      </button-push>
    </side-bar>
    <main>
      <div id="canvas"></div>
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
      <number-text class="input" label="Power" unit="W" />
      <number-text class="input" label="Drag Speed" unit="m/s" />
      <number-text class="input" label="Travel time" unit="min" />

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
}

#canvas {
  background: white;
  width: 300px;
  height: 300px;
}

.input {
  margin-top: 3ch;
}

.submit-btn,
.stop-btn {
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
.stop-btn :deep(.front) i {
  color: var(--on-orange-accent);
}
</style>
