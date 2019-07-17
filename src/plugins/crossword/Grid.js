import BaseClass from 'constructor-decorator'

import Cell from './Cell'
import Word from './Word'

class Grid extends BaseClass {
  get args () {
    return {
      width: Number,
      height: Number,
      blanks: Array,
      name: String,
    }
  }

  constructor (width, height, blanks, name) {
    super(width, height, blanks, name)

    this.Cell = Cell
    this.Word = Word
    this.cells = new Map(Array.from({ length: this.width }, (col, idx) => idx + 1)
      .flatMap((col) => Array.from(
        { length: this.height },
        (row, idx) => [`${idx + 1}:${col}`, new this.Cell(idx + 1, col)],
      )))
    this.blanks = this.blanks.map(this.getCell)
  }

  getCell (id) {
    return this.cells.get(id)
  }

  addBlank (id) {
    this.blanks.push(this.getCell(id))
  }

  removeBlank (id) {
    this.blanks = this.blanks.filter((blank) => `${blank}` !== id)
  }

  blanksUpdate (id) {
    const [x, y] = id.split(':')
    const diagonalIndex = `${this.width - x + 1}:${this.height - y + 1}`
    const verticalIndex = `${this.width - x + 1}:${y}`
    const horizontalIndex = `${x}:${this.height - y + 1}`

    if (this.blanks.find((blank) => `${blank}` !== id)) {
      this.removeBlank(id)

      if (this.verticalSym) {
        this.removeBlank(verticalIndex)
      }

      if (this.horizontalSym) {
        this.removeBlank(horizontalIndex)
      }

      if (this.verticalSym && this.horizontalSym) {
        this.removeBlank(diagonalIndex)
      }

      return
    }

    this.addBlank(id)

    if (this.verticalSym) {
      this.addBlank(verticalIndex)
    }

    if (this.horizontalSym) {
      this.addBlank(horizontalIndex)
    }

    if (this.verticalSym && this.horizontalSym) {
      this.addBlank(diagonalIndex)
    }
  }

  clearGrid () {
    this.blanks = []
  }

  rebuildGrid ({ width, height }) {
    this.width = width
    this.height = height
  }

  changeSize ({ width, height }) {
    if (width && this.width !== width) {
      this.width = width
    }
    if (height && this.height !== height) {
      this.height = height
    }
  }

  generateGrid (hSym, vSym, blankProb) {
    this.blanks = []
    let fillWidth
    let fillHeight

    if (hSym && vSym) {
      fillWidth = Math.round(this.width / 2)
      fillHeight = Math.round(this.height / 2)
    }
    else {
      fillWidth = hSym ? this.width : Math.round(this.width / 2)
      fillHeight = vSym ? this.height : Math.round(this.height / 2)
    }

    for (let x = 1; x <= fillWidth; x += 1) {
      for (let y = 1; y <= fillHeight; y += 1) {
        if (Math.random() > blankProb) {
          continue
        }

        this.blanksUpdate(`${x}:${y}`)
      }
    }
  }

  singleDirectionWords (isVertical = false) {
    const words = []
    let row = 1

    for (row; row <= (isVertical ? this.width : this.height); row += 1) {
      const rowBlankCells = this.blanks
        // eslint-disable-next-line no-loop-func
        .filter((cell) => Number(cell[isVertical ? 'x' : 'y']) === row)
        .map((cell) => Number(cell[isVertical ? 'y' : 'x']))

      if (rowBlankCells.length > 0) {
        const cols = Array.from({
          length: (isVertical ? this.height : this.width),
        }).map((el, idx) => idx + 1)

        if (cols) {
          `:${cols.join('::')}:`
            .split(new RegExp(`:${rowBlankCells.join(':|:')}:`))
            .filter((word) => {
              const match = word.match(/:\d+:/g)

              return match ? match.length > 1 : false
            })
            // eslint-disable-next-line no-loop-func
            .forEach((word) => {
              const match = word.match(/:\d+:/g)
              const length = match ? match.length : 0
              const x = Number(word.match(/^:(\d+)/)[1])

              words.push([
                isVertical ? row : x,
                isVertical ? x : row,
                length,
                isVertical,
              ])
            })
        }
      }
      else {
        words.push([
          isVertical ? row : 1,
          isVertical ? 1 : row,
          isVertical ? this.height : this.width,
          isVertical,
        ])
      }
    }

    return words
  }

  get words () {
    return this.addIndexes([
      ...this.singleDirectionWords(true),
      ...this.singleDirectionWords(false),
    ]).map((arr) => new this.Word(...arr))
  }

  addIndexes (words) {
    return words
      .map((word) => {
        const { index } = this.startCells(words)
          .find(({ x, y }) => word[0] === x && word[1] === y)

        return [...word, index]
      })
  }

  startCells (words) {
    return words
      .map(([x, y]) => ({ x, y }))
      .reduce((acc, cur) => {
        if (!acc.find(({ x, y }) => x === cur.x && y === cur.y)) {
          acc.push(cur)
        }
        return acc
      }, [])
      .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y)
      .map((word, index) => ({ ...word, index: index + 1 }))
  }

  // letterCells () {
  //   const cells = []
  //   let col = 1

  //   for (col; col <= this.width; col += 1) {
  //     let row = 1

  //     for (row; row <= this.height; row += 1) {
  //       if (this.blanks.includes(`${col}:${row}`)) {
  //         continue
  //       }
  //       cells.push({ x: col, y: row })
  //     }
  //   }

  //   return cells.reduce((acc, { x, y }) => {
  //     acc[`${x}:${y}`] = ''
  //     return acc
  //   }, {})
  // }
}

export default Grid
