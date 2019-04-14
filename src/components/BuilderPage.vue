<template>
  <div class="page builder-page">
    <div class="toolbox">
      <button
        :class="{ editing: editGridMode }"
        @click.prevent="changeSizeClick"
        class="btn"
      >
        Edit Grid
      </button>
      <button
        v-if="editGridMode"
        @click.prevent="generateGrid"
        class="btn"
      >
        Generate Grid
      </button>
      <button
        v-if="editGridMode"
        :class="{ editing: horizontalSym }"
        @click.prevent="horizontalSymetria"
        class="btn"
      >
        Horizontal Symetria
      </button>
      <button
        v-if="editGridMode"
        :class="{ editing: verticalSym }"
        @click.prevent="verticalSymetria"
        class="btn"
      >
        Vertical Symetria
      </button>
      <button
        v-if="editGridMode"
        @click.prevent="clearGrid"
        class="btn"
      >
        Clear Grid
      </button>
      <button
        @click.prevent="newCrossword"
        class="btn"
      >
        Create New Crossword
      </button>
      <button
        @click.prevent="saveCrossword"
        class="btn"
      >
        Save Crossword
      </button>
      <button
        v-if="!editGridMode"
        @click.prevent="refreshSuggestions"
        class="btn"
      >
        Refresh Suggestions
      </button>
      <div class="log">
        <pre>
          {{ log }}
        </pre>
      </div>
      <div class="statistics">
        <pre v-html="statsView"></pre>
      </div>
    </div>

    <builder-form
      :clues="clues"
      :words="words"
      :letters="letters"
      :loading="loading"
      :init-width="width"
      :init-height="height"
      :next-query="nextQuery"
      :suggestions="suggestions"
      :filled-words="filledWords"
      :focused-cell="focusedCell"
      :change-size-mode="editGridMode"
      :suggestion-counts="suggestionCounts"
      @input="inputLetter"
      @rebuild="rebuildGrid"
      @focus-cell="focusCell"
      @paste-word="pasteWord"
      @paste-clue="pasteClue"
      @density="changeDensity"
      @form-leaved="wordLeave"
      @remove-word="removeWord"
      @form-hovered="wordHover"
      @letters-update="lettersUpdate"
    />

    <builder-grid
      :words="words"
      :blanks="blanks"
      :letters="letters"
      :grid-width="width"
      :grid-height="height"
      :filled-words="filledWords"
      :focused-cell="focusedCell"
      :hovered-word="hoveredWord"
      :edit-grid-mode="editGridMode"
      :suggestion-counts="suggestionCounts"
      @updateblanks="blanksUpdate"
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
    width: 15,
    height: 15,
    blanks: [],
    letters: {},
    loading: false,
    filledWords: [],
    suggestions: [],
    crosswordId: null,
    focusedCell: '0:0',
    hoveredWord: '0:0:0',
    editGridMode: false,
    // eslint-disable-next-line no-magic-numbers
    blankProbability: 1 / 3,
    suggestionCounts: [],
    verticalSym: true,
    horizontalSym: true,
  }),

  computed: {
    statsView () {
      return Object.keys(this.statistics).map((key) => {
        const wordLength = Number(key.replace(/^l/, ''))
        const wordsCount = this.statistics[key].length

        return `${wordLength}-letters words: ${wordsCount} items`
      })
        .sort((a, b) => parseInt(a) - parseInt(b))
        .join('<br>')
    },

    statistics () {
      return this.words.reduce((acc, word) => {
        acc[`l${word.length}`] = acc[`l${word.length}`] || []
        acc[`l${word.length}`].push(word)
        return acc
      }, {})
    },

    horizontalWords () {
      const words = []
      let row = 1

      for (row; row <= this.height; row += 1) {
        const rowBlankCells = this.blanks
          .filter((cell) => Number(cell.split(':')[1]) === row)
          .map((cell) => Number(cell.split(':')[0]))

        if (rowBlankCells.length > 0) {
          const cols = Array.from({ length: this.width }).map((el, idx) => idx + 1)

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
                const x = Number(word.match(/^:(\d+)/)[1])

                words.push({
                  x,
                  y: row,
                  type: 'horizontal',
                  length,
                  question: '',
                  query: this.$root.getWordCells({
                    x,
                    y: row,
                    word: { length },
                    isVertical: false,
                  }).map((idx) => this.letters[idx] || '_')
                    .join(''),
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
            query: this.$root.getWordCells({
              x: 1,
              y: row,
              word: { length: this.width },
              isVertical: false,
            }).map((idx) => this.letters[idx] || '_')
              .join(''),
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
          const rows = Array.from({ length: this.height }).map((el, idx) => idx + 1)

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
                const y = Number(word.match(/^:(\d+)/)[1])

                words.push({
                  x: col,
                  y,
                  type: 'vertical',
                  length,
                  question: '',
                  query: this.$root.getWordCells({
                    x: col,
                    y,
                    word: { length },
                    isVertical: true,
                  }).map((idx) => this.letters[idx] || '_')
                    .join(''),
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
            query: this.$root.getWordCells({
              x: col,
              y: 1,
              word: { length: this.height },
              isVertical: true,
            }).map((idx) => this.letters[idx] || '_')
              .join(''),
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

    sortedByCounts () {
      return Array.from(this.suggestionCounts)
        .sort((a, b) => a.count - b.count)
        .filter((obj) => obj && obj.count > 0 && obj.query.includes('_'))
    },

    nextQuery () {
      return this.sortedByCounts[0] && this.sortedByCounts[0].query
    },

    queries () {
      return this.words.map(({ query }) => query).unique()
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
          if (this.blanks.includes(`${col}:${row}`)) {
            continue
          }
          cells.push({ x: col, y: row })
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

    allSym (value) {
      if (!this.editGridMode) {
        return
      }
      this.crossSym = value
      this.verticalSym = value
      this.horizontalSym = value
    },
  },

  mounted () {
    this.letters = this.letterCells
  },

  methods: {
    verticalSymetria (e) {
      this.verticalSym = !this.verticalSym
    },

    horizontalSymetria (e) {
      this.horizontalSym = !this.horizontalSym
    },

    wordLeave () {
      this.hoveredWord = '0:0:0:0'
    },

    wordHover ({ x, y, isVertical, length }) {
      this.hoveredWord = `${x}:${y}:${Number(isVertical)}:${length}`
    },

    changeSizeClick () {
      this.editGridMode = !this.editGridMode
      if (!this.editGridMode) {
        this.updateSuggestions()
      }
    },

    getWordText ({ id, length, ...letters }) {
      return Object.values(letters).join('')
    },

    removeWord ({ x, y, isVertical, word }) {
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

    refreshSuggestions () {
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

    // generateGrid () {
    //   this.blanks = []
    //   const halfWidth = this.width % 2
    //     ? Math.floor(this.width / 2) + 1
    //     : Math.floor(this.width / 2)
    //   const halfHeight = this.height % 2
    //     ? Math.floor(this.height / 2) + 1
    //     : Math.floor(this.height / 2)

    //   for (let x = 1; x <= halfWidth; x += 1) {
    //     for (let y = 1; y <= halfHeight; y += 1) {
    //       // eslint-disable-next-line no-magic-numbers
    //       if (Math.floor(Math.random() * 1.5)) {
    //         this.blanks.push(`${x}:${y}`)
    //         this.blanks.push(`${this.width - x + 1}:${y}`)
    //         this.blanks.push(`${x}:${this.height - y + 1}`)
    //         this.blanks.push(`${this.width - x + 1}:${this.height - y + 1}`)
    //       }
    //     }
    //   }
    // },

    generateGrid () {
      this.blanks = []
      let fillWidth
      let fillHeight

      if (this.horizontalSym && this.verticalSym) {
        fillWidth = Math.round(this.width / 2)
        fillHeight = Math.round(this.height / 2)
      }
      else {
        fillWidth = this.horizontalSym ? this.width : Math.round(this.width / 2)
        fillHeight = this.verticalSym ? this.height : Math.round(this.height / 2)
      }

      for (let x = 1; x <= fillWidth; x += 1) {
        for (let y = 1; y <= fillHeight; y += 1) {
          if (Math.random() > this.blankProbability) {
            continue
          }

          this.blanksUpdate(`${x}:${y}`)
        }
      }
    },

    clearGrid () {
      this.blanks = []
    },

    rebuildGrid ({ width, height }) {
      this.width = width
      this.height = height
    },

    blanksUpdate (id) {
      const [x, y] = id.split(':')
      const diagonalIndex = `${this.width - x + 1}:${this.height - y + 1}`
      const verticalIndex = `${this.width - x + 1}:${y}`
      const horizontalIndex = `${x}:${this.height - y + 1}`

      if (this.blanks.includes(id)) {
        this.removeBlank(id)

        if (this.verticalSym) {
          this.removeBlank(verticalIndex)
        }

        if (this.horizontalSym) {
          this.removeBlank(horizontalIndex)
        }

        if (this.verticalSym && this.horizontalSym) {
          this.removeBlank(diagonalIndex)
        }

        return
      }

      this.addBlank(id)

      if (this.verticalSym) {
        this.addBlank(verticalIndex)
      }

      if (this.horizontalSym) {
        this.addBlank(horizontalIndex)
      }

      if (this.verticalSym && this.horizontalSym) {
        this.addBlank(diagonalIndex)
      }
    },

    addBlank (id) {
      this.blanks.push(id)
    },

    removeBlank (id) {
      this.blanks = this.blanks.filter((blank) => blank !== id)
    },

    inputLetter ({ x, y, value }) {
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

    focusCell (x, y) {
      this.focusedCell = `${x}:${y}`
    },

    pasteWord ({ word: { id, word }, x, y, isVertical }) {
      Array.from(word).forEach((letter, index) => {
        if (isVertical) {
          this.letters[`${x}:${y + index}`] = letter
        }
        else {
          this.letters[`${x + index}:${y}`] = letter
        }
      })
      this.filledWords.push({ word, x, y, isVertical, clue: null })
      this.$http.get(`clues/find/${word}`)
        .then((response) => {
          this.clues.push({ word, data: response.data.clues })
        })
    },

    pasteClue ({ word: { clue, x, y, isVertical } }) {
      this.$http.post(
        'clues/create',
        { crossword: 1, clue: clue.id }
      )
        .then((response) => {
          const index = this.filledWords.findIndex((item) => item.x === x &&
            item.y === y && item.isVertical === isVertical)

          if (index !== -1) {
            this.filledWords[index].clue = clue
          }
        })
        .catch(console.log)
    },

    newCrossword () {
      fetch(
        'https://crossword.live/crossword/create',
        {
          method: 'POST',
          data: {
            name: 'Test',
            description: '',
            words: '[]',
            blanks: '[]',
            width: this.width,
            height: this.height,
          },
        }
      )
        .then((response) => {
          if (!response.success) {
            return
          }

          const indexes = Object.keys(this.letters)

          for (let idx = indexes.length - 1; idx >= 0; idx -= 1) {
            this.letters[indexes[idx]] = ''
          }

          this.crosswordId = response.data.id
          this.blanks = JSON.parse(response.data.blanks)
          this.filledWords = JSON.parse(response.data.words)
        })
    },

    saveCrossword () {
      this.$http.post(
        `edit/${this.crosswordId}`,
        {
          words: JSON.stringify(this.filledWords),
          blanks: JSON.stringify(this.blanks),
          width: this.width,
          heigth: this.heigth,
        }
      )
    },

    loadCrossword (id) {
      this.$http.get(`item/${id}`)
        .then((response) => {
          const { words, blanks, width, height } = response.data

          this.filledWords = JSON.parse(words)
          this.blanks = JSON.parse(blanks)
          this.height = height
          this.width = width
        })
    },

    lettersUpdate ({ letters }) {
      Object.assign(this.letters, letters)
    },

    getSuggestionsUrl (query, page = 0) {
      return `words/find/${page}/${query}`
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

        const url = `words/count/${query}`
        const response = await this.$http.get(url).catch(console.log)

        this.log.splice(this.log.findIndex((string) => string === url), 1)

        return { query, count: response.data.count }
      }))
    },

    changeDensity ({ density }) {
      // eslint-disable-next-line no-magic-numbers
      this.blankProbability = 1 / density * 2
    },
  },
}
</script>
