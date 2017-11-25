<template>
  <div class="page builder-page">
    <builder-form @rebuild="rebuildGrid" />
    <builder-grid
      :grid-width="width"
      :grid-height="height"
    />
  </div>
</template>

<script>
import BuilderGrid from './BuilderGrid'
import BuilderForm from './BuilderForm'
  
export default {
  name: 'BuilderPage',
  
  components: { BuilderForm, BuilderGrid },
  
  data () {
    return {
      width: 1,
      height: 1,
      black: [],
    }
  },
  
  methods: {
    rebuildGrid (payload) {
      this.width = payload.width
      this.height = payload.height
    },
  },
}
</script>

<style>

</style>
