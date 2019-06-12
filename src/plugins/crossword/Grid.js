import BaseClass from 'constructor-decorator'

class Grid extends BaseClass {
  get args () {
    return {
      width: Number,
      height: Number,
      blanks: Array,
      name: String,
    }
  }

  constructor () {
    super(...arguments)
  }
}

export default Grid
