import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/exercise_comments/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/exercise_comments/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/exercise_comments/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/exercise_comments/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/exercise_comments/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/exercise_comments/${id}/`)
  }
}
