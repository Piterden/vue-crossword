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
grid-border = #ccc

#app
  font-family 'Roboto', Helvetica, Arial, sans-serif
  text-align left
  color #2c3e50
  margin 25px

.grid
  display inline-table
  border-radius .5em
  overflow hidden
  border 1px solid grid-border
  margin: 0 2em

  &.blanks
    input
      cursor: pointer

  .row
    height 40px

    &:not(:last-child)
      border-bottom 1px solid grid-border

    .cell
      display table-cell
      vertical-align middle
      text-align center
      width 40px
      height 40px

      &:not(:last-child)
        border-right 1px solid grid-border

      input
        text-align center
        width 1em
        height 1em
        font-size 1.35rem
        text-transform uppercase
        border none
        transition all .2s
        width 100%
        height 100%
        outline none

      &.blank
        background-color #aaa

        input
          background-color inherit
          cursor default

      &.start
        background #ff00be

      &.active
        font-weigth bold
        background rgba(5, 55, 225, .6)
</style>
