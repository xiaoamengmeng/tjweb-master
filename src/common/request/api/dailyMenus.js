import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/daily_menus/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/daily_menus/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/daily_menus/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/daily_menus/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/daily_menus/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/daily_menus/${id}/`)
  }
}
