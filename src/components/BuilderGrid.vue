<template>
  <div class="builder-grid page-inner">
    <div class="inner">
      <div class="row"
        v-for="(row, rowIdx) in gridWidth"
        :key="rowIdx"
      >
        <div class="inner">
          <div :class="['cell', ...getCellClass(rowIdx, cellIdx)]"
            v-for="(cell, cellIdx) in gridHeight"
            :key="`${cellIdx + 1}:${rowIdx + 1}`"
          >
            <cell
              :x="cellIdx + 1"
              :y="rowIdx + 1"
              :number="getNumber(cellIdx + 1, rowIdx + 1)"
              :is-blank="blanks.includes(`${cellIdx + 1}:${rowIdx + 1}`)"
              :is-active="active.cell === `${cellIdx + 1}:${rowIdx + 1}`"
              @keyup="onKeyUp"
              @keyup.left.up="onLeftPress"
              @cellclick="onCellClick"
              @cellinput="goNextCell"
              v-model="answers[`${cellIdx + 1}:${rowIdx + 1}`]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cell from './Cell'


export default {
  name: 'BuilderGrid',

  components: { Cell },

  data: () => ({
    answers: {},
    active: {
      cell: '',
      word: [],
      vertical: false,
    },
  }),

  props: {
    gridHeight: { type: Number, default: () => 1 },
    gridWidth: { type: Number, default: () => 1 },
    blanks: { type: Array, default: () => [] },
    words: { type: Array, default: () => [] },
  },

  methods: {
    isTitleCell(x, y) {
      return this.words.find((word) => word.x === +x && word.y === +y)
    },

    getNumber(x, y) {
      const titleCell = this.isTitleCell(x, y)

      return titleCell ? titleCell.index : null
    },

    onKeyUp(e) {
      e.target.value.match(/[A-Za-zА-Яа-я]/)
        ? this.goNext(e.target)
        : (e.currentTarget.value = '')
    },

    onCellClick({ id }) {
      this.$emit('updateblanks', id)
    },

    onLeftPress(e) {
      this.goPrev(e.currentTarget)
    },

    getNextId(id) {
      const match = id.match(/(\d+):(\d+)/)
      const last = this.active.word[this.active.word.length - 1]
      const next = Number(match[Number(this.active.vertical) + 1]) + 1

      if (next > last.split(':')[Number(this.active.vertical)]) {
        return false
      }

      return this.active.vertical
        ? `${match[1]}:${next}`
        : `${next}:${match[2]}`
    },

    getPrevId(id) {
      const match = id.match(/(\d+):(\d+)/)
      const first = this.active.word[0]
      const prev = Number(match[Number(this.active.vertical) + 1]) - 1

      if (prev < first.split(':')[Number(this.active.vertical)]) {
        return false
      }

      return this.active.vertical
        ? `${match[1]}:${prev}`
        : `${prev}:${match[2]}`
    },

    goNextCell({ id }) {
      const next = this.getNextId(id)

      this.active.cell = next
      // next && next.focus() || el.blur()
      document.execCommand('selectAll')
    },

    goPrevCell({ id }) {
      const prev = this.getPrevId(id)

      this.active.cell = prev
      // prev && prev.focus() || el.blur()
      document.execCommand('selectAll')
    },

    activateWord(key) {
      let dir

      if (this.isHorizontal(key)) dir = 'horizontal'
      if (this.isVertical(key)) dir = 'vertical'

      return this.updateData(key, dir)
    },

    toggleWords(key) {
      let dir = 'horizontal'

      if (!this.active.word.length) {
        return this.updateData(key, dir)
      }

      if (this.typeOfWord(this.active.word) === 'horizontal') {
        dir = 'vertical'
      }

      return this.updateData(key, dir)
    },

    updateData(key, dir) {
      const word = this[`get${dir.capitalize()}Word`](key)

      if (word === this.active.word) {
        return true
      }

      if (!word) {
        return false
      }

      this.active.word = word
      this.active.cell = word[0]
      this.active.vertical = dir.toLowerCase() === 'vertical'

      return true
    },

    typeOfWord(word) {
      let prev
      let type

      word.forEach((cell) => {
        if (!prev) {
          prev = cell
          return true
        }

        type = prev.split(':')[0] === cell.split(':')[0]
          ? 'vertical'
          : 'horizontal'
      })

      return type
    },

    isVertical(id) {
      return (
        !this.allStartCells('horizontal').includes(this.getHorizontalStartCell(id))
        && this.allStartCells('vertical').includes(this.getVerticalStartCell(id))
      )
    },

    isHorizontal(id) {
      return (
        !this.allStartCells('vertical').includes(this.getVerticalStartCell(id))
        && this.allStartCells('horizontal').includes(this.getHorizontalStartCell(id))
      )
    },

    isBoth(id) {
      return (
        this.allStartCells('vertical').includes(this.getVerticalStartCell(id))
        && this.allStartCells('horizontal').includes(this.getHorizontalStartCell(id))
      )
    },

    isNeither(id) {
      return (
        !this.allStartCells('vertical').includes(this.getVerticalStartCell(id))
        && !this.allStartCells('horizontal').includes(this.getHorizontalStartCell(id))
      )
    },

    getWordStartCells(id) {
      return this.allStartCells().filter((c) => c === id)
    },

    getHorizontalWord(id) {
      id = this.allStartCells('horizontal').includes(id)
        ? id
        : this.getHorizontalStartCell(id)

      return this.collectHorizontalWordCells(this.getHorizontalQuestion(id))
    },

    getVerticalWord(id) {
      id = this.allStartCells('vertical').includes(id)
        ? id
        : this.getVerticalStartCell(id)

      return this.collectVerticalWordCells(this.getVerticalQuestion(id))
    },

    getHorizontalStartCell(id) {
      const xy = id.split(':')

      while (!this.allStartCells('horizontal').includes(id) && xy[0] > 0) {
        xy[0]--
        id = xy.join(':')
      }

      return id
    },

    getVerticalStartCell(id) {
      const xy = id.split(':')

      while (!this.allStartCells('vertical').includes(id) && xy[1] > 0) {
        xy[1]--
        id = xy.join(':')
      }

      return id
    },

    collectHorizontalWordCells(question) {
      if (!question) {
        return []
      }

      const cells = []
      let i

      for (i = question.x; i < question.x + question.length; i++) {
        cells.push(`${i}:${question.y}`)
      }

      return cells === [] ? null : cells
    },

    collectVerticalWordCells(question) {
      if (!question) {
        return []
      }

      const cells = []
      let i

      for (i = question.y; i < question.y + question.length; i++) {
        cells.push(`${question.x}:${i}`)
      }

      return cells === [] ? null : cells
    },

    getVerticalQuestion(id) {
      return this.questions.vertical.find((question) => this.exact(question, id))
    },

    getHorizontalQuestion(id) {
      return this.questions.horizontal.find((question) => this.exact(question, id))
    },

    exact(question, id) {
      const xy = id.split(':')

      return question.x === Number(xy[0]) && question.y === Number(xy[1])
    },

    getCellClass(row, col) {
      const classes = []
      const index = `${col + 1}:${row + 1}`

      // this.letterCells.includes(index)
      //   ? classes.push('letter')
      //   : classes.push('blank')
      this.blanks.includes(index)
        ? classes.push('blank')
        : classes.push('letter')

      // this.startCells.includes(index)
      //   ? classes.push('start')
      //   : true

      // this.active.word.includes(index)
      //   ? classes.push('active')
      //   : true

      return classes
    },

    allStartCells(direction = null) {
      const cells = []

      if (!direction || direction === 'horizontal') {
        this.questions.horizontal.forEach((question) => {
          cells.push(`${question.x}:${question.y}`)
        })
      }

      if (!direction || direction === 'vertical') {
        this.questions.vertical.forEach((question) => {
          cells.push(`${question.x}:${question.y}`)
        })
      }

      return cells
    },
  },
}
</script>

<style lang="stylus">
.builder-grid.page-inner
  display block
  float left
  width 50%
  white-space nowrap

  .cell
    display inline-flex
    margin -2px -1px
    padding 0
    width 30px
    heigth 2
</style>
