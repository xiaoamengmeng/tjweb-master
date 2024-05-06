import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/food_categories/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/food_categories/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/food_categories/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/food_categories/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/food_categories/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/food_categories/${id}/`)
  }
}
