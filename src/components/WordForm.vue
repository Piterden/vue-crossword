<template>
  <div>
    <span class="index">{{ word.index }}</span>
    <textarea type="text" v-model="question"></textarea>
    <div class="answer-letters">
      <input type="text" size="1"
        v-for="(letter, index) in cells"
        v-model="answer[index]"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordForm',

  data () {
    return {
      question: '',
      answer: new Array(this.word.length).fill(' ').join(''),
    }
  },

  props: {
    dir: { type: String, default: () => 'horizontal' },
    word: { type: Object, default: () => ({ x: null, y: null, value: '' }) },
  },

  computed: {
    cells () {
      let i = this.word.x

      return new Array(this.word.length).fill(0).map((cell) => ({
        x: i++,
        y: this.word.y,
        value: '',
      }))
    },
  },
}
</script>
