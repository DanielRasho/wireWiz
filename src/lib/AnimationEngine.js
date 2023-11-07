import Matter from 'matter-js'

export class AnimationEngine {
  constructor(simulationContainer) {
    this.simulationContainer = simulationContainer

    // module aliases
    this.Engine = Matter.Engine
    this.Render = Matter.Render
    this.Runner = Matter.Runner
    this.Bodies = Matter.Bodies
    this.Composite = Matter.Composite
  }

  start() {
    // create an engine
    var engine = this.Engine.create()

    // create a renderer
    var render = this.Render.create({
      element: simulationContainer,
      engine: engine,
      options: {
        background: 'transparent',
        wireframeBackground: 'transparent',
        width: this.simulationContainer.clientWidth,
        height: this.simulationContainer.clientHeight,
        showAngleIndicator: true
      }
    })

    // create two boxes and a ground
    var boxA = this.Bodies.rectangle(200, 200, 80, 80)
    var boxB = this.Bodies.rectangle(100, 50, 80, 80)
    var ground = this.Bodies.rectangle(
      this.simulationContainer.clientWidth / 2,
      this.simulationContainer.clientHeight,
      this.simulationContainer.clientWidth,
      32,
      { isStatic: true }
    )

    // add all of the bodies to the world
    this.Composite.add(engine.world, [boxA, boxB, ground])

    // run the renderer
    this.Render.run(render)

    // create runner
    var runner = this.Runner.create()

    // run the engine
    this.Runner.run(runner, engine)
  }

  stop() {}
}
