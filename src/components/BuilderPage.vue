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
          // eslint-disable-next-line no-loop-func
          .filter((cell) => Number(cell.split(':')[1]) === row)
          .map((cell) => Number(cell.split(':')[0]))

        if (rowBlankCells.length > 0) {
          let idx = 1
          const cols = new Array(this.height).fill(0)
            // eslint-disable-next-line no-return-assign
            .map(() => idx += 1)

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
          // eslint-disable-next-line no-loop-func
          .filter((cell) => Number(cell.split(':')[0]) === col)
          .map((cell) => Number(cell.split(':')[1]))

        if (colBlankCells.length > 0) {
          let idx = 1
          const rows = new Array(this.width).fill(0)
            // eslint-disable-next-line no-return-assign
            .map(() => idx += 1)

          if (rows) {
            `:${rows.join('::')}:`
              .split(new RegExp(`:${colBlankCells.join(':|:')}:`))
              .filter((word) => {
                const match = word.match(/:\d+:/g)

                return match ? match.length > 1 : false
              })
              // eslint-disable-next-line no-loop-func
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

    addIndexes (startCells) {
      return startCells
        .reduce((acc, cur) => {
          // eslint-disable-next-line id-match
          if (!acc.find(({ x, y }) => x === cur.x && y === cur.y)) {
            acc.push(cur)
          }

          return acc
        }, [])
        // eslint-disable-next-line id-length
        .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y)
        .map((word, index) => ({ ...word, index: index + 1 }))
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
