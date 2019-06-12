/* eslint-disable */

Array.prototype.unique = function () {
  const u = {}
  const a = []

  this.forEach(i => {
    if (u.hasOwnProperty(i)) {
      return
    }
    a.push(i)
    u[i] = 1
  })

  return a
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}
