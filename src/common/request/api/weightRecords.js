import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/weight_records/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/weight_records/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/weight_records/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/weight_records/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/weight_records/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/weight_records/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/weight_records/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/weight_records/${id}/unlike/`)
  }
}
