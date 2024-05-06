import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/bracelet_exercise/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/bracelet_exercise/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/bracelet_exercise/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/bracelet_exercise/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/bracelet_exercise/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/bracelet_exercise/${id}/`)
  }
}
