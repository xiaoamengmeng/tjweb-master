import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/tags/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/tags/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/tags/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/tags/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/tags/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/tags/${id}/`)
  }
}
