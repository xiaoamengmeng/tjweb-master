import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/meal_plans/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/meal_plans/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/meal_plans/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/meal_plans/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/meal_plans/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/meal_plans/${id}/`)
  }
}
