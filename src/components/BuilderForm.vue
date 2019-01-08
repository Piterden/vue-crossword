<template>
  <div class="builder-form page-inner">
    <div class="controls">
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

    <div class="forms-list-wrapper horizontal">
      <label>Horizontal questions:</label>
      <div class="forms-list">
        <word-form
          v-for="(word, index) in horizontalWords"
          :key="index"
          :x="word.x"
          :y="word.y"
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
          @paste-word="(payload) => $emit('paste-word', payload)"
          @letters-update="(payload) => $emit('letters-update', payload)"
        />
      </div>
    </div>

    <div class="forms-list-wrapper vertical">
      <label>Vertical questions:</label>
      <div class="forms-list">
        <word-form
          v-for="(word, index) in verticalWords"
          :key="index"
          :x="word.x"
          :y="word.y"
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
          @paste-word="(payload) => $emit('paste-word', payload)"
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
    letters: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: () => false },
    initWidth: { type: Number, default: () => 1 },
    initHeight: { type: Number, default: () => 1 },
    filledWords: { type: Array, default: () => [] },
    suggestions: { type: Array, default: () => [] },
    focusedCell: { type: String, default: () => '0:0' },
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

<style lang="stylus">
.page-inner
  width calc(50% - 30px)
  margin-right 30px

.button
  display flex
  background-color #08f
  border-radius 3px
  color #fff
  cursor pointer
  opacity 0.8
  transition opacity .3s

  &:hover
    opacity 1

.cell.blank > div input
  background #000
  border none

input[type=range]
  -webkit-appearance none
  height 38px
  margin 10px 0
  width 100%

  &:focus
    outline none

    &::-webkit-slider-runnable-track
      background #f001A9

  &::-webkit-slider-runnable-track
    width 100%
    height 10px
    cursor pointer
    animate 0.2s
    background #eee
    border-radius 5px
    transition background .6s ease-out

  &::-webkit-slider-thumb
    height 2em
    width 2em
    border-radius 50%
    background #08f
    cursor pointer
    -webkit-appearance none
    margin-top -11px

.forms-list-wrapper
  width 50%
  float left
</style>
