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
  }
}

export default Builder
