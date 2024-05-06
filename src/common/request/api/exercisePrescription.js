import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/exercise_prescription/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/exercise_prescription/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/exercise_prescription/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/exercise_prescription/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/exercise_prescription/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/exercise_prescription/${id}/`)
  }
}
