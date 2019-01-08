<template>
  <div class="page builder-page">
    <builder-form
      :init-width="width"
      :init-height="height"
      :letters="letters"
      :words="words"
      :focused-cell="focusedCell"
      @rebuild="rebuildGrid"
      @input="onInputLetter"
      @focus-cell="onFocusCell"
      @paste-word="onPasteLetters"
      @letters-update="onLettersUpdate"
    />

    <builder-grid
      :grid-width="width"
      :grid-height="height"
      :letters="letters"
      :blanks="blanks"
      :words="words"
      :focused-cell="focusedCell"
      @updateblanks="onBlanksUpdate"
    />

    <button class="make-blanks" @click.prevent="onGenerate">
      Generate Grid
    </button>
  </div>
</template>

<script>
/* eslint-disable no-loop-func */

import BuilderGrid from './BuilderGrid'
import BuilderForm from './BuilderForm'

export default {
  name: 'BuilderPage',

  components: { BuilderForm, BuilderGrid },

  data: () => ({
    width: 10,
    height: 10,
    blanks: [],
    letters: {},
    focusedCell: '0:0',
  }),

  computed: {
    horizontalWords () {
      const words = []
      let row = 1

      for (row; row <= this.height; row += 1) {
        const rowBlankCells = this.blanks
          .filter((cell) => Number(cell.split(':')[1]) === row)
          .map((cell) => Number(cell.split(':')[0]))

        if (rowBlankCells.length > 0) {
          let i = 1
          // eslint-disable-next-line
          const cols = new Array(this.width).fill(0).map((col) => i++)

          if (cols) {
            `:${cols.join('::')}:`
              .split(new RegExp(`:${rowBlankCells.join(':|:')}:`))
              .filter((word) => {
                const match = word.match(/:\d+:/g)

                return match ? match.length > 1 : false
              })
              .forEach((word) => {
                const match = word.match(/:\d+:/g)
                const length = match ? match.length : 0

                words.push({
                  x: Number(word.match(/^:(\d+)/)[1]),
                  y: row,
                  type: 'horizontal',
                  length,
                  question: '',
                })
              })
          }
        }
        else {
          words.push({
            x: 1,
            y: row,
            type: 'horizontal',
            length: this.width,
            question: '',
          })
        }
      }

      return words
    },

    verticalWords () {
      const words = []
      let col = 1

      for (col; col <= this.width; col += 1) {
        const colBlankCells = this.blanks
          .filter((cell) => Number(cell.split(':')[0]) === col)
          .map((cell) => Number(cell.split(':')[1]))

        if (colBlankCells.length > 0) {
          let i = 1
          // eslint-disable-next-line
          const rows = new Array(this.height).fill(0).map((row) => i++)

          if (rows) {
            `:${rows.join('::')}:`
              .split(new RegExp(`:${colBlankCells.join(':|:')}:`))
              .filter((word) => {
                const match = word.match(/:\d+:/g)

                return match ? match.length > 1 : false
              })
              .forEach((word) => {
                const match = word.match(/:\d+:/g)
                const length = match ? match.length : 0

                words.push({
                  x: col,
                  y: Number(word.match(/^:(\d+)/)[1]),
                  type: 'vertical',
                  length,
                  question: '',
                })
              })
          }
        }
        else {
          words.push({
            x: col,
            y: 1,
            type: 'vertical',
            length: this.height,
            question: '',
          })
        }
      }

      return words.sort((a, b) => a.y - b.y)
    },

    words () {
      return this.addIndexes([
        ...this.horizontalWords,
        ...this.verticalWords,
      ])
    },

    startCells () {
      return [
        ...this.horizontalWords,
        ...this.verticalWords,
      ]
        .map((word) => ({
          x: word.x,
          y: word.y,
        }))
        .reduce((acc, cur) => {
          if (!acc.find(({ x, y }) => x === cur.x && y === cur.y)) {
            acc.push(cur)
          }
          return acc
        }, [])
        .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y)
        .map((word, index) => ({ ...word, index: index + 1 }))
    },

    letterCells () {
      const cells = []
      let col = 1

      for (col; col <= this.width; col += 1) {
        let row = 1

        for (row; row <= this.height; row += 1) {
          const re = new RegExp(`${col}:${row}`)

          if (!this.blanks.find((blank) => blank && blank.match(re))) {
            cells.push({ x: col, y: row })
          }
        }
      }

      return cells.reduce((acc, { x, y }) => {
        acc[`${x}:${y}`] = ''
        return acc
      }, {})
    },
  },

  watch: {
    letterCells (value) {
      this.letters = { ...value, ...this.letters }
    },
  },

  mounted () {
    this.letters = this.letterCells
  },

  methods: {
    onGenerate () {
      this.blanks = []
      const halfWidth = this.width % 2
        ? parseInt(this.width / 2) + 1
        : parseInt(this.width / 2)
      const halfHeight = this.height % 2
        ? parseInt(this.height / 2) + 1
        : parseInt(this.height / 2)

      for (let x = 1; x <= halfWidth; x += 1) {
        for (let y = 1; y <= halfHeight; y += 1) {
          if (parseInt(Math.random() * 2)) {
            this.blanks.push(`${x}:${y}`)
            this.blanks.push(`${this.width - x + 1}:${y}`)
            this.blanks.push(`${x}:${this.height - y + 1}`)
            this.blanks.push(`${this.width - x + 1}:${this.height - y + 1}`)
          }
        }
      }
    },

    rebuildGrid ({ width, height }) {
      this.width = width
      this.height = height
    },

    onBlanksUpdate (id) {
      if (!this.blanks.includes(id)) {
        return this.blanks.push(id)
      }

      this.blanks = this.blanks.filter((blank) => blank !== id)
    },

    onInputLetter ({ x, y, value }) {
      this.letters[`${x}:${y}`] = value
    },

    addIndexes (words) {
      return words
        .map((word) => {
          const { index } = this.startCells
            .find(({ x, y }) => word.x === x && word.y === y)

          return { ...word, index }
        })
    },

    onFocusCell (x, y) {
      this.focusedCell = `${x}:${y}`
    },

    onPasteLetters ({ word, x, y, isVertical }) {
      word.split('').forEach((letter, index) => {
        if (isVertical) {
          this.letters[`${x}:${y + index}`] = letter
        }
        else {
          this.letters[`${x + index}:${y}`] = letter
        }
      })
    },

    onLettersUpdate ({ letters }) {
      Object.assign(this.letters, letters)
    },
  },
}
</script>

<style lang="stylus">
.builder-page
  display flex
  flex-direction row

.make-blanks
  height 50px

@media screen and (max-width: 500px)
  .page
    flex-direction column-reverse

    .builder-grid
      margin 0 auto
</style>
