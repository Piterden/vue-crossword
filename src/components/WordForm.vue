<template>
  <div>
    <input type="text" v-model="question">
    <input type="text" v-model="answer">
  </div>
</template>

<script>
export default {
  name: 'WordForm',

  data: () => ({
    question: '',
    answer: '',
  })

  props: {
    dir: { type: String, default: () => 'horizontal' },
    word: { type: Object, default: () => null },
  },

  computed: {
    cells () {

    },
  },
}
</script>
