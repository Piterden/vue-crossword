<template>
  <section>
    <div v-if="modeName === 'Grid'">
      <span>Grid Height: {{ width }}</span>
      <input type="range" v-model="width" size="4" min="1" max="40" />
      <span>Grid Width: {{ height }}</span>
      <input type="range" v-model="height" size="4" min="1" max="40" />
    </div>

    <div>
      <span>You are currently editing the <b>{{ modeName }}</b></span>
      <br />
      <div class="button" @click="isEditBlanks = !isEditBlanks">Change</div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BuilderForm',

  data: () => ({
    width: null,
    height: null,
    isEditBlanks: true,
  }),

  props: {
    initWidth: { type: Number, default: () => 1 },
    initHeight: { type: Number, default: () => 1 },
  },

  created () {
    this.width = this.initWidth
    this.height = this.initHeight
  },

  computed: {
    modeName () {
      return this.isEditBlanks ? 'Grid' : 'Words'
    }
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

    isEditBlanks (value) {
      this.$emit('mode', value)
    },
  },
}
</script>

<style lang="stylus" scoped>
input
  width 100%
  margin-bottom 1rem
  border none

section
  display: flex
  flex-direction: column
  bottom: 0
  right: 2em
  justify-content: flex-start
  align-items: flex-start

div
  margin: 2em 0

.button
  display: inline-flex
  background-color: #08f
  padding: .75em 1.5em
  border-radius: 3px
  color: white
  cursor: pointer
  opacity: 0.8
  transition: all .3s

  &:hover
    opacity: 1

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

input[type=range]::-webkit-slider-thumb
  height: 2em
  width: 2em
  border-radius: 50%
  background: #08f
  cursor: pointer
  -webkit-appearance: none
  margin-top: -11px

input[type=range]:focus::-webkit-slider-runnable-track
  /* background: #3071A9 */

</style>
