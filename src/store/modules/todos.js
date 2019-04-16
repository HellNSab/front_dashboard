import feathersApi from '@/api/feathersApi'

const state = {
  todoList: []
}

const mutations = {
  FETCH_TODOS (state, todos) {
    state.todoList = todos
  },
  CREATE_TODO (state, newTodo) {
    state.todoList = [
      ...state.todoList,
      newTodo
    ]
  },
  UPDATE_TODO (state, newTodo) {
    state.todoList = state.todoList
      .map(todo => {
        if (todo._id !== newTodo._id) return todo
        return newTodo
      })
  },
  DELETED_TODO (state, todoId) {
    state.todoList = state.todoList.filter(todo => todo._id !== todoId)
  }
}

const actions = {
  async fetchTodos ({ commit }) {
    const todoFetchResponse = await feathersApi.get('todos')
    commit('FETCH_TODOS', todoFetchResponse.data)
  },
  async createTodo ({ commit }) {
    const newTodo = await feathersApi.post('todos')
    commit('CREATE_TODO', newTodo)
  },
  async editTodo ({ commit }, { todo, todoText }) {
    const newTodo = await feathersApi.put(`todos/${todo._id}`, { ...todo, text: todoText })
    commit('UPDATE_TODO', newTodo)
  },
  async editTodoStatus ({ commit }, todo) {
    const newTodo = await feathersApi.put(`todos/${todo._id}`, { ...todo, done: !todo.done })
    commit('UPDATE_TODO', newTodo)
  },
  async deleteTodo ({ commit }, todoId) {
    await feathersApi.delete(`todos/${todoId}`)
    commit('DELETED_TODO', todoId)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
