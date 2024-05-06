import {
  STATUS_PROJECT,
  STATUS_AUTHORIZE,
  STATUS_USER,
  PROJECT_TYPE,
  PRODUCT,
  STATUS_SERVICE_RIGHTS,
  ASGMT_STATUS,
  MEDICAL_RECORD_TYPE,
  MEAL_TYPE,
  QUESTION_TYPE
} from './dict'

const filterGenerate = (dict) => {
  return value => {
    const target = dict.filter(item => {
      return item.code === value
    })
    return target.length ? target[0].label : value
  }
}

const status = {
  projectStatus: filterGenerate(STATUS_PROJECT),
  authorizeStatus: filterGenerate(STATUS_AUTHORIZE),
  userStatus: filterGenerate(STATUS_USER),
  projectType: filterGenerate(PROJECT_TYPE),
  product: filterGenerate(PRODUCT),
  serviceRights: filterGenerate(STATUS_SERVICE_RIGHTS),
  asgmtStatus: filterGenerate(ASGMT_STATUS),
  medicalType: filterGenerate(MEDICAL_RECORD_TYPE),
  mealType: filterGenerate(MEAL_TYPE),
  questionType: filterGenerate(QUESTION_TYPE),
}

const install = Vue => {
  Object.keys(status).forEach(key => {
    Vue.filter(key, status[key])
  })

  Vue.filter('dateFormat', (value) => {
    if (new Date(value).toString() === 'NaN') {
      return ''
    }
    return new Date(value).format('yyyy-MM-dd hh:mm:ss')
  })
  Vue.filter('dateFormatWithoutTime', (value) => {
    return new Date(value).format('yyyy-MM-dd')
  })
  Vue.filter('dateFormatCN', (value) => {
    return new Date(value).format('yyyy年MM月dd日')
  })
  Vue.filter('dateFormatMDCN', (value) => {
    return new Date(value).format('M月d日')
  })
  Vue.filter('dateFormatHhmm', (value) => {
    return new Date(value).format('hh:mm')
  })
  Vue.filter('dateFormatHhmmss', (value) => {
    return new Date(value).format('hh:mm:ss')
  })
  Vue.filter('publishedAt', (value) => {
    return new Date(value).format('yyyy-MM-dd hh:mm')
  })
  Vue.filter('validDateFormat', (value) => {
    return value.replaceAll(/-/g, '/')
  })
  Vue.filter('phoneMask', (value) => {
    const split = value.split('')
    split.splice(3, 4, ' **** ')
    return split.join('')
  })
  Vue.filter('calcAge', (value = '') => {
    if (value === '') {
      return ''
    }
    const birthday = new Date(value.replace(/-/g, "\/"));
    const d = new Date();
    const age = d.getFullYear() - birthday.getFullYear() - ((d.getMonth() < birthday.getMonth() || d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate()) ? 1 : 0);
    return age
  })
  Vue.filter('sexText', (value) => {
    if (value === 'M') {
      return '男'
    } else if (value === 'F') {
      return '女'
    } else {
      return '未知'
    }
  })
  Vue.filter('showSlowly', (arr) => {
    if (!arr || arr.length === 0) {
      return ''
    }
    let text = ''
    let last = arr.length - 1
    arr.forEach((item, index) => {
      if (index === last) {
        text += item
      } else {
        text += item + '、'
      }
    })
    return text
  })
  Vue.filter('showComments', (comments) => {
    let text = ''
    comments.forEach(item => {
      text += `【${item.creator.role_name}】：${item.content} 。`
    })
    return text
  })
  Vue.filter('round', (value) => {
    if (value === null || value === false || value === undefined || Math.round(value).toString() === 'NaN') {
      return '--'
    }
    let f = parseFloat(value)
    if (isNaN(f)) {
      return '--'
    }
    f = Math.round(value * 10) / 10;
    return f
  })
  Vue.filter('roundFixed2', (value) => {
    if (value === null || value === false || value === undefined || Number(value).toString() === 'NaN') {
      return '--'
    }
    return Number(value).toFixed(2)
  })
}
export default {
  install
}
