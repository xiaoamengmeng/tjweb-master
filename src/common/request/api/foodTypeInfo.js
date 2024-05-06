import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/food_info/dishes_foods_type/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/food_type_info/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/food_type_info/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/food_type_info/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/food_type_info/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/food_type_info/${id}/`)
  }
}
