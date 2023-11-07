<template>
  <div v-bind:id="ELEMENT_ID"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { randomIntBetween } from '../../lib/Utils'
import Matter from 'matter-js'
import { SimulationEngine } from '../../lib/SimulationEngine'

const ELEMENT_ID = 'simulationContainer'
const ELECTRONS_QUANTITY = {
  min: 40,
  max: 50
}
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
  console.log('OnMounted called!')
  setupSimulation()
})

const setupSimulation = () => {
  // create an engine
  engine = Engine.create({
    gravity: {
      y: 0
    }
  })

  // create runner
  runner = Runner.create()

  // add window resize handler
  window.addEventListener('resize', () => {
    // TODO Update logic to resize
    // const elem = document.getElementById(ELEMENT_ID)
    // const ELEMENT_WIDTH = elem.clientWidth
    // const ELEMENT_HEIGHT = elem.clientHeight
    // engine.world.bounds.max.x = ELEMENT_WIDTH;
    // engine.world.bounds.max.y = ELEMENT_HEIGHT;
  })
  setupInitialConditions(engine)

  // Make "one frame" for the initial conditions...
  Runner.run(runner, engine)
  Render.run(render)
}

watch(
  () => props.isSimulationOn,
  (simulationIsOn) => {
    console.log('Prop `isSimulationOn` changed!', simulationIsOn)
    console.log('It was:', runner.enabled, 'before!')

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
  if (render !== undefined) {
    Matter.World.clear(engine.world)
    Engine.clear(engine)
    // render?.canvas.remove()
  }

  const elem = document.getElementById(ELEMENT_ID)
  const ELEMENT_WIDTH = elem.clientWidth
  const ELEMENT_HEIGHT = elem.clientHeight

  // create a renderer
  render = Render.create({
    element: elem,
    engine: engine,
    options: {
      background: 'transparent',
      wireframeBackground: 'transparent',
      width: ELEMENT_WIDTH,
      height: ELEMENT_HEIGHT
      // showAngleIndicator: true
    }
  })

  const ELECTRONS_COUNT = randomIntBetween(
    ELECTRONS_QUANTITY.min,
    ELECTRONS_QUANTITY.max
  )
  electrons.splice(0, electrons.length)
  for (let i = 0; i < ELECTRONS_COUNT; i++) {
    const electron = Bodies.circle(
      randomIntBetween(0 + ELECTRON_RADIUS, ELEMENT_WIDTH - ELECTRON_RADIUS),
      randomIntBetween(0 + ELECTRON_RADIUS, ELEMENT_HEIGHT - ELECTRON_RADIUS),
      ELECTRON_RADIUS,
      {
        frictionAir: 0
      }
    )

    Events.on(runner, 'afterTick', () => {
      const currentY = electron.position.y
      const currentX = electron.position.x

      if (currentX > elem.offsetWidth + ELECTRON_RADIUS) {
        Matter.Body.setPosition(
          electron,
          Matter.Vector.create(0 - ELECTRON_RADIUS, currentY)
        )
      }
    })

    electrons.push(electron)
  }

  // add all of the bodies to the world
  Composite.add(engine.world, electrons)
}
</script>

<style scoped>
#simulationContainer {
  width: 70%;
  aspect-ratio: 6 / 2;
  border: 1px solid white;
}
</style>
