import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/pp_recipes/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/pp_recipes/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/pp_recipes/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/pp_recipes/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/pp_recipes/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/pp_recipes/${id}/`)
  }
}
