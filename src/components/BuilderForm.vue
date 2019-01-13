<template>
  <div class="builder-form page-inner">
    <div v-show="changeSizeMode" class="controls">
      <span>Grid Width: {{ width }}</span>
      <input
        ref="sizeWidth"
        v-model="width"
        type="range"
        size="4"
        min="1"
        max="40"
      />
      <span>Grid Height: {{ height }}</span>
      <input
        ref="sizeHeight"
        v-model="height"
        type="range"
        size="4"
        min="1"
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
          @form-hovered="(payload) =>  $emit('form-hovered', payload)"
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


export default {
  name: 'BuilderForm',

  components: { WordForm },

  props: {
    words: { type: Array, default: () => [] },
    clues: { type: Array, default: () => [] },
    letters: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: () => false },
    initWidth: { type: Number, default: () => 1 },
    initHeight: { type: Number, default: () => 1 },
    filledWords: { type: Array, default: () => [] },
    suggestions: { type: Array, default: () => [] },
    focusedCell: { type: String, default: () => '0:0' },
    changeSizeMode: { type: Boolean, default: () => false },
    suggestionCounts: { type: Array, default: () => [] },
  },

  data () {
    return {
      width: this.initWidth,
      height: this.initHeight,
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
  },
}
</script>
