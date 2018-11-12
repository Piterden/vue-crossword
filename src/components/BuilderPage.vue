<template>
  <div class="page builder-page">
    <builder-form
      :init-width="width"
      :init-height="height"
      :words="words"
      @rebuild="rebuildGrid"
    />

    <builder-grid
      :grid-width="width"
      :grid-height="height"
      :blanks="blanks"
      :words="words"
      @updateblanks="onBlanksUpdate"
    />
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
  }),

  computed: {
    horizontalWords () {
      const words = []
      let row = 1

      for (row; row <= this.width; row += 1) {
        const rowBlankCells = this.blanks
          .filter((cell) => Number(cell.split(':')[1]) === row)
          .map((cell) => Number(cell.split(':')[0]))

        if (rowBlankCells.length > 0) {
          let i = 1
          // eslint-disable-next-line
          const cols = new Array(this.height).fill(0).map((col) => i += 1)

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

      for (col; col <= this.height; col += 1) {
        const colBlankCells = this.blanks
          .filter((cell) => Number(cell.split(':')[0]) === col)
          .map((cell) => Number(cell.split(':')[1]))

        if (colBlankCells.length > 0) {
          let i = 1
          // eslint-disable-next-line
          const rows = new Array(this.width).fill(0).map((row) => i += 1)

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

      return words
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
  },

  methods: {
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

    addIndexes (words) {
      return words
        .map((word) => {
          const { index } = this.startCells
            .find(({ x, y }) => word.x === x && word.y === y)

          return { ...word, index }
        })
    },
  },
}
</script>

<style lang="stylus">
.builder-page
  display flex
  flex-direction row

@media screen and (max-width: 500px)
  .page
    flex-direction column-reverse

    .builder-grid
      margin 0 auto
</style>
