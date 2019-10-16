<template>
  <div id="crossword">
    <profile-area :user="user" />
    <builder-page />
  </div>
</template>

<script>
import BuilderPage from './components/BuilderPage'
import ProfileArea from './components/ProfileArea'

export default {
  name: 'App',

  components: { BuilderPage, ProfileArea },

  props: {
    user: { type: Object, default: () => null },
  },
}
</script>

<style lang="stylus">
grid-border-color = #ccc
bg-accent-color = #d9d8d4cc
bg-error-color = #b71c1cdd
bg-filled-color = #eafe2b85
txt-danger-color = #e53935
txt-words-color = #f57c00
txt-clues-color = #0f3810
btn-border-color = #CE93D8

#crossword
  font-family 'Roboto', Helvetica, Arial, sans-serif
  text-align left
  color #2c3e50
  margin 25px

  a
    color txt-words-color
    text-decoration none

  .danger
    color txt-danger-color

  ul
    list-style none
    text-align left

    li
      margin-right 20px

  .yellow
    background #F9A825

  .red
    background red
    color white

  .grid
    display inline-table
    border-radius .5em
    overflow hidden
    border 1px solid grid-border-color
    margin: 0 2em

    &.blanks
      input
        cursor pointer

    .row
      height 40px

      &:not(:last-child)
        border-bottom 1px solid grid-border-color

      .cell
        display table-cell
        vertical-align middle
        text-align center
        width 40px
        height 40px

        &:not(:last-child)
          border-right 1px solid grid-border-color

        input
          text-align center
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
    padding-left 35px
    border-bottom 1px solid #009688
    margin-bottom 10px
    padding-bottom 10px

    &.next
      background #c2e6ea

    &.nowords
      background txt-danger-color

    &.error
      background bg-error-color

    .letter
      float left
      width 20px

      input
        width 17px
        text-align center
        text-transform uppercase

      &.filled input
        background bg-filled-color
        border 2px solid grid-border-color

      &.focused input
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

    .words-count
      margin-top 4px

    .modal-area
      position absolute
      width 183%
      top 100%
      left -30px
      background bg-accent-color
      z-index 10
      padding 20px 0
      box-shadow 0 3px 10px #d5a569

      &:after
        content ''
        border-left 20px solid transparent
        border-right 20px solid transparent
        border-bottom 20px solid bg-accent-color
        position absolute
        top -20px
        left 20px

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
            font-family monospace

        .clues-list
          li
            width 100%

        .close
          position absolute
          right 12px
          top -25px
          font-size 1.2em
          color txt-danger-color
          font-weight bold
          text-decoration none

    .index-number
      position absolute
      right calc(100% - 30px)

    .word-form-overlay
      position absolute
      width 100%
      height 100%
      top 0
      left 0
      background bg-accent-color
      text-align center

      .inner
        padding-top 15px

  .cell-item
    display inline-flex
    position relative
    cursor pointer
    width 40px
    height 35px

    &.hovered > input
      background bg-accent-color

    &.red > input
      background bg-error-color

    input
      cursor pointer
      width 100%
      text-align center
      font-size 1.25em
      background transparent
      border 1px solid #000
      text-transform uppercase

    .word-start
      position absolute
      top 2px
      right 3px
      font-size 0.75em
      font-weight bold
      color #1fb1f3

  .builder-page
    width 100%
    display flex
    flex-direction row
    flex-wrap wrap
    align-items flex-start

  .btn
    height 50px
    width 120px
    background bg-accent-color
    border 3px solid btn-border-color
    text-transform uppercase
    font-size 0.8em
    font-weight bold
    color txt-clues-color
    cursor pointer
    transition all 0.3s

    &:hover
      background bg-filled-color

    &.editing
      background bg-filled-color

  .grid-list
    display grid
    grid-gap: 10px
    grid-template-columns: repeat(auto-fill)
    justify-content space-around
    align-items space-around
    overflow-y auto
    background-color white
    flex-grow 1
    flex-shrink 1

  .grid-preview
    display flex
    justify-content center
    align-items stretch
    cursor pointer
    min-width 80px
    width 100%

    .col
      margin 0
      height 100%
      min-width 10px

    .cell
      margin 0 0 -1px -1px
      height 10px
      border 1px solid

      &.blank
        background #000

.builder-grid.page-inner
  white-space nowrap
  flex-shrink 1
  flex-grow 1

  .cell
    display inline-flex
    margin -2px -1px -2px 0px
    padding 0
    width 32px
    height 38px

    &.blank
      background #000

    &.filled > div > input
      background bg-filled-color
      border 2px solid grid-border-color

    &.focused > div > input
      background #FFEB3B

    &.error > div > input
      background red

.toolbox
  text-align center
  display flex
  flex-direction column
  justify-content center
  align-items center
  flex-shrink 1
  flex-grow 1

  > button
    margin-bottom  5px
    display block

  > div
    display flex
    flex-direction column

  .log
    text-align center

    pre
      text-align center

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
    border 1px solid transparent

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
    display inline-grid

    label
      margin-bottom 10px
      display block
      font-size 1.25em

  .controls
    width 300px

    .grid-name-field
      margin-bottom 10px

  .builder-grid.page-inner
    .cell.filled > div.hovered > input
      background bg-accent-color

  .builder-form.page-inner
    display flex
    justify-content center
    align-items flex-start
    overflow-y auto
    overflow-x hidden
    flex-shrink 1
    flex-grow 1

.container
  display flex
  justify-content flex-start
  align-items center
  flex-wrap wrap
  flex-direction column
  flex-grow 1
  flex-shrink 1
  margin-bottom 20px
  margin-left 10px
  margin-right 10px

@media screen and (max-width: 767px)
  #crossword
    min-width auto

    .page
      flex-direction column
      align-items center

      .page-inner
        width 100%
        display flex
        justify-content center

      .builder-grid
        margin 0 auto

    .toolbox
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      flex-wrap wrap

    .grid-list
      width 100%

.slide-left-enter-active
.slide-left-leave-active
.slide-right-enter-active
.slide-right-leave-active
  transition transform .5s linear

.slide-left-enter
.slide-left-leave-to
  transform translate3d(100%, 0, 0)

.slide-right-enter
.slide-right-leave-to
  transform translate3d(-100%, 0, 0)
</style>
