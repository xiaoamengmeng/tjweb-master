import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/teams/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/teams/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/teams/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/teams/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/teams/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/teams/${id}/`)
  }
}
