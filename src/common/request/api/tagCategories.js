import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/tag_categories/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/tag_categories/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/tag_categories/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/tag_categories/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/tag_categories/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/tag_categories/${id}/`)
  }
}
