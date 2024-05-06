import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/dishes/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/dishes/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/dishes/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/dishes/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/dishes/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/dishes/${id}/`)
  },
}
