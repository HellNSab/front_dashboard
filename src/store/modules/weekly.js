import feathersApi from '@/api/feathersApi'
import moment from 'moment'

const state = {
  week_id: '',
  previousWeeklyId: '',
  nextWeeklyId: '',
  weeklyStartDate: '',
  weeklyEndDate: '',
  days: []
}

const mutations = {
  FETCH_CURRENT_WEEKLY_SPREAD (state, weeklySpreads) {
    const currentWeeklySpread = weeklySpreads.find(week => moment(new Date()).isSameOrAfter(week.weeklyStartDate) && moment(new Date()).isSameOrBefore(week.weeklyEndDate))
    if (currentWeeklySpread) {
      state.week_id = currentWeeklySpread._id
      state.days = currentWeeklySpread.days
      state.weeklyEndDate = currentWeeklySpread.weeklyEndDate
      state.weeklyStartDate = currentWeeklySpread.weeklyStartDate
      state.previousWeeklyId = currentWeeklySpread.previousWeeklyId
      state.nextWeeklyId = currentWeeklySpread.nextWeeklyId
    }
    else if (weeklySpreads.length) {
      state.week_id = weeklySpreads[weeklySpreads.length - 1]._id
      state.days = weeklySpreads[weeklySpreads.length - 1].days
      state.weeklyEndDate = weeklySpreads[weeklySpreads.length - 1].weeklyEndDate
      state.weeklyStartDate = weeklySpreads[weeklySpreads.length - 1].weeklyStartDate
      state.previousWeeklyId = weeklySpreads[weeklySpreads.length - 1].previousWeeklyId
      state.nextWeeklyId = weeklySpreads[weeklySpreads.length - 1].nextWeeklyId
    }
  },
  FETCH_WEEKLY_SPREAD (state, weeklySpread) {
    state.week_id = weeklySpread._id
    state.days = weeklySpread.days
    state.previousWeeklyId = weeklySpread.previousWeeklyId
    state.nextWeeklyId = weeklySpread.nextWeeklyId
    state.weeklyEndDate = weeklySpread.end
  },
  UPDATED_CURRENT_WEEKLY_SPREAD (state, weekDays) {
    state.days = weekDays
  },
  CREATED_WEEKLY_SPREAD (state, newWeeklySpread) {
    state.week_id = newWeeklySpread._id
    state.days = newWeeklySpread.days
    state.previousWeeklyId = newWeeklySpread.previousWeeklyId
    state.nextWeeklyId = ''
    state.weeklyEndDate = newWeeklySpread.weeklyEndDate
    state.weeklyStartDate = newWeeklySpread.weeklyStartDate
  }
}

const actions = {
  async fetchCurrentWeeklySpread ({ commit }) {
    const weeklyFetchResponse = await feathersApi.get('weekly-spread')
    commit('FETCH_CURRENT_WEEKLY_SPREAD', weeklyFetchResponse.data)
  },
  async updateWeeklySpread ({ commit, state }, newWeekDays) {
    await feathersApi.put(`weekly-spread/${state.week_id}`, { 
      _id: state.week_id,
      days: newWeekDays,
      nextWeeklyId: state.nextWeeklyId,
      previousWeeklyId: state.previousWeeklyId,
      weeklyStartDate: state.weeklyStartDate,
      weeklyEndDate: state.weeklyEndDate
    })
    commit('UPDATED_CURRENT_WEEKLY_SPREAD', newWeekDays)
  },
  async createDayTodo ({ state, dispatch }, { newTodoText, date, todoIndex }) {
    const newDayTodo = { text: newTodoText, done: false, _id: `${state.week_id}_${date}_${todoIndex}` }
    const newWeekDays = state.days.map(day => {
      if (day.date !== date) return day
      return { ...day, todos: [ ...day.todos, newDayTodo ] }
    })
    await dispatch('updateWeeklySpread', newWeekDays)
  },
  async editDayTodo ({ state, dispatch }, { updatedTodo, date }) {
    const newTodoList = state.days
      .find(day => day.date === date)
      .todos.map(todo => {
        if (todo._id !== updatedTodo._id) return todo
        return updatedTodo
      })
    const newWeekDays = state.days.map(day => {
      if (day.date !== date) return day
      return { ...day, todos: newTodoList}
    })
    await dispatch('updateWeeklySpread', newWeekDays)
  },
  async editDayTodoStatus ({ state, dispatch }, { updatedTodo, date }) {
    const newTodoList = state.days
      .find(day => day.date === date)
      .todos.map(todo => {
        if (todo._id !== updatedTodo._id) return todo
        return { ...updatedTodo, done: !updatedTodo.done }
      })
    const newWeekDays = state.days.map(day => {
      if (day.date !== date) return day
      return { ...day, todos: newTodoList}
    })
    await dispatch('updateWeeklySpread', newWeekDays)
  },
  async deleteDayTodo ({ state, dispatch }, { deletedTodoId, date }) {
    const newTodoList = state.days
      .find(day => day.date === date)
      .todos.filter(todo => todo._id !== deletedTodoId)
    const newWeekDays = state.days.map(day => {
      if (day.date !== date) return day
      return { ...day, todos: newTodoList}
    })
    await dispatch('updateWeeklySpread', newWeekDays)
  },
  async createNewWeekly ({ state, commit }, newWeekRange) {
    const newSpreadDays = [{ date: moment(newWeekRange.start, 'MM/DD/YYYY'), todos: [] }]
    var treatedDate = moment(newWeekRange.start, 'MM/DD/YYYY')
    while(treatedDate.add(1, 'days').diff(newWeekRange.end) < 1) {
      newSpreadDays.push({ date: treatedDate.clone().toDate(), todos: [] })
    }
    const newWeeklySpread = {
      weeklyStartDate: moment(newWeekRange.start, 'MM/DD/YYYY').format(),
      weeklyEndDate: moment(newWeekRange.end, 'MM/DD/YYYY').format(),
      previousWeeklyId: state.week_id,
      days: newSpreadDays,
    }
    const newWeeklySpreadResponse = await feathersApi.post('weekly-spread', newWeeklySpread)
    if (state.week_id) {
      await feathersApi.put(`weekly-spread/${state.week_id}`, { 
        _id: state.week_id,
        days: state.days,
        nextWeeklyId: newWeeklySpreadResponse._id,
        previousWeeklyId: state.previousWeeklyId,
        weeklyStartDate: state.weeklyStartDate,
        weeklyEndDate: state.weeklyEndDate
      })
    }
    commit('CREATED_WEEKLY_SPREAD', newWeeklySpreadResponse)
  },
  async navigateToPreviousWeek({ state, commit }) {
    if (!state.previousWeeklyId) return
    const weeklyFetchResponse = await feathersApi.get(`weekly-spread/${state.previousWeeklyId}`)
    commit('FETCH_WEEKLY_SPREAD', weeklyFetchResponse)
  },
  async navigateToNextWeek({ state, commit }) {
    if (!state.nextWeeklyId) return
    const weeklyFetchResponse = await feathersApi.get(`weekly-spread/${state.nextWeeklyId}`)
    commit('FETCH_WEEKLY_SPREAD', weeklyFetchResponse)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
