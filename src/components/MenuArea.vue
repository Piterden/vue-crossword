<template>
  <ul>
    <li v-for="page in pages">
      <div class="inner">
        <router-link :to="page.href">
          {{ page.title }}
        </router-link>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MenuArea',
  
  props: {
    pages: {
      type: Array,
      default () {
        return [
          {
            title: 'Builder',
            href: '/builder',
          },
          {
            title: 'Crossword',
            href: '/crossword',
          },
        ]
      },
    },
  },
}
</script>

<style lang="stylus">
ul
  list-style none
  text-align left
  li
    display inline-block
    margin-right 20px
</style>
