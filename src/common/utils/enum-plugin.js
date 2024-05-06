const ROLE = {
  RD: 'rd', // 责任营养师
  LD: 'ld', // 主责营养师
  DR: 'dr', // 医生
  DA: 'da', // 医生助理
  USER: 'user', // 用户
  ADMIN: 'admin', // 管理员
}

// 登录方式
const LOGIN_TYPE = {
  PASSWORD: 0, // 密码登录
  VERIFY_CODE: 1, // 手机验证码登录
}

const PROJECT_STATUS = {
  CLOSED: 2, // 已关闭
  PROCESSING: 1, // 进行中
}

const SERVICE_RIGHTS_STATUS = {
  ENABLE: 1, // 启用
  DISABLE: 2, // 禁用
}

const TEAM_STATUS = {
  ENABLE: 1, // 启用
  DISABLE: 2, // 禁用
}

const SOLUTION_STATUS = {
  ENABLE: 1, // 启用
  DISABLE: 2, // 禁用
}

const ASGMT_STATUS = {
  YET: 0, // 待分配
  ALREADY: 1 // 已分配
}

const QUESTION_TYPE = {
  SINGLE: 0, // 单选题
  MULTIPLE: 1, // 多选题
  FILL: 2, // 填空题
}

const CUSTOM_MESSAGE_TYPE = {
  IMAGE: 1, // 图片
  SCALE: 2, // 量表
  SOLUTION: 3, // 方案
  KCARD: 4, // 知识卡
  ARTICLE: 5, // 文章｜视频
  HEALTH_ASSESSMENT: 6, // 健康评估
}
const CARD_LAYOUT = {
  TOP_CENTER: 'top-center', // 顶部居中
  TOP_LEFT: 'top-left', // 顶部左上
  CENTER: 'center', // 全局居中
  TOP_RIGHT: 'top-right', // 顶部右上
}
const PRODUCT = {
  WEI_ZHUAN_LIU: 'wei_zhuan_liu', // 胃转流
  SHUI_QIU: 'shui_qiu', // 水球
  WEI_PANG_LU: 'wei_pang_lu' // 胃旁路手术
}

const SEX = {
  M: 'M', // '男'
  F: 'F', // '女'
  U: 'U', // '未知'
}

// 体重打卡的时间段
const WEIGHT_RECORD_TIME_PERIOD = {
  EMPTY_STOMACH: 'empty_stomach', // 空腹
  BEFORE_BREAKFAST: 'before_breakfast', // 早餐前
  AFTER_BREAKFAST: 'after_breakfast', // 早餐后
  BEFORE_LUNCH: 'before_lunch', // 午餐前
  AFTER_LUNCH: 'after_lunch', // 午餐后
  BEFORE_DINNER: 'before_dinner', // 晚餐前
  AFTER_DINNER: 'after_dinner', // 晚餐后
  BEFORE_SLEEP: 'before_sleep', // 睡前
  UNKNOWN: 'unknown', // 未知
}


const install = Vue => {
  Vue.prototype.$enum = {
    LOGIN_TYPE,
    PROJECT_STATUS,
    SERVICE_RIGHTS_STATUS,
    TEAM_STATUS,
    SOLUTION_STATUS,
    ASGMT_STATUS,
    ROLE,
    QUESTION_TYPE,
    CUSTOM_MESSAGE_TYPE,
    CARD_LAYOUT,
    PRODUCT,
    SEX,
    WEIGHT_RECORD_TIME_PERIOD,
  }
}
export default {
  install
}
