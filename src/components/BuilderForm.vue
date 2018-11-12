<template>
  <div class="builder-form page-inner">
    <div class="controls">
      <span>Grid Height: {{ width }}</span>
      <input type="range" v-model="width" size="4" min="1" max="40" />
      <span>Grid Width: {{ height }}</span>
      <input type="range" v-model="height" size="4" min="1" max="40" />
    </div>

    <div class="forms-list-wrapper horizontal">
      <label>Horizontal questions:</label>
      <div class="forms-list">
        <word-form
          v-for="(word, index) in horizontalWords"
          :key="index"
          :x="word.x"
          :y="word.y"
          :length="word.length"
          :index="word.index"
          :is-vertical="false"
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
          :length="word.length"
          :index="word.index"
          :is-vertical="true"
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

  data() {
    return {
      width: this.initWidth,
      height: this.initHeight,
    }
  },

  props: {
    words: { type: Array, default: () => [] },
    initWidth: { type: Number, default: () => 1 },
    initHeight: { type: Number, default: () => 1 },
  },

  computed: {
    verticalWords() {
      return this.words.filter(({ type }) => type === 'vertical')
    },

    horizontalWords() {
      return this.words.filter(({ type }) => type === 'horizontal')
    },
  },

  watch: {
    width(value) {
      this.$emit('rebuild', {
        width: Number(value),
        height: Number(this.height),
      })
    },

    height(value) {
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

  &.builder-form
    display flex
    flex-direction column

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
  background #ddd
  border none

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
  transition background .6s ease-out

input[type=range]::-webkit-slider-thumb
  height: 2em
  width: 2em
  border-radius: 50%
  background: #08f
  cursor: pointer
  -webkit-appearance: none
  margin-top: -11px

input[type=range]:focus::-webkit-slider-runnable-track
  background: #f001A9
</style>
