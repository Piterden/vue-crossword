<template>
  <div id="crossword">
    <builder-page />
  </div>
</template>

<script>
import BuilderPage from './components/BuilderPage'


export default {
  name: 'App',

  components: { BuilderPage },
}
</script>

<style lang="stylus">
grid-border = #ccc

#crossword
  font-family 'Roboto', Helvetica, Arial, sans-serif
  text-align left
  color #2c3e50
  margin 25px

  .danger
    color #e53935

  ul
    list-style none
    text-align left

    li
      display inline-block
      margin-right 20px

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

  .word-form
    position relative

    .letter
      float left
      width 20px

      > input
        width 17px
        text-align center

      &.filled > input
        background greenyellow

      &.focused > input
        background #FFEB3B

    .question
      width 100%

      .textarea
        margin-top 10px

      .green-plus
        display inline-block
        font-size 2em
        color green
        cursor pointer

    .modal-area
      position absolute
      width 183%
      top 100%
      background #cacdce
      z-index 10
      padding 20px 0

      > .inner
        position relative

        .controls
          text-align center

          .go-to-page
            display inline-block
            margin 0 50px
            font-size 1.35em

        .suggested-list
          li
            width 120px

        .clues-list
          li
            width 100%

        .close
          position absolute
          right 12px
          top -25px
          font-size 2em

    .word-form-overlay
      position absolute
      width 100%
      height 100%
      top 0
      left 0
      background #ccca

  .cell-item
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

  .builder-page
    display flex
    flex-direction row

  .btn
    height 50px
    width 120px

  .toolbox
    padding 20px

  .log
    position absolute
    right 20px

  .builder-grid.page-inner
    display block
    float left
    width 50%
    white-space nowrap

    .cell
      display inline-flex
      margin -2px -1px
      padding 0
      width 30px
      heigth 2

      &.filled > div > input
        background greenyellow

      &.focused > div > input
        background #FFEB3B

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

@media screen and (max-width: 500px)
  #crossword
    .page
      flex-direction column-reverse

      .builder-grid
        margin 0 auto
</style>
