import feathersApi from '@/api/feathersApi'

const state = {
    htmlNotes: '',
    htmlNotesId: ''
}

const mutations = {
  FETCH_HTML_NOTES (state, htmlNotes) {
    state.htmlNotes = htmlNotes.text
    state.htmlNotesId = htmlNotes._id
  },
  UPDATE_HTML_NOTES (state, newHtmlNotes) {
    state.htmlNotes = newHtmlNotes.text
  }
}

const actions = {
  async fetchHtmlNotes ({ commit }) {
    const htmlNotes = await feathersApi.get('notes')
    commit('FETCH_HTML_NOTES', htmlNotes.data[0])
  },
  async updateHtmlNotes ({ commit, state }, htmlNotes) {
    const newHtmlNotes = await feathersApi.put(`notes/${state.htmlNotesId}`, { text: htmlNotes })
    commit('UPDATE_HTML_NOTES', newHtmlNotes)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
