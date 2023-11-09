import { SimulationContext } from './SimulationContext'
import { WIRE_MATERIALS, diameterUnits } from './WireMaterials'
import { ELECTRON_CHARGE, AWGToArea } from '../lib/Utils'

export const SIMULATION_TYPES = {
  MULTIPLE_ELECTRONS: false,
  ONE_ELECTRON: true
}

/**
 * Class responsable for calculating parameters for the given
 * wire context.
 */
export class SimulationEngine {
  resistance = 0
  electricCurrent = 0
  power = 0
  dragVelocity = 0
  electronTravelTime = 0
  totalElectrons = 1
  simulationType = SIMULATION_TYPES.MULTIPLE_ELECTRONS

  /**
   *
   * @param {SimulationContext} context
   */
  calculateFields(context) {
    this.context = context
    console.log('The engine context is:', context)

    this.resistance = this.calculateResistence(context)
    this.electricCurrent = this.calculateCurrent(context)
    this.power = this.calculatePower(context)
    this.dragVelocity = this.calculateDragVelocity(context)
    this.electronTravelTime = this.calculateElectronTravelTime(context)
    this.totalElectrons = this.calculateTotalElectrons(context)
  }

  /**
   *
   * @param {Boolean} type Simulation type obtained from constant `SIMULATION_TYPES`
   */
  setSimulationType(type) {
    this.simulationType = type
  }

  calculateTotalElectrons(context) {
    let wireTransversalArea = this.calculateTransversalArea(context)
    let volume = wireTransversalArea * context.length.value
    return context.material.chargeDensity.value * volume
  }

  calculateResistence(context) {
    let wireTransversalArea = this.calculateTransversalArea(context)
    console.log(wireTransversalArea)
    return (
      (context.material.resistivity.value * context.length.value) /
      wireTransversalArea
    ).toFixed(3)
  }

  calculateCurrent(context) {
    return (context.voltage.value / this.calculateResistence(context)).toFixed(
      3
    )
  }

  calculatePower(context) {
    return (context.voltage.value * this.calculateCurrent(context)).toFixed(3)
  }

  calculateDragVelocity(context) {
    return (
      this.calculateCurrent(context) /
      (this.calculateTransversalArea(context) *
        context.material.chargeDensity.value *
        ELECTRON_CHARGE)
    ).toExponential(4)
  }

  calculateElectronTravelTime(context) {
    return (
      context.length.value /
      (this.calculateDragVelocity(context) * 60)
    ).toFixed(3)
  }

  calculateTransversalArea(context) {
    const MILI_TO_METERS = 1 / 1000
    let wireUnit = context.diameter.unit
    let wireValue = context.diameter.value
    console.log('Wire diameter' + wireValue)
    switch (wireUnit) {
      case diameterUnits.MILIMETERS:
        let diameter = wireValue * MILI_TO_METERS
        return (Math.PI * Math.pow(diameter, 2)) / 4
      case diameterUnits.AWG:
        return AWGToArea(wireValue)
    }
  }
}
