import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/banner/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/banner/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/banner/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/banner/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/banner/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/banner/${id}/`)
  }
}
