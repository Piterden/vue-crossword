<template>
 <div>
   <span>Width: </span>
   <input type="number" v-model="width" size="4" />
   <span>Height: </span>
   <input type="number" v-model="height" size="4" />
 </div>
</template>

<script>
export default {
  name: 'BuilderForm',
  
  data () {
    return {
      width: 1,
      height: 1,
    }
  },
  
  watch: {
    width (val) {
      this.$emit('rebuild', {
        width: Number(val),
        height: Number(this.height)
      })
    },

    height (val) {
      this.$emit('rebuild', {
        width: Number(this.width),
        height: Number(val)
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
*
  font-size 1.15em
input
  width 40px
  margin-right 20px
  margin-bottom 20px
  border none
  box-shadow 0 0 3px 1px #000
</style>
