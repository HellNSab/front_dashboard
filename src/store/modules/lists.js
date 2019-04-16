import feathersApi from '@/api/feathersApi'

const state = {
    allLists: [],
    currentList: {}
}

const mutations = {
  FETCH_LISTS (state, lists) {
    state.allLists = lists
    state.currentList = lists[0] || {}
  },
  CREATE_LIST (state, newList) {
    state.currentList = newList
    state.allLists = [ ...state.allLists, newList ]
  },
  UPDATE_LIST (state, newList) {
    state.currentList = newList
    state.allLists = state.allLists.map(list => {
      if (list._id !== newList._id) return list
      return newList
    })
  },
  CHANGE_CURRENT_LIST (state, newCurrentList) {
    state.currentList = newCurrentList
  },
  DELETE_LIST (state, listToDelete) {
    state.allLists = state.allLists.filter(list => list._id !== listToDelete._id)
    state.currentList = state.allLists[0]
  }
}

const actions = {
  async fetchLists ({ commit }) {
    const lists = await feathersApi.get('lists')
    commit('FETCH_LISTS', lists.data)
  },
  async createList ({ commit }, newListName) {
    const newList = await feathersApi.post('lists', { name: newListName })
    commit('CREATE_LIST', newList)
  },
  async updateListName ({ commit, state }, newListName) {
    const newList = await feathersApi.put(`/lists/${state.currentList._id}`, { ...state.currentList, name: newListName })
    commit('UPDATE_LIST', newList)
  },
  async updateList ({ commit }, list) {
    const newList = await feathersApi.put(`/lists/${list._id}`, list)
    commit('UPDATE_LIST', newList)
  },
  changeCurrentList ({ commit }, newCurrentList) {
    commit('CHANGE_CURRENT_LIST', newCurrentList)
  },
  async deleteList ({ commit }, listToDelete) {
    await feathersApi.delete(`lists/${listToDelete._id}`)
    commit('DELETE_LIST', listToDelete)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
