import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/group_sending/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/group_sending/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/group_sending/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/group_sending/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/group_sending/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/group_sending/${id}/`)
  }
}
