<template>
  <div>
    <div class="answer-letters">
      <div>{{ index }}</div>
      <div
        v-for="(letter, idx) of cells"
        :key="idx"
        class="letter"
        :class="{ focused: isActive(idx) }"
      >
        <input
          v-model="answer[idx]"
          type="text"
          size="1"
          minlength="1"
          maxlength="1"
          :data-idx="idx"
          @input="onInputLetter"
          @focus="onFocus"
        />
      </div>
    </div>

    <div class="question">
      <textarea
        ref="question"
        v-model="question"
        type="text"
        class="textarea"
        rows="5"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordForm',

  props: {
    x: { type: Number, default: () => 0 },
    y: { type: Number, default: () => 0 },
    index: { type: Number, default: () => 0 },
    length: { type: Number, default: () => 0 },
    letters: { type: Object, default: () => ({}) },
    isVertical: { type: Boolean, default: () => false },
    focusedCell: { type: String, default: () => '0:0' },
  },

  data () {
    return {
      question: '',
      answer: new Array(this.length).fill(''),
      active: null,
    }
  },

  computed: {
    cells () {
      let i = this.isVertical ? this.x : this.y

      return new Array(this.length).fill(0)
        .map((cell) => ({
          x: this.isVertical ? i++ : this.x, // eslint-disable-line
          y: this.isVertical ? this.y : i++, // eslint-disable-line
          value: '',
        }))
    },

    ownCells () {
      const cells = []

      if (this.isVertical) {
        let i = this.y
        const end = this.length + this.y

        for (i; i < end; i += 1) {
          cells.push(`${this.x}:${i}`)
        }

        return cells
      }

      let i = this.x
      const end = this.length + this.x

      for (i; i < end; i += 1) {
        cells.push(`${i}:${this.y}`)
      }

      return cells
    },

    ownLetters () {
      const letters = {}

      this.ownCells.forEach((cell) => {
        letters[cell] = this.letters[cell]
      })

      return letters
    },
  },

  watch: {
    ownLetters (value) {
      this.answer = Object.values(value)
    },
  },

  methods: {
    onInputLetter (e) {
      this.$emit('input', {
        value: e.target.value,
        ...this.getCellPosition(e.target.dataset.idx),
      })

      if (e.target.value !== '') {
        this.$nextTick(() => {
          const nextEl = e.target.parentElement.nextElementSibling

          if (nextEl) {
            nextEl.children[0].focus()
            document.execCommand('selectAll')
          }
          else {
            this.$refs.question.focus()
          }
        })
      }
    },

    getCellPosition (index) {
      return this.isVertical
        ? { x: this.x, y: Number(this.y) + Number(index) }
        : { x: Number(this.x) + Number(index), y: this.y }
    },

    onFocus (e) {
      this.$emit(
        'focus-cell',
        this.isVertical
          ? Number(this.x)
          : Number(this.x) + Number(e.target.dataset.idx),
        this.isVertical
          ? Number(this.y) + Number(e.target.dataset.idx)
          : Number(this.y),
      )
    },

    isActive (idx) {
      return this.isVertical
        ? `${this.x}:${Number(this.y) + Number(idx)}` === this.focusedCell
        : `${Number(this.x) + Number(idx)}:${this.y}` === this.focusedCell
    }
  },
}
</script>

<style lang="stylus">
.answer-letters
  float left
  width 100%

  .letter
    float left
    width 20px

    > input
      width 17px
      text-align center

    &.focused > input
      background #FFEB3B

  .question
    width 100%
    background #eee

    .textarea
      margin-top 10px
      width calc(100% - 6px)
</style>
