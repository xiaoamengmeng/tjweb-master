import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/faq/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/faq/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/faq/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/faq/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/faq/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/faq/${id}/`)
  }
}
