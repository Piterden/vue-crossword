<template>
  <div id="app">
    <menu-area />
    <router-view />
  </div>
</template>

<script>
import MenuArea from './components/MenuArea'
  
export default {
  name: 'App',
  
  components: { MenuArea },
}
</script>

<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  text-align left
  color #2c3e50
  margin 25px
.grid
  display inline-table
  .row
    // border 1px solid red
    height 40px
    .cell
      display table-cell
      border 1px solid blue
      vertical-align middle
      text-align center
      width 40px
      height 40px
      input
        text-align center
        width 32px
        height 30px
        font-size 1.35rem
        background rgba(255, 255, 77, .6)
      &.blank
        background #000
        input
          background #000
          cursor default
      &.start
        background #ff00be
      &.active
        font-weigth bold
        background rgba(5, 55, 225, .6)
</style>