export class SimulationMagnitude {
  /**
   * Constructs a magnitude to be used inside a simulation context.
   *
   * This class can be used to represent a value that the user needs to input.
   * @param {Number} value The value of this magnitude
   * @param {String} name The name of this magnitude
   * @param {String} unit The unit of this magnitude
   */
  constructor(value, name, unit) {
    this.value = value
    this.name = name
    this.unit = unit
  }
}
