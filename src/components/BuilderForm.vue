<template>
  <section>
    <div v-if="modeName === 'Grid'">
      <span>Grid Height: {{width}}</span>
      <input type="range" v-model="width" size="4" min="1" max="40" />
      <span>Grid Width: {{height}}</span>
      <input type="range" v-model="height" size="4" min="1" max="40" />
    </div>

    <div class="forms-list horizontal">
      <word-form v-for="(word, index) in horizontalWords" :key="index" :word="word" />
    </div>

    <div class="forms-list vertical">
      <word-form v-for="(word, index) in verticalWords" :key="index" :word="word" />
    </div>
  </section>
</template>

<script>
import WordForm from './WordForm'

export default {
  name: 'BuilderForm',

  components: {
    WordForm,
  },

  data: () => ({
    width: null,
    height: null,
    isEditBlanks: true,
  }),

  props: {
    blanks: { type: Array, default: () => [] },
    initWidth: { type: Number, default: () => 1 },
    initHeight: { type: Number, default: () => 1 },
  },

  created () {
    this.width = this.initWidth
    this.height = this.initHeight
  },

  computed: {
    modeName () {
      return this.isEditBlanks ? 'Grid' : 'Words'
    },

    horizontalWords () {
      const vm = this
      const words = []
      let row = 1

      for (row; row <= vm.height; row++) {
        const rowBlankCells = vm.blanks
          .filter((cell) => Number(cell.split(':')[1]) === row)
          .map((cell) => Number(cell.split(':')[0]))

        if (rowBlankCells.length > 0) {
          let i = 1
          const cols = new Array(vm.width).fill(0).map((col) => i++)

          if (cols) {
            `:${cols.join(':')}`
              .split(new RegExp(`:${rowBlankCells.join('|:')}`))
              .filter((word) => {
                const match = word.match(/:/g)

                return match ? match.length > 1 : false
              })
              .map((word) => {
                const match = word.match(/:/g)
                const length = match ? match.length : 0

                return {
                  x: Number(word.match(/^:(\d+)/)[1]),
                  y: row,
                  length,
                  question: '',
                }
              })
              .forEach((word) => {
                words.push(word)
              })
          }
        } else {
          words.push({
            x: 1,
            y: row,
            length: vm.width,
            question: '',
          })
        }
      }

      return words
    },

    verticalWords () {
      return []
    },
  },

  watch: {
    width (value) {
      this.$emit('rebuild', {
        width: Number(value),
        height: Number(this.height),
      })
    },

    height (value) {
      this.$emit('rebuild', {
        width: Number(this.width),
        height: Number(value),
      })
    },

    isEditBlanks (value) {
      this.$emit('mode', value)
    },
  },
}
</script>

<style lang="stylus" scoped>
input
  width 100%
  margin-bottom 1rem
  border none

section
  display flex
  flex-direction column
  bottom 0
  right 2em
  justify-content flex-start
  align-items flex-start

div
  margin 2em 0

.button
  display inline-flex
  background-color #08f
  padding .75em 1.5em
  border-radius 3px
  color #fff
  cursor pointer
  opacity 0.8
  transition opacity .3s

  &:hover
    opacity 1

input[type=range]
  -webkit-appearance: none
  height: 38px
  margin: 10px 0
  width: 100%

input[type=range]:focus
  outline: none

input[type=range]::-webkit-slider-runnable-track
  width: 100%
  height: 10px
  cursor: pointer
  animate: 0.2s
  background: #eee
  border-radius: 5px

input[type=range]::-webkit-slider-thumb
  height: 2em
  width: 2em
  border-radius: 50%
  background: #08f
  cursor: pointer
  -webkit-appearance: none
  margin-top: -11px

input[type=range]:focus::-webkit-slider-runnable-track
  /* background: #3071A9 */

</style>
