<template>
  <div @click="$emit('loadgrid', { grid, width, height })" class="grid-preview">
    <div v-for="(col, colIdx) in cols" :key="colIdx" class="col">
      <div
        v-for="(row, rowIdx) in rows"
        :key="rowIdx"
        :class="{ blank: JSON.parse(grid.blanks).includes(`${col}:${row}`) }"
        class="cell"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridPreview',

  props: {
    grid: { type: Object, default: () => ({}) },
  },

  computed: {
    width () {
      return Math.max(...this.grid.blanks.match(/\d+(?=:)/g))
    },

    cols () {
      return Array.from({ length: this.height }).map((item, idx) => idx + 1)
    },

    height () {
      return Math.max(...this.grid.blanks.match(/(?<=:)\d+/g))
    },

    rows () {
      return Array.from({ length: this.width }).map((item, idx) => idx + 1)
    },
  },
}
</script>
