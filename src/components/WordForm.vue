<template>
  <div>
    <div class="answer-letters">
      <div
        v-for="(letter, idx) of cells"
        :key="idx"
        class="letter"
      >
        <input
          v-model="answer[index]"
          type="text"
          size="1"
          minlength="1"
          maxlength="1"
        />
      </div>
    </div>

    <div class="question">
      <textarea
        v-model="question"
        :placeholder="`${questionNumber}. `"
        type="text"
        class="textarea"
        rows="5"
        @focus="!question ? question = `${questionNumber}. ` : question"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordForm',

  props: {
    x: { type: Number, default: () => 0 },
    y: { type: Number, default: () => 0 },
    index: { type: Number, default: () => 0 },
    length: { type: Number, default: () => 0 },
    isVertical: { type: Boolean, default: () => false },
  },

  data () {
    return {
      question: '',
      answer: new Array(this.length).fill(null),
      active: null,
      questionNumber: null,
    }
  },

  computed: {
    cells () {
      let idx = this.isVertical ? this.x : this.y

      return new Array(this.length).fill(0)
        // eslint-disable-next-line no-return-assign
        .map(() => ({
          x: this.isVertical ? idx += 1 : this.x,
          y: this.isVertical ? this.y : idx += 1,
          value: '',
        }))
    },
  },

  mounted () {
    this.questionNumber = this.isVertical
      ? this.index - 1
      : this.index
  },
}
</script>

<style lang="stylus" scoped>
.answer-letters
  float left
  width 100%

  .letter
    float left
    width 20px

    > input
      width 17px

  .question
    width 100%
    background #eee

    .textarea
      margin-top 10px
      width calc(100% - 6px)
</style>
