<template>
  <div>
    <span class="index">{{ number }}</span>

    <div class="answer-letters">
      <div class="letter"
        v-for="(letter, index) of cells"
        :key="index"
      >
        <input type="text" size="1" minlength="1" maxlength="1"
          v-model="answer[index]"
        />
      </div>
    </div>

    <div class="question">
      <textarea type="text" class="textarea"
        v-model="question"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordForm',

  data () {
    return {
      question: '',
      answer: new Array(this.length).fill(null),
      active: null,
    }
  },

  props: {
    x: { type: Number, default: () => 0 },
    y: { type: Number, default: () => 0 },
    length: { type: Number, default: () => 0 },
    number: { type: Number, default: () => 0 },
    isVertical: { type: Boolean, default: () => false },
  },

  computed: {
    cells () {
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
.letter
  float left
  width 20px

  > input
    width 17px

.question
  width 100%

  .textarea
    margin-top 10px
    width 100%
</style>
