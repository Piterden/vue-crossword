<template>
  <div>
    <sup class="word-start">{{ number }}</sup>
    <input
      v-model="value"
      type="text"
      size="1"
      minlength="1"
      maxlength="1"
      readonly
      @click="onClick"
      @focus="onFocus"
      @input="onInput"
    />
  </div>
</template>

<script>
export default {
  name: 'Cell',

  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    value: { type: String, default: () => '' },
    number: { type: Number, default: () => 0 },
    isBlank: { type: Boolean, default: () => false },
    isActive: { type: Boolean, default: () => false },
  },

  computed: {
    identifier () {
      return `${this.x}:${this.y}`
    },
  },

  methods: {
    onClick (e) {
      this.$emit('cellclick', { id: this.identifier })
    },

    onInput () {
      this.$emit('cellinput', { id: this.identifier })
    },

    onFocus (e) {
      if (this.$parent.isEditBlanks) {
        return e.target.blur()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
div
  display inline-flex
  position relative
  cursor pointer
  width 40px
  height 40px

  input
    cursor pointer
    width 100%
    text-align center
    font-size 1.25em

  .word-start
    position absolute
    top 1px
    right 2px
    font-size 10px
    color blue
</style>
