import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/nutrition/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/nutrition/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/nutrition/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/nutrition/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/nutrition/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/nutrition/${id}/`)
  },
  getNutritionDishes(payload) {
    return axios.get(`${base}/nutrition/dishes`, {
      params: payload,
    })
  }
}
