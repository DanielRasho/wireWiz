export const ELECTRON_CHARGE = 1.60217663e-19
export const AWG_TO_METERS = 0.007348

/**
 * Checks if n1 and n2 are a maximum of delta units apart.
 *
 * This function can be used to check if two floats are "equal".
 * @param {Number} n1
 * @param {Number} n2
 * @param {Number} delta
 * @returns {Boolean}
 */
export const floatEquals = (n1, n2, delta) => Math.abs(n1 - n2) < delta

/**
 * Generates a random number between min and max, both inclusive.
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export const randomIntBetween = (min, max) =>
  Math.round(Math.random() * (max - min) + min)

/**
 * Get's a random element from a list.
 *
 * @param {[Object]} list A list of elements
 * @returns {Object} The selected object
 */
export const getRandomElement = (list) => list[randomIntBetween(0, list.length)]

/**
 * Checks if the given number `n` is in between min and max.
 *
 * @param {Number} n
 * @param {Number} min
 * @param {Number} max
 * @param {Boolean} exclusive Makes both min and max exclusive
 * @returns {Boolean}
 */
export const isInBetween = (n, min, max, exclusive = false) =>
  exclusive ? n > min && n < max : n >= min && n <= max
