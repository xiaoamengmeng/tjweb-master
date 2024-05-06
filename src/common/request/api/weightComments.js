import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/weight_comments/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/weight_comments/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/weight_comments/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/weight_comments/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/weight_comments/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/weight_comments/${id}/`)
  }
}
