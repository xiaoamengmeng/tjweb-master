import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/tips/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/tips/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/tips/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/tips/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/tips/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/tips/${id}/`)
  }
}
