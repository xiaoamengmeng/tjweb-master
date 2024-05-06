import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/department/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/department/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/department/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/department/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/department/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/department/${id}/`)
  },
}
