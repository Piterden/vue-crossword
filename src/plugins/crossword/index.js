import Grid from './Grid'
import Word from './Word'
import Builder from './Builder'
import Crossword from './Crossword'

const builder = new Builder(Grid, Word, Crossword)

export default function install (Vue) {
  Object.defineProperties(Vue.prototype, {
    $X: {
      get () {
        return builder
      },
    },
  })
}
