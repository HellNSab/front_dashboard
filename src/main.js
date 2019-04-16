import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import VueScheduler from 'v-calendar-scheduler'
import VCalendar from 'v-calendar'

Vue.use(VueScheduler)
Vue.use(VCalendar)

Vue.config.productionTip = false

Vue.component('v-icon', Icon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
