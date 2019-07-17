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
      index: Number,
    }
  }

  constructor (...args) {
    super(...args)

    this.clues = []
    this.word = ''
  }

  get cells () {
    return getWordCells(this)
  }
}

export default Word
