const SET_CONV_LIST = 'SET_CONV_LIST'
const SET_GROUP_LIST = 'SET_GROUP_LIST'
const SET_FRIEND_LIST = 'SET_FRIEND_LIST'
const SET_RECEIVE_LIST = 'SET_RECEIVE_LIST'
const SET_TIM_READY = 'SET_TIM_READY'
const SET_UNREAD_COUNT = 'SET_UNREAD_COUNT'
const getDefaultState = () => {
  return {
    // 用来判断系统是否在执行任务
    convList: [],
    groupList: [],
    friendList: [],
    receiveList: [],
    timReady: false,
    unreadCount: 0,
  }
}

const state = getDefaultState()

const mutations = {
  SET_CONV_LIST(state, value) {
    state.convList = value
  },
  SET_GROUP_LIST(state, value) {
    state.groupList = value
  },
  SET_FRIEND_LIST(state, value) {
    state.friendList = value
  },
  SET_RECEIVE_LIST(state, value) {
    state.receiveList = value
  },
  SET_TIM_READY(state, value) {
    state.timReady = value
  },
  SET_UNREAD_COUNT(state, value) {
    state.unreadCount = value
  }
}

const actions = {
  setConvList({ commit }, value) {
    commit(SET_CONV_LIST, value)
  },
  setGroupList({ commit }, value) {
    commit(SET_GROUP_LIST, value)
  },
  setFriendList({ commit }, value) {
    commit(SET_FRIEND_LIST, value)
  },
  setReceiveList({ commit }, value) {
    commit(SET_RECEIVE_LIST, value)
  },
  setTimReady({ commit }, value) {
    commit(SET_TIM_READY, value)
  },
  setUnreadCount({ commit }, value) {
    commit(SET_UNREAD_COUNT, value)
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
