<template>
  <div>
    <sup class="word-start">{{ number }}</sup>
    <input type="text" size="1" minlength="1" maxlength="1"
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
    isBlank: { type: Boolean, default: () => false },
    isActive: { type: Boolean, default: () => false },
    number: { type: Number, default: () => 0 },
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
  position relative

  .word-start
    position absolute
    top -5px
    right 2px
    font-size 10px
    color blue
</style>
