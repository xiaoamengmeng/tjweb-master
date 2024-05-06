import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/projects/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/projects/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/projects/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/projects/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/projects/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/projects/${id}/`)
  }
}
