import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/kcard_categories/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/kcard_categories/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/kcard_categories/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/kcard_categories/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/kcard_categories/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/kcard_categories/${id}/`)
  }
}
