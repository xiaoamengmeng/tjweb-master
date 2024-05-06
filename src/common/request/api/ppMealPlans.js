import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/pp_meal_plans/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/pp_meal_plans/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/pp_meal_plans/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/pp_meal_plans/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/pp_meal_plans/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/pp_meal_plans/${id}/`)
  }
}
