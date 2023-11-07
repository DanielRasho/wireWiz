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
export const randomIntBetween = (min, max) => Math.random() * (max - min) + min
