import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/intervs/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/intervs/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/intervs/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/intervs/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/intervs/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/intervs/${id}/`)
  }
}
