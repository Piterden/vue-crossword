<template>
  <div class="page builder-page">
    <builder-grid
      :grid-width="width"
      :grid-height="height"
      :blanks="blanks"
      :is-edit-blanks="isEditBlanks"
      @updateblanks="onBlanksUpdate"
    />
    <div v-html="firstLetters"></div>
    <builder-form
      :init-width="width"
      :init-height="height"
      :horizontal-words="horizontalWords"
      :vertical-words="verticalWords"
      @rebuild="rebuildGrid"
      @mode="onToggleMode"
    />
  </div>
</template>

<script>
import BuilderGrid from './BuilderGrid'
import BuilderForm from './BuilderForm'

export default {
  name: 'BuilderPage',

  components: { BuilderForm, BuilderGrid },

  mounted () {
    this.toggleMode()
  },

  data: () => ({
    width: 10,
    height: 10,
    blanks: [],
    isEditBlanks: true,
  }),

  methods: {
    rebuildGrid ({ width, height }) {
      this.width = width
      this.height = height
    },

    toggleMode () {
      document.querySelector('.grid')
        .classList
        .toggle('blanks', this.isEditBlanks)
    },

    onToggleMode (payload) {
      this.isEditBlanks = payload
      this.toggleMode()
    },

    onBlanksUpdate (id) {
      if (!this.blanks.includes(id)) {
        return this.blanks.push(id)
      }

      this.blanks = this.blanks.filter((blank) => blank !== id)
    },
  },

  computed: {
    horizontalWords () {
      const words = []
      let row = 1

      for (row; row <= this.height; row++) {
        const rowBlankCells = this.blanks
          .filter((cell) => Number(cell.split(':')[1]) === row)
          .map((cell) => Number(cell.split(':')[0]))

        if (rowBlankCells.length > 0) {
          let i = 1
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
                  length,
                  question: '',
                })
              })
          }
        } else {
          words.push({
            x: 1,
            y: row,
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

      for (col; col <= this.width; col++) {
        const colBlankCells = this.blanks
          .filter((cell) => Number(cell.split(':')[0]) === col)
          .map((cell) => Number(cell.split(':')[1]))

        if (colBlankCells.length > 0) {
          let i = 1
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
                  length,
                  question: '',
                })
              })
          }
        } else {
          words.push({
            x: col,
            y: 1,
            length: this.height,
            question: '',
          })
        }
      }

      return words
    },

    words () {
      return [...this.horizontalWords, ...this.verticalWords]
    },

    firstLetters () {
      return this.words
        .reduce((acc, cur) => {
          if (!acc.find((w) => w.x === cur.x && w.y === cur.y)) {
            acc.push(cur)
          }

          return acc
        }, [])
        .sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x)
    },
  },
}
</script>

<style lang="stylus">
.page
  display flex
  justify-content space-between

@media screen and (max-width: 500px)
  .page
    flex-direction column-reverse

    .grid
      margin 0 auto
</style>
