import TIM from 'tim-js-sdk/tim-js-friendship'

export default (item, that) => {
  // 撤回消息
  const msgRevoked = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'event',
    sendTime: item.time * 1000,
    content: item.from === that.user.id ? '你撤回了一条消息' : `${item.nick}撤回了一条消息`,
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
  const msgNotification = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'notification',
    sendTime: item.time * 1000,
    content: item.payload?.text ?? '',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: '系统通知',
      avatar: ''
    }
  }
  // 文本消息
  const msgText = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'text',
    sendTime: item.time * 1000,
    content: item.payload?.text ?? '',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
  // 图片消息
  const msgImage = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'image',
    sendTime: item.time * 1000,
    content: item.payload?.text ?? '',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
  // 文件消息
  const msgFile = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'file',
    sendTime: item.time * 1000,
    content: item.payload?.fileUrl ?? '',
    fileName: item.payload?.fileName ?? '',
    fileSize: item.payload?.fileSize ?? '',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
  // 语音消息
  const msgAudio = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'voice',
    sendTime: item.time * 1000,
    toContactId: item.to,
    content: '[语音]',
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
  // 视频消息
  const msgVideo = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'file',
    sendTime: item.time * 1000,
    toContactId: item.to,
    content: item.payload.videoUrl,
    fileName: item.payload.videoUUID + '.' + item.payload.videoFormat,
    fileSize: item.payload.videoSize,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }

  const msgCustomImage = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'custom',
    sendTime: item.time * 1000,
    content: '图片',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
  const msgCustomScale = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'custom',
    sendTime: item.time * 1000,
    content: '量表',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
  const msgCustomSolution = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'custom',
    sendTime: item.time * 1000,
    content: '方案',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }

  const msgCustomKcard = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'custom',
    sendTime: item.time * 1000,
    content: '知识卡',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }

  const msgCustomArticle = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'custom',
    sendTime: item.time * 1000,
    content: '科普知识',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }

  const msgCustomHealth = {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'custom',
    sendTime: item.time * 1000,
    content: '健康评估',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }

  if(item.cloudCustomData==='notification'){
    return msgNotification
  }else if (item.conversationType === TIM.TYPES.CONV_C2C) {
    /************************ 端对端会话 ************************/

    // 撤回消息
    if (item.isRevoked) return msgRevoked

    switch (item.type) {
      case TIM.TYPES.MSG_TEXT:
        return msgText
      case TIM.TYPES.MSG_IMAGE:
        return msgImage
      case TIM.TYPES.MSG_AUDIO:
        return msgAudio
      case TIM.TYPES.MSG_VIDEO:
        return msgVideo
      case TIM.TYPES.MSG_FILE:
        return msgFile
      case TIM.TYPES.MSG_CUSTOM:
        const payload = JSON.parse(item.payload.data)
        switch (payload.category) {
          case that.$enum.CUSTOM_MESSAGE_TYPE.IMAGE:
            return msgCustomImage
          case that.$enum.CUSTOM_MESSAGE_TYPE.SCALE:
            return msgCustomScale
          case that.$enum.CUSTOM_MESSAGE_TYPE.SOLUTION:
            return msgCustomSolution
          case that.$enum.CUSTOM_MESSAGE_TYPE.KCARD:
            return msgCustomKcard
          case that.$enum.CUSTOM_MESSAGE_TYPE.ARTICLE:
            return msgCustomArticle
          case that.$enum.CUSTOM_MESSAGE_TYPE.HEALTH_ASSESSMENT:
            return msgCustomHealth
          default:
            return null
        }
      case TIM.TYPES.MSG_MERGER:
      case TIM.TYPES.MSG_LOCATION:
      case TIM.TYPES.MSG_FACE:
      case TIM.TYPES.MSG_GRP_TIP:
      case TIM.TYPES.MSG_GRP_SYS_NOTICE:
        return null
      default:
        return null
    }
    //群提示消息
  } else if (item.conversationType === TIM.TYPES.CONV_GROUP) {
    /************************ 群组会话 ************************/

    // 撤回消息
    if (item.isRevoked) return msgRevoked

    // 创建群组的消息
    if (item.payload.data && item.payload.data === 'group_create') {
      return {
        tim: item,
        id: item.ID,
        status: item.status,
        type: 'event',
        sendTime: item.time * 1000,
        content: `${item.nick}创建了群组`,
        toContactId: item.to,
        fromUser: {
          id: item.from,
          displayName: item.nick || '未命名',
          avatar: item.avatar
        }
      }
    }

    //群提示消息
    if (item.type === TIM.TYPES.MSG_GRP_TIP) {
      switch (item.payload.operationType) {
        case TIM.TYPES.GRP_TIP_MBR_JOIN:
          return {
            tim: item,
            id: item.ID,
            status: item.status,
            type: 'event',
            sendTime: item.time * 1000,
            content: `${item.nick}加入群组`,
            toContactId: item.to,
            fromUser: {
              id: item.from,
              displayName: item.nick || '群系统提示',
              avatar: item.avatar
            }
          }
        case  TIM.TYPES.GRP_TIP_MBR_QUIT:
          return {
            tim: item,
            id: item.ID,
            status: item.status,
            type: 'event',
            sendTime: item.time * 1000,
            content: `${item.nick}退出群组`,
            toContactId: item.to,
            fromUser: {
              id: item.from,
              displayName: item.nick || '群系统提示',
              avatar: item.avatar
            }
          }
        case  TIM.TYPES.GRP_TIP_MBR_KICKED_OUT:
        case  TIM.TYPES.GRP_TIP_MBR_SET_ADMIN:
        case  TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN:
          return null
        case  TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED:
          return {
            tim: item,
            id: item.ID,
            status: item.status,
            type: 'event',
            sendTime: item.time * 1000,
            content: '群组资料变更',
            toContactId: item.to,
            fromUser: {
              id: item.from,
              displayName: item.nick || '群系统提示',
              avatar: item.avatar
            }
          }
        case  TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED:
          // let members = ``
          // item.payload.memberList.forEach((user, index) => {
          //   if (index === item.payload.memberList.length - 1) {
          //     members += user.nick
          //   } else {
          //     members += user.nick + '、'
          //   }
          // })
          return {
            tim: item,
            id: item.ID,
            status: item.status,
            type: 'event',
            sendTime: item.time * 1000,
            content: '群组成员变更',
            // content: '邀请' + members + '加入群聊',
            toContactId: item.to,
            fromUser: {
              id: item.from,
              displayName: item.nick || '群系统提示',
              avatar: item.avatar
            }
          }
        case  TIM.TYPES.GRP_TIP_BAN_AVCHATROOM_MEMBER:
          return null
        default :
          return null
      }
    }

    switch (item.type) {
      case TIM.TYPES.MSG_TEXT:
        return msgText
      case TIM.TYPES.MSG_IMAGE:
        return msgImage
      case TIM.TYPES.MSG_AUDIO:
        return msgAudio
      case TIM.TYPES.MSG_VIDEO:
        return msgVideo
      case TIM.TYPES.MSG_FILE:
        return msgFile
      case TIM.TYPES.MSG_CUSTOM:
        const payload = JSON.parse(item.payload.data)
        switch (payload.category) {
          case that.$enum.CUSTOM_MESSAGE_TYPE.IMAGE:
            return msgCustomImage
          case that.$enum.CUSTOM_MESSAGE_TYPE.SCALE:
            return msgCustomScale
          case that.$enum.CUSTOM_MESSAGE_TYPE.SOLUTION:
            return msgCustomSolution
          case that.$enum.CUSTOM_MESSAGE_TYPE.KCARD:
            return msgCustomKcard
          case that.$enum.CUSTOM_MESSAGE_TYPE.ARTICLE:
            return msgCustomArticle
          case that.$enum.CUSTOM_MESSAGE_TYPE.HEALTH_ASSESSMENT:
              return msgCustomHealth
          default:
            return null
        }
      case TIM.TYPES.MSG_MERGER:
      case TIM.TYPES.MSG_LOCATION:
      case TIM.TYPES.MSG_FACE:
      case TIM.TYPES.MSG_GRP_TIP:
      case TIM.TYPES.MSG_GRP_SYS_NOTICE:
        return null
      default:
        return null
    }
  } else if (item.conversationType === TIM.TYPES.CONV_SYSTEM) {
    /************************ 系统会话 ************************/
    // 暂时先忽略系统消息
    return null
  }


  if (item.type === TIM.TYPES.MSG_CUSTOM) {
    const payload = JSON.parse(item.payload.data)
    switch (payload.category) {
      case that.$enum.CUSTOM_MESSAGE_TYPE.IMAGE:
        return {
          tim: item,
          id: item.ID,
          status: item.status,
          type: 'custom',
          sendTime: item.time * 1000,
          content: '图片',
          toContactId: item.to,
          fromUser: {
            id: item.from,
            displayName: item.nick || '未命名',
            avatar: item.avatar
          }
        }
      case that.$enum.CUSTOM_MESSAGE_TYPE.SCALE:
        return {
          tim: item,
          id: item.ID,
          status: item.status,
          type: 'custom',
          sendTime: item.time * 1000,
          content: '量表',
          toContactId: item.to,
          fromUser: {
            id: item.from,
            displayName: item.nick || '未命名',
            avatar: item.avatar
          }
        }
      case that.$enum.CUSTOM_MESSAGE_TYPE.SOLUTION:
        return {
          tim: item,
          id: item.ID,
          status: item.status,
          type: 'custom',
          sendTime: item.time * 1000,
          content: '方案',
          toContactId: item.to,
          fromUser: {
            id: item.from,
            displayName: item.nick || '未命名',
            avatar: item.avatar
          }
        }
      case that.$enum.CUSTOM_MESSAGE_TYPE.KCARD:
        return {
          tim: item,
          id: item.ID,
          status: item.status,
          type: 'custom',
          sendTime: item.time * 1000,
          content: '知识卡',
          toContactId: item.to,
          fromUser: {
            id: item.from,
            displayName: item.nick || '未命名',
            avatar: item.avatar
          }
        }
      case that.$enum.CUSTOM_MESSAGE_TYPE.ARTICLE:
        return {
          tim: item,
          id: item.ID,
          status: item.status,
          type: 'custom',
          sendTime: item.time * 1000,
          content: '科普知识',
          toContactId: item.to,
          fromUser: {
            id: item.from,
            displayName: item.nick || '未命名',
            avatar: item.avatar
          }
        }
      case that.$enum.CUSTOM_MESSAGE_TYPE.HEALTH_ASSESSMENT:
        return {
          tim: item,
          id: item.ID,
          status: item.status,
          type: 'custom',
          sendTime: item.time * 1000,
          content: '健康评估',
          toContactId: item.to,
          fromUser: {
            id: item.from,
            displayName: item.nick || '未命名',
            avatar: item.avatar
          }
        }
    }
  }
  return {
    tim: item,
    id: item.ID,
    status: item.status,
    type: 'text',
    sendTime: item.time * 1000,
    content: '[未知的消息类型]',
    toContactId: item.to,
    fromUser: {
      id: item.from,
      displayName: item.nick || '未命名',
      avatar: item.avatar
    }
  }
}
