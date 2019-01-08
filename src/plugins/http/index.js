import axios from 'axios'


export const http = axios.create()

export default function install (Vue) {
  Object.defineProperty(Vue.prototype, '$http', {
    get () {
      return http
    },
  })
}
