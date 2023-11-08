<template>
  <canvas v-bind:id="ELEMENT_ID"></canvas>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { randomIntBetween } from '../../lib/Utils'
import Matter from 'matter-js'
import { SimulationEngine } from '../../lib/SimulationEngine'
import { WIRE_MATERIALS } from '../../lib/WireMaterials'

const ELEMENT_ID = 'simulationContainer'
const ELECTRON_RADIUS = 5
const VELOCITY_FACTOR = 1e12

const props = defineProps({
  simInfo: {
    required: true,
    type: SimulationEngine,
    default: null
  },
  isSimulationOn: {
    required: true,
    type: Boolean,
    default: false
  }
})

// module aliases
let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Events = Matter.Events

let engine
let render
let runner

let electrons = []

onMounted(() => {
  // create an engine
  engine = Engine.create({
    gravity: {
      y: 0
    }
  })
  // create runner
  runner = Runner.create()

  setupInitialConditions(engine)

  // Make "one frame" for the initial conditions...
  Runner.run(runner, engine)
  Render.run(render)
})

watch(
  () => props.isSimulationOn,
  (simulationIsOn) => {
    console.log('Prop `isSimulationOn` changed!', simulationIsOn)
    console.log('It was:', runner.enabled, 'before!')

    if (simulationIsOn) {
      const elem = document.getElementById(ELEMENT_ID)
      const CANVAS_WIDTH = elem.clientWidth
      const CANVAS_HEIGHT = elem.clientHeight

      const ELECTRONS_COUNT = props.simInfo.totalElectrons * 1e-28
      console.log(
        'Electrons count',
        ELECTRONS_COUNT,
        props.simInfo.totalElectrons
      )

      electrons.splice(0, electrons.length)
      for (let i = 0; i < ELECTRONS_COUNT; i++) {
        const electron = Bodies.circle(
          randomIntBetween(0 + ELECTRON_RADIUS, CANVAS_WIDTH - ELECTRON_RADIUS),
          randomIntBetween(
            0 + ELECTRON_RADIUS,
            CANVAS_HEIGHT - ELECTRON_RADIUS
          ),
          ELECTRON_RADIUS,
          {
            frictionAir: 0
          }
        )

        Events.on(runner, 'afterTick', () => {
          const currentY = electron.position.y
          const currentX = electron.position.x
          const outOfBoundsOnRight = currentX > CANVAS_WIDTH + ELECTRON_RADIUS
          const outOfBoundsOnLeft = currentX < 0 - ELECTRON_RADIUS
          const velocityIsPositive = simInfo.dragVelocity > 0

          if (velocityIsPositive && outOfBoundsOnRight) {
            Matter.Body.setPosition(
              electron,
              Matter.Vector.create(0 - ELECTRON_RADIUS, currentY)
            )
          }

          if (!velocityIsPositive && outOfBoundsOnLeft) {
            Matter.Body.setPosition(
              electron,
              Matter.Vector.create(CANVAS_WIDTH + ELECTRON_RADIUS, currentY)
            )
          }
        })

        electrons.push(electron)
      }

      // add all of the bodies to the world
      Composite.add(engine.world, electrons)
    } else {
      Composite.clear(engine.world, false, true)
      Events.off(runner)
    }

    const { simInfo } = props
    const velocity = simulationIsOn
      ? Matter.Vector.create(simInfo.dragVelocity * VELOCITY_FACTOR, 0)
      : Matter.Vector.create(0, 0)

    for (let i = 0; i < electrons.length; i++) {
      const electron = electrons[i]
      Matter.Body.setVelocity(electron, velocity)
    }
  }
)

/**
 *
 * @param {Matter.Engine} engine
 */
const setupInitialConditions = () => {
  const elem = document.getElementById(ELEMENT_ID)
  const CANVAS_WIDTH = elem.clientWidth
  const CANVAS_HEIGHT = elem.clientHeight

  // create a renderer
  render = Render.create({
    canvas: elem,
    engine: engine,
    options: {
      background: 'transparent',
      wireframeBackground: 'transparent',
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    }
  })
}
</script>

<style scoped>
canvas {
  width: 100%;
  aspect-ratio: 6 / 2;
  border: 1px solid white;
}
</style>
