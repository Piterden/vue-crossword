<template>
  <div>
    <span>Height: {{ width }}</span>
    <input type="range" v-model="width" size="4" min="1" max="40" />
    <span>Width: {{ height }}</span>
    <input type="range" v-model="height" size="4" min="1" max="40" />
    <input type="button"
      :value="modeName"
      @click="modeToggle"
    />
  </div>
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
      return this.isEditBlanks ? 'Edit grid' : 'Edit words'
    },
  },
  
  methods: {
    modeToggle () {
      this.isEditBlanks = !this.isEditBlanks
    },
  },
  
  watch: {
    width (val) {
      this.$emit('rebuild', {
        width: Number(val),
        height: Number(this.height),
      })
    },

    height (val) {
      this.$emit('rebuild', {
        width: Number(this.width),
        height: Number(val),
      })
    },
    
    isEditBlanks (isEditBlanks) {
      this.$emit('mode', isEditBlanks)      
    },
  },
}
</script>

<style lang="stylus" scoped>
*
  font-size 1.15rem
input
  width 100%
  margin-bottom 1rem
  border none
  box-shadow inset 0 0 6px 1px #000
</style>
