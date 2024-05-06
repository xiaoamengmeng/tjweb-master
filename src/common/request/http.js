import axios from 'axios'
import router from '../../admin/router'
import store from '../store'
import Vue from 'vue'

const vm = new Vue()

const errorHandle = (response) => {
  // 状态码判断
  return new Promise(async (resolve, reject) => {
    switch (response.status) {
      case 400: {
        if (response.data.code === 'multiple') {
          vm.$message.error(response.data.list.map(item => item.detail).join(''))
        } else {
          if (response.data.detail != '发布内容存在违规词汇，请编辑后重新发送。') {
            vm.$message.error(response.data.detail)
          }
        }
        reject(response.data)
      }
        break
      case 401: {
        router.replace({ path: '/login' })
        store.dispatch('user/logout')
        if (response.data.detail) {
          vm.$message.error(response.data.detail)
        } else {
          vm.$message.error(`身份认证失败，请重新登录`)
        }
        break
      }
      case 403: {
        if (response.data.code === 'multiple') {
          vm.$message.error(response.data.list.map(item => item.detail).join(''))
        } else {
          vm.$message.error(response.data.detail)
        }
        // vm.$message.error(`您没有执行该操作的权限`)
        // reject(response.data)
        break
      }
      case 404: {
        vm.$message.error(`url: ${response.config.url} 404 (Not Found) `)
        break
      }
      case 500: {
        if (response.data.code === 'multiple') {
          vm.$message.error(response.data.list.map(item => item.detail).join(''))
        } else {
          vm.$message.error(response.data.detail)
        }
        // reject(response.data)
        break
      }
      case 502: {
        vm.$message.error('服务器维护中，请稍后再试')
        break
      }
      default: {
        reject(response.data)
      }
        break
    }
  })
}

// 创建axios实例
const timeout = 1000 * 60 * 3
const instance = axios.create({ timeout: timeout })

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json'//'application/x-www-form-urlencoded'

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    const token = store.getters.token
    token && (config.headers.Authorization = `Token ${token}`)
    return config
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  res => {
    if (res.status >= 200 && res.status <= 206) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  },
  // 请求失败
  error => {
    const { response } = error
    if (error.code === 'ERR_NETWORK') {
      return vm.$message.error('网络错误，请检查您的网络连接')
    }
    if (response) {
      // 请求已发出，但是不在2xx的范围
      return errorHandle(response).then(res => {
        // console.log(res)
        return Promise.resolve(res)
      }).catch(err => {
        // console.log(err)
        return Promise.reject(err)
      })
      //  Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        vm.$message.error('网络错误，请检查您的网络连接')
      } else {
        return Promise.reject(error)
      }
    }
  })
export default instance
