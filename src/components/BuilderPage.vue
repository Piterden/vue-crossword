<template>
  <div class="page builder-page">
    <div class="toolbox">
      <button
        class="btn"
        :class="{ editing: editGridMode }"
        @click.prevent="onChangeSizeClick"
      >
        Edit Grid
      </button>
      <button
        v-if="editGridMode"
        class="btn"
        @click.prevent="onGenerateGrid"
      >
        Generate Grid
      </button>
      <button
        v-if="editGridMode"
        class="btn"
        @click.prevent="onClearGrid"
      >
        Clear Grid
      </button>
      <button
        class="btn"
        @click.prevent="onClearWords"
      >
        Clear Words
      </button>
      <button
        v-if="!editGridMode"
        class="btn"
        @click.prevent="onRefreshSuggestions"
      >
        Refresh Suggestions
      </button>
      <div class="log">
        <pre>
          {{ log }}
        </pre>
      </div>
    </div>

    <builder-grid
      :words="words"
      :blanks="blanks"
      :letters="letters"
      :grid-width="width"
      :grid-height="height"
      :filled-words="filledWords"
      :focused-cell="focusedCell"
      :hovered-word="hoveredWord"
      @updateblanks="onBlanksUpdate"
    />

    <builder-form
      :clues="clues"
      :words="words"
      :letters="letters"
      :loading="loading"
      :init-width="width"
      :init-height="height"
      :suggestions="suggestions"
      :filled-words="filledWords"
      :focused-cell="focusedCell"
      :change-size-mode="editGridMode"
      :suggestion-counts="suggestionCounts"
      @input="onInputLetter"
      @rebuild="rebuildGrid"
      @focus-cell="onFocusCell"
      @paste-word="onPasteWord"
      @paste-clue="onPasteClue"
      @remove-word="onRemoveWord"
      @form-leaved="onWordLeave"
      @form-hovered="onWordHover"
      @letters-update="onLettersUpdate"
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
    log: [],
    clues: [],
    width: 11,
    height: 11,
    blanks: [],
    letters: {},
    loading: false,
    filledWords: [],
    suggestions: [],
    focusedCell: '0:0',
    hoveredWord: '0:0:0',
    editGridMode: false,
    suggestionCounts: [],
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

    queries () {
      return this.words.map((word) => this.$root.getWordCells({
        ...word,
        word: { length: word.length },
        isVertical: word.type === 'vertical',
      }).map((idx) => this.letters[idx] || '_')
        .join('')).unique()
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

    blanks () {
      if (this.editGridMode) {
        return
      }
      this.updateSuggestions()
    },

    queries () {
      if (this.editGridMode) {
        return
      }
      this.updateSuggestions()
    },
  },

  mounted () {
    this.letters = this.letterCells
  },

  methods: {
    onWordLeave () {
      this.hoveredWord = '0:0:0:0'
    },

    onWordHover ({ x, y, isVertical, length }) {
      this.hoveredWord = `${x}:${y}:${Number(isVertical)}:${length}`
    },

    onChangeSizeClick () {
      this.editGridMode = !this.editGridMode
      if (!this.editGridMode) {
        this.updateSuggestions()
      }
    },

    getWordText ({ id, length, ...letters }) {
      return Object.values(letters).join('')
    },

    onRemoveWord ({ x, y, isVertical, word }) {
      const index = this.filledWords.findIndex((item) => item.x === x &&
        item.y === y && item.isVertical === isVertical)

      this.filledWords.splice(index, 1)
      const keep = this.$root.getAllWordCells(this.filledWords)

      this.$root.getWordCells({ x, y, isVertical, word })
        .forEach((cell) => {
          if (keep.includes(cell)) {
            return
          }
          this.letters[cell] = ''
        })

      this.clues.splice(this.clues.findIndex((clue) => clue.word === word.word), 1)
    },

    onRefreshSuggestions () {
      this.suggestions = []
      this.suggestionCounts = []
      this.updateSuggestions(true)
    },

    async updateSuggestions (force = false) {
      this.loading = true

      this.suggestionCounts = await this.getSuggestionCounts(this.queries, !force)
      this.suggestions = await this.getSuggestions(this.queries, !force)

      this.loading = false
    },

    onGenerateGrid () {
      this.blanks = []
      const halfWidth = this.width % 2
        ? parseInt(this.width / 2) + 1
        : parseInt(this.width / 2)
      const halfHeight = this.height % 2
        ? parseInt(this.height / 2) + 1
        : parseInt(this.height / 2)

      for (let x = 1; x <= halfWidth; x += 1) {
        for (let y = 1; y <= halfHeight; y += 1) {
          // eslint-disable-next-line no-magic-numbers
          if (parseInt(Math.random() * 1.5)) {
            this.blanks.push(`${x}:${y}`)
            this.blanks.push(`${this.width - x + 1}:${y}`)
            this.blanks.push(`${x}:${this.height - y + 1}`)
            this.blanks.push(`${this.width - x + 1}:${this.height - y + 1}`)
          }
        }
      }
    },

    onClearWords () {
      const indexes = Object.keys(this.letters)

      for (let idx = indexes.length - 1; idx >= 0; idx -= 1) {
        this.letters[indexes[idx]] = ''
      }

      this.filledWords = []
    },

    onClearGrid () {
      this.blanks = []
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

    onPasteWord ({ word: { id, length, ...letters }, x, y, isVertical }) {
      const array = Object.values(letters)
      const word = array.join('')

      array.forEach((letter, index) => {
        if (isVertical) {
          this.letters[`${x}:${y + index}`] = letter
        }
        else {
          this.letters[`${x + index}:${y}`] = letter
        }
      })
      this.filledWords.push({ word, x, y, isVertical, clue: null })
      this.$http.get(`https://crossword.stagelab.pro/crossword/clues/find/${word}`)
        .then((response) => {
          this.clues.push({ word, data: response.data.clues })
        })
    },

    onPasteClue ({ word, clue, x, y, isVertical }) {
      this.$http.post(
        'https://crossword.stagelab.pro/crossword/clues/create',
        { crossword: 1, clue: clue.id }
      )
        .then((response) => {
          const index = this.filledWords.findIndex((item) => item.x === x &&
            item.y === y && item.isVertical === isVertical)

          if (index !== -1) {
            this.filledWords[index].clue = response.data.clue
          }
        })
        .catch(console.log)
    },

    onLettersUpdate ({ letters }) {
      Object.assign(this.letters, letters)
    },

    getSuggestionsUrl (query, page = 0) {
      return `https://crossword.stagelab.pro/crossword/words/find/${page}/${query}`
    },

    getSuggestions (queries, useCache = true) {
      return Promise.all(queries.map(async (query) => {
        if (!query.includes('_')) {
          return { query, data: [] }
        }

        if (useCache) {
          const cached = this.suggestions.find((data) => data.query === query)

          if (cached) {
            return cached
          }
        }
        this.log.push(`WORDS FOR ${query}`)

        const url = this.getSuggestionsUrl(query)
        const response = await this.$http.get(url)

        this.log.splice(this.log.findIndex((string) => string === url), 1)

        return { query, data: response.data.words }
      }))
    },

    getSuggestionCounts (queries, useCache = true) {
      return Promise.all(queries.map(async (query) => {
        if (useCache) {
          const cached = this.suggestionCounts.find((data) => data.query === query)

          if (cached) {
            return cached
          }
        }
        this.log.push(`COUNT FOR ${query}`)

        const url = `https://crossword.stagelab.pro/crossword/words/count/${query}`
        const response = await this.$http.get(url).catch(console.log)

        this.log.splice(this.log.findIndex((string) => string === url), 1)

        return { query, count: response.data.count }
      }))
    },
  },
}
</script>
