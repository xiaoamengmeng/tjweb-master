import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/operation_log/`, {
      params: payload,
    })
  },
  create(payload) {
    return axios.post(`${base}/operation_log/`, payload)
  },
}
