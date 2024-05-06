import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/dishes_categories/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/dishes_categories/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/dishes_categories/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/dishes_categories/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/dishes_categories/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/dishes_categories/${id}/`)
  },
}