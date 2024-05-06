import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/ai_reply/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/ai_reply/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/ai_reply/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/ai_reply/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/ai_reply/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/ai_reply/${id}/`)
  },
  createFaq(payload) {
    return axios.post(`${base}/ai_reply/faq/`, payload)
  },
}
