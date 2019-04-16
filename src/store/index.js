import Vue from 'vue'
import Vuex from 'vuex'
import todos from './modules/todos'
import notes from './modules/notes'
import lists from './modules/lists'
import weekly from './modules/weekly'
import events from './modules/events'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    todos,
    notes,
    lists,
    weekly,
    events
  }
})