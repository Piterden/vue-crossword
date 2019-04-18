<template>
  <div class="builder-form page-inner">
    <div v-show="changeSizeMode" class="controls">
      <span>Grid Width: <input v-model="width" type="number" /></span>
      <input
        ref="sizeWidth"
        v-model="width"
        type="range"
        size="4"
        min="2"
        max="40"
      />
      <span>Grid Height: <input v-model="height" type="number" /></span>
      <input
        ref="sizeHeight"
        v-model="height"
        type="range"
        size="4"
        min="2"
        max="40"
      />
      <span>Density: 1 / <input v-model="density" type="number" /></span>
      <input
        ref="sizeHeight"
        v-model="density"
        type="range"
        size="4"
        min="4"
        max="40"
      />
    </div>

    <div v-show="!changeSizeMode" class="forms-list-wrapper horizontal">
      <label>Horizontal questions:</label>
      <div class="forms-list">
        <word-form
          v-for="(word, index) in horizontalWords"
          :key="`h${index}`"
          :x="word.x"
          :y="word.y"
          :clues="clues"
          :letters="letters"
          :loading="loading"
          :index="word.index"
          :length="word.length"
          :is-vertical="false"
          :next-query="nextQuery"
          :suggestions="suggestions"
          :filled-words="filledWords"
          :focused-cell="focusedCell"
          :suggestion-counts="suggestionCounts"
          @input="(payload) => $emit('input', payload)"
          @focus-cell="(x, y) => $emit('focus-cell', x, y)"
          @paste-clue="(payload) => $emit('paste-clue', payload)"
          @paste-word="(payload) => $emit('paste-word', payload)"
          @form-leaved="(payload) => $emit('form-leaved', payload)"
          @remove-word="(payload) => $emit('remove-word', payload)"
          @form-hovered="(payload) => $emit('form-hovered', payload)"
          @letters-update="(payload) => $emit('letters-update', payload)"
        />
      </div>
    </div>

    <div v-show="!changeSizeMode" class="forms-list-wrapper vertical">
      <label>Vertical questions:</label>
      <div class="forms-list">
        <word-form
          v-for="(word, index) in verticalWords"
          :key="`v${index}`"
          :x="word.x"
          :y="word.y"
          :clues="clues"
          :letters="letters"
          :loading="loading"
          :length="word.length"
          :index="word.index"
          :is-vertical="true"
          :next-query="nextQuery"
          :suggestions="suggestions"
          :filled-words="filledWords"
          :focused-cell="focusedCell"
          :suggestion-counts="suggestionCounts"
          @input="(payload) => $emit('input', payload)"
          @focus-cell="(x, y) => $emit('focus-cell', x, y)"
          @paste-clue="(payload) => $emit('paste-clue', payload)"
          @paste-word="(payload) => $emit('paste-word', payload)"
          @form-leaved="(payload) => $emit('form-leaved', payload)"
          @remove-word="(payload) => $emit('remove-word', payload)"
          @form-hovered="(payload) => $emit('form-hovered', payload)"
          @letters-update="(payload) => $emit('letters-update', payload)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import WordForm from './WordForm'


import { MAX_GRID_SIZE } from '../index'

export default {
  name: 'BuilderForm',

  components: { WordForm },

  props: {
    max: MAX_GRID_SIZE,
    size: { type: Object, default: () => [1, 1] },
    words: { type: Array, default: () => [] },
    clues: { type: Array, default: () => [] },
    letters: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: () => false },
    nextQuery: { type: String, default: () => '' },
    filledWords: { type: Array, default: () => [] },
    suggestions: { type: Array, default: () => [] },
    focusedCell: { type: String, default: () => '0:0' },
    twoLetterWords: { type: Array, default: () => [] },
    threeLetterWords: { type: Array, default: () => [] },
    changeSizeMode: { type: Boolean, default: () => false },
    // eslint-disable-next-line no-magic-numbers
    blankProbability: { type: Number, default: () => 4 },
    suggestionCounts: { type: Array, default: () => [] },
  },

  data () {
    return {
      width: this.size.width,
      height: this.size.height,
      density: this.blankProbability,
    }
  },

  computed: {
    verticalWords () {
      return this.words.filter(({ type }) => type === 'vertical')
    },

    horizontalWords () {
      return this.words.filter(({ type }) => type === 'horizontal')
    },
  },

  watch: {
    width (value) {
      this.$emit('changesize', { width: value })
    },

    height (value) {
      this.$emit('changesize', { height: value })
    },

    density (value) {
      this.$emit('density', {
        density: Number(value),
      })
    },

    size: {
      handler ({ width, height }) {
        this.width = width
        this.height = height

        this.$emit('rebuild', {
          width: Number(this.width),
          height: Number(this.height),
        })
      },
      deep: true,
    },
  },
}
</script>
