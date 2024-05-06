import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/diet_comments/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/diet_comments/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/diet_comments/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/diet_comments/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/diet_comments/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/diet_comments/${id}/`)
  }
}
