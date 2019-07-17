import BaseClass from 'constructor-decorator'

class Builder extends BaseClass {
  get args () {
    return {
      Grid: Function,
      Word: Function,
      Crossword: Function,
    }
  }

  constructor () {
    super(...arguments)

    this.crossword = null
  }

  createCrossword (grid) {
    this.crossword = new this.Crossword(grid)
  }

  createGrid (...args) {
    return new this.Grid(...args)
  }
}

export default Builder
