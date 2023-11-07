import { SimulationContext } from './SimulationContext'
import { diameterUnits } from './WireMaterials'

/**
 * Class responsable for calculating parameters for the given
 * wire context.
 * @param {SimulationContext} context
 */
export class SimulationEngine {

  ELECTRON_CHARGE = 1.60217663e-19
  AWG_TO_METERS = 0.007348

  resistance = 0
  electricCurrent = 0
  power = 0
  dragVelocity = 0
  electronTravelTime = 0

  calculateFields(context) {
    console.log("The engine context is:", context)

    this.resistance = this.calculateResistence(context)
    this.electricCurrent = this.calculateCurrent(context)
    this.power = this.calculatePower(context)
    this.dragVelocity = this.calculateDragVelocity(context)
    this.electronTravelTime = this.calculateElectronTravelTime(context)
  }

  calculateResistence(context) {
    let wireTransversalArea = this.calculateTransversalArea(context)
    return (
      (context.material.resistivity.value * context.length.value) /
      wireTransversalArea
    ).toExponential(4)
  }

  calculateCurrent(context) {
    return (context.voltage.value / this.calculateResistence(context)).toExponential(4)
  }

  calculatePower(context) {
    return (context.voltage.value * this.calculateCurrent(context)).toExponential(4)
  }

  calculateDragVelocity(context) {
    return (
      this.calculateCurrent(context) /
      (this.calculateTransversalArea(context) *
        context.material.chargeDensity.value *
        this.ELECTRON_CHARGE)
    ).toExponential(4)
  }

  calculateElectronTravelTime(context) {
    return (context.length.value / this.calculateDragVelocity(context)).toExponential(4)
  }

  calculateTransversalArea(context) {
    let wireDimensions = context.diameter.unit
    let wireDiameter =
      wireDimensions == diameterUnits.AWG
        ? AWG_TO_METERS * context.diameter.value
        : context.diameter.value
    return (Math.PI * Math.pow(wireDiameter, 2)) / 4
  }
}
