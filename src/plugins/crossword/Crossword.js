import BaseClass from 'constructor-decorator'

import Grid from './Grid'

class Crossword extends BaseClass {
  get args () {
    return {
      grid: Grid,
    }
  }

  constructor () {
    super(...arguments)

    this.letters = {}
  }

  inputLetter ({ x, y, value }) {
    this.letters[`${x}:${y}`] = value
  }
}

export default Crossword
