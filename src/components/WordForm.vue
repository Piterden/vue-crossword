<template>
  <div class="word-form">
    <div v-if="loading" class="word-form-overlay">Loading...</div>

    <div v-if="modal" class="modal">
      <div class="inner">
        <div class="close">X</div>
        <ul class="suggested-list">
          <li v-for="item in suggested" :key="item.id">
            <a
              href="#"
              @click.prevent="pasteWord(getWord(item))"
              v-text="getWord(item)"
            ></a>
          </li>
        </ul>
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
        @click.prevent="showSuggestionsModal(wordsQuery)"
        v-text="`Found ${wordsCount} words`"
      ></a>
    </div>

    <div class="answer-letters">
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
    isVertical: { type: Boolean, default: () => false },
    focusedCell: { type: String, default: () => '0:0' },
  },

  data () {
    return {
      wordsCount: 0,
      suggested: [],
      question: '',
      loading: false,
      answer: new Array(this.length).fill(''),
      active: null,
      modal: false,
    }
  },

  computed: {
    wordsQuery () {
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
  },

  watch: {
    ownLetters (letters) {
      this.$nextTick(() => {
        this.answer = Object.values(letters)
        this.countWords()
      })
    },

    wordsQuery (query) {
      this.countWords(query)
    },
  },

  methods: {
    getWord ({ id, length, ...letters }) {
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
      this.suggested = []
    },

    async showSuggestionsModal (query) {
      this.modal = true
      const url = `https://crossword.stagelab.pro/crossword/words/find/0/${query}`
      const response = await this.$http.get(url).catch(console.log)

      if (response) {
        this.suggested = response.data
      }
    },

    async countWords (query) {
      this.loading = true
      query = query || this.wordsQuery
      const url = `https://crossword.stagelab.pro/crossword/words/count/${query}`
      const response = await this.$http.get(url).catch(console.log)

      if (response) {
        this.wordsCount = response.data
      }
      this.loading = false
    },

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
