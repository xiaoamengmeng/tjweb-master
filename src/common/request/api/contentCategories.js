import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/post_categories/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/post_categories/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/post_categories/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/post_categories/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/post_categories/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/post_categories/${id}/`)
  }
}
