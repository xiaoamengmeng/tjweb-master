import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/organization/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/organization/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/organization/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/organization/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/organization/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/organization/${id}/`)
  },
}
