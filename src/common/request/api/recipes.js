import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/recipes/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/recipes/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/recipes/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/recipes/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/recipes/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/recipes/${id}/`)
  }
}
