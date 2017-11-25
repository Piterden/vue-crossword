<template>
  <input type="text" size="1" minlength="1" maxlength="1"
    @click="onCellClick"
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'Cell',
  
  props: {
    isActive: { type: Boolean, default () { return false } },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  
  computed: {
    identifier () {
      return `${this.x}:${this.y}`
    },
  },
  
  methods: {
    onCellClick (e) {
      this.$emit('cellfocus', { id: this.identifier })
    },
    
    onInput (e) {
      this.$emit('cellinput', { id: this.identifier })
    },
  },
}
</script>

<style lang="stylus">

</style>
