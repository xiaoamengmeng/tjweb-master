import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/permission_management/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/permission_management/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/permission_management/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/permission_management/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/permission_management/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/permission_management/${id}/`)
  },
}
