import TIM from 'tim-js-sdk/tim-js-friendship';
import TIMUploadPlugin from 'tim-upload-plugin';
import Vue from 'vue'
import store from '@/common/store'
const env = process.env.NODE_ENV

const vm = new Vue({ store })
const dispatch = vm.$store.dispatch

class Tim {
  constructor() {
    if (!Tim.instance) {
      let options = {
        SDKAppID: '',
      }
      if(env === 'development') {
        options.SDKAppID = window.config.DEV_SDK_APP_ID
      } else {
        options.SDKAppID = window.config.SDK_APP_ID
      }
      // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
      const tim = TIM.create(options)

      this.tim = tim

      /**
       * 日志级别
       * 0 普通级别，日志量较多，接入时建议使用
       * 1 release级别，SDK 输出关键信息，生产环境时建议使用
       * 2 告警级别，SDK 只输出告警和错误级别的日志
       * 3 错误级别，SDK 只输出错误级别的日志
       * 4 无日志级别，SDK 将不打印任何日志
       */
      // this.tim.setLogLevel(1)
      this.tim.setLogLevel(4)

      // 注册腾讯云即时通信 IM 上传插件
      this.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })

      tim.on(TIM.EVENT.ERROR, this.onError)
      tim.on(TIM.EVENT.SDK_READY, this.onReady)
      tim.on(TIM.EVENT.SDK_NOT_READY, this.onNotReady)
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived)
      tim.on(TIM.EVENT.MESSAGE_READ_RECEIPT_RECEIVED, this.onMessageReadReceiptReceived)
      tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated)
      tim.on(TIM.EVENT.GROUP_LIST_UPDATED, this.onGroupListUpdated)
      tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, this.onFriendListUpdated)
      tim.on(TIM.EVENT.KICKED_OUT, this.onKickedOut);
      Tim.instance = this
    }
    return Tim.instance
  }

  // 用户登录
  login(user) {
    return this.tim.login(user)
  }

  logout() {
    return this.tim.logout()
  }

  // 销毁 SDK 实例，包括：登出，断开长连接，并释放所有资源
  destroy() {
    return this.tim.destroy()
  }

  createGroup(option) {
    /**
     * joinOption：申请加群处理方式。
     * TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS （自由加入）
     * TIM.TYPES.JOIN_OPTIONS_NEED_PERMISSION （需要验证）
     * TIM.TYPES.JOIN_OPTIONS_DISABLE_APPLY （禁止加群）
     */
    return this.tim.createGroup({
      name: option.name,
      type: TIM.TYPES.GRP_PUBLIC,
      memberList: option.memberList,
      joinOption: TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS,
      userID: option.userID
    })
  }

  getGroupList() {
    return this.tim.getGroupList()
  }

  dismissGroup(id) {
    return this.tim.dismissGroup(id)
  }

  quitGroup(id) {
    return this.tim.quitGroup(id)
  }

  getFriendList() {
    return this.tim.getFriendList()
  }

  getMyProfile() {
    return this.tim.getMyProfile()
  }

  on(...args) {
    this.tim.on(...args)
  }

  onReady() {
    dispatch('im/setTimReady', true)
  }

  onNotReady() {
    dispatch('im/setTimReady', false)
  }

  onError(event) {
  }

  createTextMessage(options) {
    return this.tim.createTextMessage(options)
  }

  createImageMessage(options) {
    return this.tim.createImageMessage(options)
  }

  createFileMessage(options) {
    return this.tim.createFileMessage(options)
  }

  createFaceMessage(options) {
    return this.tim.createFaceMessage(options)
  }

  createCustomMessage(options) {
    return this.tim.createCustomMessage(options)
  }

  sendMessage(message) {
    return this.tim.sendMessage(message)
  }

  getMessageList(options) {
    return this.tim.getMessageList(options)
  }

  // 撤回消息
  revokeMessage(message) {
    return this.tim.revokeMessage(message)
  }

  deleteConversation(conversationID) {
    return this.tim.deleteConversation(conversationID)
  }

  setMessageRead(options) {
    return this.tim.setMessageRead(options)
  }

  getGroupMemberList(options) {
    return this.tim.getGroupMemberList(options)
  }

  getGroupProfile(options) {
    return this.tim.getGroupProfile(options)
  }

  // 会话列表更新，event.data 是包含 Conversation 对象的数组
  onConversationListUpdated(event) {
    const data = event.data
    dispatch('im/setConvList', data)
    // const unreadCount = data.reduce((prev, curr) => prev + curr.unreadCount, 0)
    // const unreadCount = data.reduce((prev, curr) => prev + curr.unreadCount, 0)
    let unreadCount = 0
    data.forEach(item => {
      if (item.type !== TIM.TYPES.CONV_SYSTEM) {
        unreadCount += item.unreadCount
      }
    })

    dispatch('im/setUnreadCount', unreadCount)
  }

  // SDK 群组列表更新时触发，可通过遍历 event.data 获取群组列表数据并渲染到页面
  onGroupListUpdated(event) {
    dispatch('im/setGroupList', event.data)
  }

  onFriendListUpdated(event) {
    dispatch('im/setFriendList', event.data)
  }

  // SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息，接入侧可通过遍历 event.data 获取消息列表数据并渲染到页面
  onMessageReceived(event) {
    // vm.$notify({
    //   title: '消息',
    //   dangerouslyUseHTMLString: true,
    //   offset: 66,
    //   message: '<strong>您收到了一条消息</strong>'
    // })
    // event.data - 存储 Message 对象的数组 - [Message]
    dispatch('im/setReceiveList', event.data)
  }

  onKickedOut() {
    console.log('tim：您的IM已经被踢下线')
    this.$message.warning('注意：您的IM已经被踢下线')
  }

  // 获取指定的会话列表
  getConversationList(convIds = []) {
    return this.tim.getConversationList(convIds)
  }

  // SDK 收到了群消息的已读回执（v2.18.0起支持）
  onMessageReadReceiptReceived(event) {
    // event.data - 存储消息已读回执信息的数组
    const readReceiptInfoList = event.data;
    readReceiptInfoList.forEach((item) => {
      const { groupID, messageID, readCount, unreadCount } = item;
      const message = this.tim.findMessage(messageID);
      if (message) {
        if (message.readReceiptInfo.unreadCount === 0) {
          // 全部已读
        } else {
          // message.readReceiptInfo.readCount - 消息最新的已读数
          // 如果想要查询哪些群成员已读了此消息，请使用 [getGroupMessageReadMemberList] 接口
        }
      }
    })
  }

}

export default Tim
