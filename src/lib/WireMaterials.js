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
  MILIMETERS: 'mm',
  AWG: 'AWG'
})

const AVOGADRO = 6.02214076e23

/**
 * Calcula la densidad de carga del elemento.
 *
 * Las dimensionales de la densidad son: electrones / m^3.
 * @param {Number} electrons La cantidad de electrones que tiene un átomo del elemento
 * @param {Number} molarMass La cantidad de gramos que tiene un mol del elemento
 * @param {Number} density La cantidad de gramos que tiene un cm^3 del elemento
 * @returns {Number} La densidad de carga en electrones/m^3.
 */
const computeChargeDensity = (electrons, molarMass, density) =>
  ((electrons * AVOGADRO) / molarMass) * density * 100_00_00

/**
 * Enum of posible wire materials along with its
 * electrons density.
 */
export const WIRE_MATERIALS = Object.freeze({
  GOLD: new WireMaterial(
    'Gold',
    new SimulationMagnitude(
      computeChargeDensity(1, 196.96657, 19.3),
      'Charge Density',
      '1/m³'
    ),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  SILVER: new WireMaterial(
    'Silver',
    new SimulationMagnitude(
      computeChargeDensity(1, 107.8682, 10.49),
      'Charge Density',
      '1/m³'
    ),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  COPPER: new WireMaterial(
    'Copper',
    new SimulationMagnitude(
      computeChargeDensity(1, 63.546, 8.96),
      'Charge Density',
      '1/m³'
    ),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  ALUMINUM: new WireMaterial(
    'Aluminum',
    new SimulationMagnitude(
      computeChargeDensity(3, 26.982, 2.7),
      'Charge Density',
      '1/m³'
    ),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  ),
  GRAPHITE: new WireMaterial(
    'Graphite',
    new SimulationMagnitude(
      computeChargeDensity(4, 12.0107, 2.26),
      'Charge Density',
      '1/m³'
    ),
    new SimulationMagnitude(2, 'Resistivity', 'ohm·m')
  )
})
