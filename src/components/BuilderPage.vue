<template>
  <div class="page builder-page">
    <builder-grid
      :grid-width="width"
      :grid-height="height"
      :blanks="blanks"
      :is-edit-blanks="isEditBlanks"
      @updateblanks="onBlanksUpdate"
    />

    <builder-form
      :init-width="width"
      :init-height="height"
      @rebuild="rebuildGrid"
      @mode="onToggleMode"
    />
  </div>
</template>

<script>
import BuilderGrid from './BuilderGrid'
import BuilderForm from './BuilderForm'

export default {
  name: 'BuilderPage',

  components: { BuilderForm, BuilderGrid },

  mounted () {
    this.toggleMode()
  },

  data: () => ({
    width: 10,
    height: 10,
    blanks: [],
    isEditBlanks: true,
  }),

  methods: {
    rebuildGrid (payload) {
      this.width = payload.width
      this.height = payload.height
    },

    toggleMode () {
      document.querySelector('.grid')
        .classList
        .toggle('blanks', this.isEditBlanks)
    },

    onToggleMode (payload) {
      this.isEditBlanks = payload
      this.toggleMode()
    },

    onBlanksUpdate (id) {
      if (!this.blanks.includes(id)) {
        return this.blanks.push(id)
      }

      this.blanks = this.blanks.filter(i => i !== id)
    },
  },
}
</script>

<style lang="stylus">

.page
  display: flex
  justify-content: space-between

@media screen and (max-width: 500px)
  .page
    flex-direction: column-reverse

    .grid
      margin: 0 auto

</style>
