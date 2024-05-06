import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/common/store'
import api from '@/common/request'
import enums from '@/common/utils/enum-plugin'
import filters from '@/common/utils/filters-plugin'
import dict from '@/common/utils/dict-plugin'
import valid from '@/common/utils/validate-plugin'
import LocalStore from '@/common/utils/LocalStore'
import '@/common/plugins'
import '@/common/utils/tools'
import '@/common/style/atom.min.css'
import '@/common/style/reset.less'
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from '@sentry/tracing'
import cos from '@/common/utils/cos'
import auth from '@/common/utils/auth'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import VueClipboard from 'vue-clipboard2'
import '@/common/utils/rem.js'

// 配置dayjs周一为开始
import weekday from 'dayjs/plugin/weekday'
import 'dayjs/locale/zh-cn'
dayjs.extend(weekday)
dayjs.locale('zh-cn')
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)
Vue.prototype.$Day = dayjs
Object.defineProperty(Vue.prototype, '$day', {
  get() {
    return dayjs()
  }
})

Vue.use(auth)
Vue.use(VueClipboard)
Vue.prototype.$config = window.config
Vue.prototype.$api = api

Vue.use(filters)
Vue.use(dict)
Vue.use(valid)
Vue.use(enums)
Vue.use(cos)

const userLocal = new LocalStore('global', true)

const token = userLocal.get('token')
if (token) {
  store.dispatch('user/setToken', token)
}
const userInfo = userLocal.get('userInfo')
if (userInfo) {
  store.dispatch('user/setUserInfo', userInfo)
}

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    Vue,
    dsn: Vue.prototype.$config.SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        // tracingOrigins: ['localhost', window.config.SERVERS_URL, /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}

const vm = new Vue({
  router,
  store,
  render: h => h(App)
})

Vue.prototype.$bus = vm
vm.$mount('#app')
