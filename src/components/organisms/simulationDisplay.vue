<template>
  <div>
    <svg class="oval" viewBox="0 0 30 90" width="8%" height="100%">
  <ellipse cx="15" cy="45" rx="14" ry="63" stroke-width="1"/>
  </svg>
    <canvas v-bind:id="ELEMENT_ID"></canvas>
    <svg class="oval" viewBox="0 0 30 90" width="8%" height="100%">
  <ellipse cx="15" cy="45" rx="14" ry="63" stroke-width="1"/>
  </svg>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import {
  randomIntBetween,
  getRandomElement,
  isInBetween
} from '../../lib/Utils'
import Matter from 'matter-js'
import { SimulationEngine, SIMULATION_TYPES } from '../../lib/SimulationEngine'
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
      const { simulationType } = props.simInfo
      const isMultipleElectronsSimulation =
        SIMULATION_TYPES.MULTIPLE_ELECTRONS == simulationType
      if (isMultipleElectronsSimulation) {
        setupMultipleElectronsSimulation()
      } else {
        setupOneElectronSimulation()
      }
    } else {
      Composite.clear(engine.world, false, true)
      Events.off(runner)
    }
  }
)

const setupMultipleElectronsSimulation = () => {
  const elem = document.getElementById(ELEMENT_ID)
  const CANVAS_WIDTH = elem.clientWidth
  const CANVAS_HEIGHT = elem.clientHeight

  const ELECTRONS_COUNT = props.simInfo.totalElectrons * 1e-28
  console.log('Electrons count', ELECTRONS_COUNT, props.simInfo.totalElectrons)

  let electrons = []

  for (let i = 0; i < ELECTRONS_COUNT; i++) {
    const electron = Bodies.circle(
      randomIntBetween(0 + ELECTRON_RADIUS, CANVAS_WIDTH - ELECTRON_RADIUS),
      randomIntBetween(0 + ELECTRON_RADIUS, CANVAS_HEIGHT - ELECTRON_RADIUS),
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

  const { simInfo } = props
  const velocity = Matter.Vector.create(
    simInfo.dragVelocity * VELOCITY_FACTOR,
    0
  )

  for (let i = 0; i < electrons.length; i++) {
    const electron = electrons[i]
    Matter.Body.setVelocity(electron, velocity)
  }

  Composite.add(engine.world, electrons)
}

const setupOneElectronSimulation = () => {
  const elem = document.getElementById(ELEMENT_ID)
  const CANVAS_WIDTH = elem.clientWidth
  const CANVAS_HEIGHT = elem.clientHeight
  const DELTA_TICK_COUNT = 100

  let atoms = []
  const atomsPerRow = 10
  const atomsPerColumn = 3

  let xPadding = CANVAS_WIDTH / 20
  let yPadding = CANVAS_HEIGHT / 8
  const xSpan = Math.ceil((CANVAS_WIDTH - 2 * xPadding) / (atomsPerRow - 1))
  const ySpan = Math.ceil((CANVAS_HEIGHT - 2 * yPadding) / (atomsPerColumn - 1))
  const atomRadius = ySpan / 10

  for (let i = 0; i < atomsPerColumn; i++) {
    for (let j = 0; j < atomsPerRow; j++) {
      let x = xPadding + xSpan * j
      let y = yPadding + ySpan * i

      const atom = Bodies.circle(x, y, atomRadius, {
        frictionAir: 0,
        isStatic: true,
        render: {
          fillStyle: '#7c3d13'
        }
      })
      atoms.push(atom)
    }
  }

  let electronPosition = getNewPosition(
    Matter.Vector.create(xPadding, yPadding),
    { min: xPadding, max: CANVAS_WIDTH - xPadding },
    { min: yPadding, max: CANVAS_HEIGHT - yPadding },
    Matter.Vector.create(xSpan, ySpan)
  )
  const electron = Bodies.circle(
    electronPosition.x,
    electronPosition.y,
    atomRadius / 2,
    {
      render: {
        fillStyle: '#f0ee6c',
        lineWidth: 0,
        opacity: 1,
        visible: true
      }
    }
  )

  let tickCount = 0
  const xBounds = { min: xPadding, max: CANVAS_WIDTH - xPadding }
  const yBounds = { min: yPadding, max: CANVAS_HEIGHT - yPadding }
  const spans = Matter.Vector.create(xSpan, ySpan)
  Events.on(runner, 'afterTick', () => {
    tickCount++
    if (tickCount != DELTA_TICK_COUNT) {
      return
    }
    tickCount = 0

    electronPosition = getNewPosition(electronPosition, xBounds, yBounds, spans)

    Matter.Body.setPosition(electron, electronPosition)
  })

  Composite.add(engine.world, electron)
  Composite.add(engine.world, atoms)
}

/**
 *
 * @param {Matter.Vector} currentPosition
 * @param {{min, max}} xBounds The min and max x's
 * @param {{min, max}} yBounds The min and max y's
 * @param {Matter.Vector} spans The spacing between each element on x and y axis.
 * @returns {Matter.Vector} The new position
 */
const getNewPosition = (currentPosition, xBounds, yBounds, spans) => {
  const directionVectors = [
    Matter.Vector.create(-1, 1), // \
    Matter.Vector.create(0, 1), // |
    Matter.Vector.create(1, 1), // /
    Matter.Vector.create(1, 0), // -
    Matter.Vector.create(1, -1), // \
    Matter.Vector.create(0, -1), // |
    Matter.Vector.create(-1, -1), // /
    Matter.Vector.create(-1, 0) // -
  ]

  while (true) {
    const direction = getRandomElement(directionVectors)
    const newPosition = Matter.Vector.add(
      currentPosition,
      Matter.Vector.create(direction.x * spans.x, direction.y * spans.y)
    )
    if (
      isInBetween(newPosition.x, xBounds.min, xBounds.max) &&
      isInBetween(newPosition.y, yBounds.min, yBounds.max)
    ) {
      return newPosition
    }
  }
}

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
      wireframes: false,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    }
  })
}
</script>

<style scoped>

.oval {
  position: absolute;
  transform: translateX(-50%);
}

ellipse {
  fill: var(--background);
  stroke: white;
}

div{
  width: 100%;
  position: relative;
}

canvas {
  width: 100%;
  aspect-ratio: 6 / 2;
  border: 1px solid white;
}
</style>
