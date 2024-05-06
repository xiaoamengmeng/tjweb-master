const SET_ASIDE_INDEX = 'SET_ASIDE_INDEX'

const getDefaultState = () => {
  return {
    asideIndex: '/project'
  }
}

const state = getDefaultState()

const mutations = {
  SET_ASIDE_INDEX(state, value) {
    state.asideIndex = value
  },
}

const actions = {
  setAsideIndex({ commit }, value) {
    commit(SET_ASIDE_INDEX, value)
  },

  resetState({ state }) {
    Object.assign(state, getDefaultState())
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
