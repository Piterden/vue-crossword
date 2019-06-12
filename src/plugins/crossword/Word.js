import BaseClass from 'constructor-decorator'

const getWordCells = ({ length, x, y, isVertical }) => Array.from({ length })
  .map((letter, idx) => isVertical ? `${x}:${y + idx}` : `${x + idx}:${y}`)

class Word extends BaseClass {
  get args () {
    return {
      x: Number,
      y: Number,
      length: Number,
      isVertical: Boolean,
    }
  }

  constructor () {
    super(...arguments)

    this.clues = []
  }

  get query () {
    return getWordCells(this)
  }
}

export default Word
