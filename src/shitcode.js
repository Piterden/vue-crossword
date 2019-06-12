/* eslint-disable */

Array.prototype.unique = function () {
  const l = this.length
  const u = {}
  const a = []
  let i

  for (i = 0; i < l; i++) {
    if (u.hasOwnProperty(this[i])) continue
    a.push(this[i])
    u[this[i]] = 1
  }

  return a
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}
