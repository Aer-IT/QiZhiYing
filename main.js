import App from './App'
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
import store from './store'

Vue.use(uView)

// #ifndef VUE3
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  return {
    app
  }
}
// #endif