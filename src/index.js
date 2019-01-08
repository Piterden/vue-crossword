// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './shitcode'
import App from './App'
import router from './router'
import { http } from './plugins'


Vue.config.devTools = true
Vue.config.productionTip = false

Vue.use(http)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  methods: {
    serialize (obj, prefix) {
      let str = []
      let prop

      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) { // eslint-disable-line
          let key = prefix ? `${prefix}[${prop}]` : prop
          let value = obj[prop]

          str.push((value !== null && typeof value === 'object')
            ? this.serialize(value, key)
            : encodeURIComponent(key) + '=' + encodeURIComponent(value))
        }
      }
      return str.join('&')
    },

    async fetch (url) {
      const response = await fetch(url, { mode: 'no-cors' })

      return response
    },

    getAllWordCells (words) {
      return words.flatMap(this.getWordCells)
    },

    getWordCells ({ word, x, y, isVertical }) {
      return new Array(word.length).fill(null)
        .map((letter, idx) => isVertical ? `${x}:${y + idx}` : `${x + idx}:${y}`)
    },

    getWordLetters ({ word }) {
      return new Array(word.length).fill(null)
        .map((letter, idx) => word[idx])
    },
  },
  template: '<App/>',
})
