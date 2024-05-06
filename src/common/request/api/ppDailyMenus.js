import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/pp_daily_menus/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/pp_daily_menus/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/pp_daily_menus/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/pp_daily_menus/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/pp_daily_menus/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/pp_daily_menus/${id}/`)
  }
}
