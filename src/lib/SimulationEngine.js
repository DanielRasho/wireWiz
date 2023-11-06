import { SimulationContext } from './SimulationContext'
import { diameterUnits } from './WireMaterials'

/**
 * Class responsable for calculating parameters for the given
 * wire context.
 * @param {SimulationContext} context
 */
export class SimulationEngine {
  constructor(context) {
    this.context = context
    this.calculateFields()
  }

  AWG_TO_METERS = 0.007348

  resistance = 0
  electricCurrent = 0
  power = 0
  dragVelocity = 0
  electronTravelTime = 0

  calculateFields(context) {
    console.log(this.context)
    this.resistance = this.calculateResistence()
    this.electricCurrent = this.calculateCurrent()
    this.power = this.calculatePower()
    this.dragVelocity = this.calculateDragVelocity()
    this.electronTravelTime = this.calculateElectronTravelTime()
  }

  //   set Context(context) {
  //     this.context = context
  //     this.calculateFields()
  //   }

  calculateResistence() {
    let wireDimensions = this.context.diameter.unit
    let wireDiameter =
      wireDimensions == diameterUnits.AWG
        ? AWG_TO_METERS * this.context.diameter.value
        : this.context.diameter.value
    let wireTransversalArea = (Math.PI * Math.pow(wireDiameter, 2)) / 4
    console.log('transversal:' + wireTransversalArea)
    return (
      (this.context.material.resistivity.value * this.context.length.value) /
      wireTransversalArea
    ).toExponential(4)
  }

  calculateCurrent() {
    return (this.context.voltage.value / this.resistance).toExponential(4)
  }

  calculatePower() {
    return (this.context.voltage.value * this.electricCurrent).toExponential(4)
  }

  calculateDragVelocity() {
    return (this.context.voltage.value * this.electricCurrent).toExponential(4)
  }

  calculateElectronTravelTime() {
    return (this.context.length.value / this.dragVelocity).toExponential(4)
  }
}
