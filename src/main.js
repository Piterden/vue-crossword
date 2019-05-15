// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './shitcode'
import App from './App'
import router from './router'


Vue.config.devTools = true
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#crossword',
  router,
  components: { App },
  template: '<App/>',
})
