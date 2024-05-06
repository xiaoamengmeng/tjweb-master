import { ROLE } from '@/common/utils/dict'
import LocalStore from '@/common/utils/LocalStore'

const userLocal = new LocalStore('global', true)
const menuLocal = new LocalStore('menu', true)

const SET_TOKEN = 'SET_TOKEN'
const SET_USER_INFO = 'SET_USER_INFO'
const LOGOUT = 'LOGOUT'
const SET_PROJECT_DISTRIBUTION_NUM = 'SET_PROJECT_DISTRIBUTION_NUM'
const SET_GROUNPING_NUM = 'SET_GROUNPING_NUM'

const state = {
  token: null,
  userInfo: null,
  // 
  projectDistributionNum: 0,
  groupingNum: 0,
}
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    userLocal.set('token', token)
  },
  SET_USER_INFO(state, user) {
    state.userInfo = user
    userLocal.set('userInfo', user)
  },
  LOGOUT(state) {
    state.token = null
    state.userInfo = {}
    LocalStore.clearSession()
  },
  SET_PROJECT_DISTRIBUTION_NUM(state, num) {
    state.projectDistributionNum = num
  },
  SET_GROUNPING_NUM(state, num) {
    state.groupingNum = num
  }
}
const actions = {
  setToken(context, token) {
    context.commit(SET_TOKEN, token)
  },
  setUserInfo(context, user) {
    context.commit(SET_USER_INFO, user)
  },
  logout(context) {
    context.commit(LOGOUT)
  },
  setProjectDistributionNum(context, num) {
    context.commit(SET_PROJECT_DISTRIBUTION_NUM, num)
  },
  setGroupingNum(context, num) {
    context.commit(SET_GROUNPING_NUM, num)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
