<template>
  <div>
    <div class="answer-letters">
      <div class="letter"
        v-for="(letter, idx) of cells"
        :key="idx"
      >
        <input type="text" size="1" minlength="1" maxlength="1"
          v-model="answer[index]"
        />
      </div>
    </div>

    <div class="question">
      <textarea type="text" class="textarea" rows="5"
        v-model="question"
        :placeholder="`${index}. `"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordForm',

  data() {
    return {
      question: '',
      answer: new Array(this.length).fill(null),
      active: null,
    }
  },

  props: {
    x: { type: Number, default: () => 0 },
    y: { type: Number, default: () => 0 },
    index: { type: Number, default: () => 0 },
    length: { type: Number, default: () => 0 },
    isVertical: { type: Boolean, default: () => false },
  },

  computed: {
    cells() {
      let i = this.isVertical ? this.x : this.y

      return new Array(this.length).fill(0).map((cell) => ({
        x: this.isVertical ? i++ : this.x,
        y: this.isVertical ? this.y : i++,
        value: '',
      }))
    },
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
