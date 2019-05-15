<template>
  <div>
    <div class="answer-letters">
      <div
        v-for="(letter, idx) of cells"
        :key="idx"
        class="letter"
      >
        <input
          v-model="answer[index]"
          type="text"
          size="1"
          minlength="1"
          maxlength="1"
        />
      </div>
    </div>

    <span class="index-number">
      {{ index }}
    </span>

    <div class="question">
      <textarea
        v-model="question"
        :placeholder="`${questionNumber}. `"
        type="text"
        class="textarea"
        rows="5"
        @focus="!question ? question = `${questionNumber}. ` : question"
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
    isVertical: { type: Boolean, default: () => false },
  },

  data () {
    return {
      question: '',
      answer: new Array(this.length).fill(null),
      active: null,
      questionNumber: null,
    }
  },

  computed: {
    cells () {
      let idx = this.isVertical ? this.x : this.y

      return new Array(this.length).fill(0)
        // eslint-disable-next-line no-return-assign
        .map((cell) => ({
          x: this.isVertical ? idx += 1 : this.x,
          y: this.isVertical ? this.y : idx += 1,
          value: '',
        }))
    },
  },

  data () {
    return {
      page: 0,
      active: null,
      answer: Array.from({ length: this.length }).fill(''),
      timeout: null,
      question: '',
      cluesVisible: false,
      suggestionsVisible: false,
    }
  },
}
</script>

  watch: {
    query () {
      this.answer = Object.values(this.ownLetters)
    },
  },

  methods: {
    removeWord () {
      const { x, y, isVertical, word } = this

      this.$emit('remove-word', ({ x, y, isVertical, word }))
      this.question = ''
    },

    toggleModal (query) {
      if (this.answer.includes('')) {
        if (this.suggestionsVisible) {
          this.hideSuggestions()
        }
        else {
          this.showSuggestions(query)
        }
      }
      else {
        if (this.cluesVisible) {
          this.hideClues()
        }
        else {
          this.showClues(query)
        }
      }
    },

    showModal (query) {
      if (this.answer.includes('')) {
        this.showSuggestions(query)
      }
      else {
        this.showClues()
      }
    },

    showClues () {
      this.cluesVisible = !!this.word
    },

    hideClues () {
      this.cluesVisible = false
    },

    prevPage () {
      this.page = this.page ? this.page - 1 : 0
    },

    nextPage () {
      this.page += 1
    },

    getWordHtml ({ word }) {
      return word
    },

    pasteWord (word) {
      this.$emit('paste-word', {
        word,
        x: this.x,
        y: this.y,
        isVertical: this.isVertical,
      })
      this.hideSuggestions()
    },

    hideSuggestions () {
      this.suggestionsVisible = false
    },

    getClueHtml ({ name }) {
      return name
    },

    pasteClue (clue) {
      this.word.clue = clue
      this.$emit('paste-clue', { word: this.word })
      this.question = clue.name
      this.hideClues()
    },

    showSuggestions () {
      this.suggestionsVisible = true
    },

    onInputLetter (e) {
      this.$emit('input', {
        value: e.target.value.toUpperCase(),
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

          this.showSuggestions(this.query)
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

    onBlur () {
      this.$emit('focus-cell', 0, 0)
    },

    isActive (idx) {
      return this.isVertical
        ? `${this.x}:${Number(this.y) + Number(idx)}` === this.focusedCell
        : `${Number(this.x) + Number(idx)}:${this.y}` === this.focusedCell
    },

    isFilled (idx) {
      return this.isVertical
        ? this.$root.getAllWordCells(this.filledWords)
          .includes(`${this.x}:${Number(this.y) + Number(idx)}`)
        : this.$root.getAllWordCells(this.filledWords)
          .includes(`${Number(this.x) + Number(idx)}:${this.y}`)
    },

    onPaste (e) {
      const text = e.clipboardData.getData('text')

      if (typeof text === 'string' && text && text.length === this.length) {
        this.answer = text.split('')
      }
    },
  },
}
</script>
