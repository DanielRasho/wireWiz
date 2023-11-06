import { SimulationMagnitude } from './SimulationMagnitud'

/**
 * Constructs a chemical material.
 *
 * This class can be used to represent a value that the user needs to input.
 * @param {Number} name The value of this magnitude
 * @param {SimulationMagnitude} chargeDensity The name of this magnitude
 * @param {SimulationMagnitude} resistivity The unit of this magnitude
 */
export class WireMaterial {
  constructor(name, chargeDensity, resistivity) {
    this.name = name
    this.chargeDensity = chargeDensity
    this.resistivity = resistivity
  }
}

export const diameterUnits = Object.freeze({
  METERS: 'm',
  AWG: 'AWG'
})

/**
 * Enum of posible wire materials along with its
 * electrons density.
 */
export const WireMaterials = Object.freeze({
  GOLD: new WireMaterial(
    'Gold',
    new SimulationMagnitude(300, 'Charge Density', '1/m³'),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  SILVER: new WireMaterial(
    'Silver',
    new SimulationMagnitude(300, 'Charge Density', '1/m³'),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  COPPER: new WireMaterial(
    'Copper',
    new SimulationMagnitude(300, 'Charge Density', '1/m³'),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  ALUMINUM: new WireMaterial(
    'Aluminum',
    new SimulationMagnitude(300, 'Charge Density', '1/m³'),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  GRAPHITE: new WireMaterial(
    'Graphite',
    new SimulationMagnitude(300, 'Charge Density', '1/m³'),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  )
})
