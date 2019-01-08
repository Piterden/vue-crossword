<template>
  <div class="word-form">
    <div v-if="loading" class="word-form-overlay">
      Loading...
    </div>

    <div v-if="modal" class="modal">
      <div class="inner">
        <a href="#" class="close" @click.prevent="hideSuggestionsModal">
          X
        </a>
        <ul class="suggested-list">
          <li v-for="item in suggested" :key="item.id">
            <a
              href="#"
              @click.prevent="pasteWord(getWordText(item))"
              v-html="getWordHtml(item)"
            ></a>
          </li>
        </ul>
        <div class="controls">
          <div class="prev go-to-page">
            <a href="#" @click.prevent="prevPage">Prev.</a>
          </div>
          <div class="index go-to-page">
            Page {{ page + 1 }}
          </div>
          <div class="next go-to-page">
            <a href="#" @click.prevent="nextPage">Next.</a>
          </div>
        </div>
      </div>
    </div>

    <div>{{ index }}</div>

    <div class="question">
      <textarea
        ref="question"
        v-model="question"
        type="text"
        class="textarea"
        rows="1"
      ></textarea>
    </div>

    <div class="words-count">
      <a
        href="#"
        title="Show words"
        @click.prevent="showSuggestionsModal(query)"
        v-text="`Found ${wordsCount} words`"
      ></a>
    </div>

    <div class="answer-letters">
      <div
        v-for="(letter, idx) of cells"
        :key="idx"
        class="letter"
        :class="{ focused: isActive(idx), filled: isFilled(idx) }"
      >
        <input
          v-model="answer[idx]"
          type="text"
          size="1"
          minlength="1"
          maxlength="1"
          :data-idx="idx"
          @blur="onBlur"
          @focus="onFocus"
          @input="onInputLetter"
          @paste.prevent.stop="onPaste"
        />
      </div>
    </div>

    <br />
    <hr />
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
    loading: { type: Boolean, default: () => false },
    isVertical: { type: Boolean, default: () => false },
    filledWords: { type: Array, default: () => [] },
    suggestions: { type: Array, default: () => [] },
    focusedCell: { type: String, default: () => '0:0' },
    suggestionCounts: { type: Array, default: () => [] },
  },

  data () {
    return {
      question: '',
      timeout: null,
      answer: new Array(this.length).fill(''),
      active: null,
      modal: false,
      page: 0,
    }
  },

  computed: {
    query () {
      return Object.keys(this.ownLetters)
        .map((key) => this.ownLetters[key] || '_')
        .join('')
    },

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

    suggested () {
      const data = this.suggestions.find(({ query }) => this.query)

      // eslint-disable-next-line no-magic-numbers
      return data ? data.data.slice(this.page * 50, (this.page + 1) * 50) : []
    },

    wordsCount () {
      const data = this.suggestionCounts.find(({ query }) => query === this.query)

      return data ? data.data : 0
    },
  },

  watch: {
    query (query) {
      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        this.answer = Object.values(this.ownLetters)
        this.countWords(query)
      }, 1000) // eslint-disable-line no-magic-numbers
    },
  },

  methods: {
    async prevPage () {
      this.page = this.page ? this.page - 1 : 0
    },

    async nextPage () {
      this.page += 1
    },

    getWordText ({ id, length, ...letters }) {
      return Object.values(letters)
        .map((letter) => letter.replace(/<.+?>/g, ''))
        .join('')
    },

    getWordHtml ({ id, length, ...letters }) {
      return Object.values(letters).join('')
    },

    pasteWord (word) {
      this.$emit('paste-word', {
        word,
        x: this.x,
        y: this.y,
        isVertical: this.isVertical,
      })
      this.hideSuggestionsModal()
    },

    hideSuggestionsModal () {
      this.modal = false
    },

    // async showSuggestionsModal (query) {
    //   this.modal = true
    //   const url = this.getSuggestionsUrl(query, this.page)
    //   const response = await this.$http.get(url).catch(console.log)
    //   const highlighted = query.split('')
    //     .reduce((acc, letter, idx) => {
    //       if (letter !== '_') {
    //         acc[`letter_${idx + 1}`] = `<mark>${letter}</mark>`
    //       }
    //       return acc
    //     }, {})

    //   if (response) {
    //     this.suggested = response.data.map((word) => ({ ...word, ...highlighted }))
    //   }
    // },

    showSuggestionsModal () {
      this.modal = true
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

          this.showSuggestionsModal(this.query)
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

    &.filled > input
      background greenyellow

    &.focused > input
      background #FFEB3B

  .question
    width 100%
    background #eee

    .textarea
      margin-top 10px
      width calc(100% - 6px)

.word-form
  position relative

  .modal
    position absolute
    width 183%
    top 100%
    background #cacdce
    z-index 10
    padding 20px 0

    > .inner
      position relative

      .controls
        text-align center

        .go-to-page
          display inline-block
          margin 0 50px
          font-size 1.35em

      .suggested-list
        li
          width 120px

      .close
        position absolute
        right 12px
        top -25px
        font-size 2em

  .word-form-overlay
    position absolute
    width 100%
    height 100%
    top 0
    left 0
    background #ccca
</style>
