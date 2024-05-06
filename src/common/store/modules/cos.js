const SET_UPLOAD_KEY = 'SET_UPLOAD_KEY'

const getDefaultState = () => {
  return {
    uploadKey: {}
  }
}

const state = getDefaultState()

const mutations = {
  SET_UPLOAD_KEY(state, value) {
    state.uploadKey = value
  },
}

const actions = {
  setUploadKey({ commit }, value) {
    commit(SET_UPLOAD_KEY, value)
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
