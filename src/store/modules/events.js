import feathersApi from '@/api/feathersApi'

const state = {
  eventList: []
}

const mutations = {
  FETCH_EVENTS (state, events) {
    state.eventList = events
  },
  CREATE_EVENT (state, newEvent) {
    state.eventList = [
      ...state.eventList.filter(event => event._id),
      newEvent
    ]
  },
  UPDATE_EVENT (state, newEvent) {
    state.eventList = state.eventList
      .map(event => {
        if (event._id !== newEvent._id) return event
        return newEvent
      })
  },
  DELETED_EVENT (state, eventId) {
    state.eventList = state.eventList.filter(event => event._id !== eventId)
  }
}

const actions = {
  async fetchEvents ({ commit }) {
    const eventFetchResponse = await feathersApi.get('calendar-event')
    commit('FETCH_EVENTS', eventFetchResponse.data)
  },
  async createEvent ({ commit }, eventToCreate) {
    const newEvent = await feathersApi.post('calendar-event', eventToCreate)
    commit('CREATE_EVENT', newEvent)
  },
  async editEvent ({ commit }, { event, editedEvent }) {
    const newEvent = await feathersApi.put(`calendar-event/${event._id}`, { ...event, ...editedEvent })
    commit('UPDATE_EVENT', newEvent)
  },
  async deleteEvent ({ commit }, eventId) {
    await feathersApi.delete(`calendar-event/${eventId}`)
    commit('DELETED_EVENT', eventId)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
