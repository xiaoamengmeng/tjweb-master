import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/nutrition/dishes/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/nutrition_dishes/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/nutrition_dishes/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/nutrition_dishes/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/nutrition_dishes/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/nutrition_dishes/${id}/`)
  },
}
