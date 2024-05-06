const SET_INFO = 'SET_INFO'

const state = {
  ppInfo: {
    project: {
      teams: {},
    },
    patient: {
      user_profile: {}
    },
    team: {
      leader: {}
    },
  },
}
const mutations = {
  SET_INFO(state, obj) {
    state.ppInfo = obj
  },
}
const actions = {
  setPpInfo(context, obj) {
    context.commit(SET_INFO, obj)
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
