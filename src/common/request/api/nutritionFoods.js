import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/nutrition_foods/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/nutrition_foods/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/nutrition_foods/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/nutrition_foods/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/nutrition_foods/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/nutrition_foods/${id}/`)
  },
}
