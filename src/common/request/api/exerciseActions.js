import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/exercise_actions/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/exercise_actions/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/exercise_actions/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/exercise_actions/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/exercise_actions/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/exercise_actions/${id}/`)
  }
}
