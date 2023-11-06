import { SimulationMagnitude } from './SimulationMagnitud'
import { WireMaterial } from './WireMaterials'

/**
 * Constructs a simulation context for the given data.
 *
 * This class is used to save data of the fields.
 * @param {SimulationMagnitude} length wire length
 * @param {SimulationMagnitude} diameter wire thickness
 * @param {SimulationMagnitude} voltage voltage induced to the wire
 * @param {WireMaterial} material wire material from WireMaterials Enum
 */
export class SimulationContext {
  constructor(length, diameter, voltage, material) {
    this.length = length
    this.diameter = diameter
    this.voltage = voltage
    this.material = material
  }
}
