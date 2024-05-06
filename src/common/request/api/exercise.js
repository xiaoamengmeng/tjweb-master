import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/exercises/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/exercises/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/exercises/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/exercises/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/exercises/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/exercises/${id}/`)
  }
}
