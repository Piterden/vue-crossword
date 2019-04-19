<template>
  <div
    @click="$emit('loadgrid', grid)"
    :style="{
      minWidth: `${width * 10}px`,
      gridTemplateColumns: Array.from({ length: width }).fill('11px').join(' '),
    }"
    class="grid-preview"
  >
    <div v-for="(col, colIdx) in cols" :key="colIdx" class="col">
      <div
        v-for="(row, rowIdx) in rows"
        :key="rowIdx"
        :class="{ blank: blanks.includes(`${col}:${row}`) }"
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
    blanks () {
      return JSON.parse(this.grid.blanks)
    },

    width () {
      return this.grid.width
    },

    cols () {
      return Array.from({ length: this.width }).map((item, idx) => idx + 1)
    },

    height () {
      return this.grid.height
    },

    rows () {
      return Array.from({ length: this.height }).map((item, idx) => idx + 1)
    },
  },
}
</script>
