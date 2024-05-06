import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/bracelet_exercise_type/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/bracelet_exercise_type/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/bracelet_exercise_type/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/bracelet_exercise_type/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/bracelet_exercise_type/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/bracelet_exercise_type/${id}/`)
  }
}
