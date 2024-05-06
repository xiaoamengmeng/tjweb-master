const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  convList: state => state.im.convList,
  groupList: state => state.im.groupList,
  friendList: state => state.im.friendList,
  receiveList: state => state.im.receiveList,
  unreadCount: state => state.im.unreadCount,
  timReady: state => state.im.timReady,
  asideIndex: state => state.common.asideIndex,
  ppInfo: state => state.ppInfo.ppInfo,
  projectDistributionNum: state => state.user.projectDistributionNum,
  groupingNum: state => state.user.groupingNum,
}
export default getters
