<template>
  <div v-bind:id="ELEMENT_ID"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Matter from 'matter-js'

const ELEMENT_ID = 'simulationContainer'

console.log('')

// module aliases
let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite

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

  // add window resize handler
  window.addEventListener('resize', () => setupInitialConditions())

  setupInitialConditions(engine)

  // create runner
  runner = Runner.create()

  // run the engine
  Runner.run(runner, engine)
})

/**
 *
 * @param {Matter.Engine} engine
 */
const setupInitialConditions = () => {
  if (render !== undefined && engine !== undefined) {
    Render.stop(render)
    Matter.World.clear(engine.world)
    Engine.clear(engine)
    render?.canvas.remove()
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
      height: ELEMENT_HEIGHT,
      showAngleIndicator: true
    }
  })

  // create two boxes and a ground
  let boxA = Bodies.rectangle(400, 200, 80, 80)
  let boxB = Bodies.rectangle(450, 50, 80, 80)
  let ground = Bodies.rectangle(
    ELEMENT_WIDTH / 2,
    ELEMENT_HEIGHT,
    ELEMENT_WIDTH,
    ELEMENT_HEIGHT / 8,
    { isStatic: true }
  )

  let boundaries = [Bodies.circle(ELEMENT_WIDTH / 2, 0, 10)]

  // add all of the bodies to the world
  Composite.add(engine.world, [boxA, boxB, ground])
  Composite.add(engine.world, boundaries)

  // run the renderer
  Render.run(render)
}
</script>

<style scoped>
#simulationContainer {
  width: 70%;
  aspect-ratio: 6 / 2;
  border: 1px solid white;
}
</style>
