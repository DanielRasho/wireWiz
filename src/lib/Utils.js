/**
 * Checks if n1 and n2 are a maximum of delta units apart.
 *
 * This function can be used to check if two floats are "equal".
 * @param {Number} n1
 * @param {Number} n2
 * @param {Number} delta
 * @returns {Boolean}
 */
export const floatEquals = (n1, n2, delta) => {
  return Math.abs(n1 - n2) < delta
}
