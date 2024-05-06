import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/faq_category/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/faq_category/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/faq_category/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/faq_category/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/faq_category/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/faq_category/${id}/`)
  }
}
