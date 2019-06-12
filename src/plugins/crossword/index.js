import Builder from './Builder'

const builder = new Builder(15, 15, [], '')

export default function install (Vue) {
  Object.defineProperties(Vue.prototype, {
    $X: {
      get () {
        return builder
      },
    },
  })
}
