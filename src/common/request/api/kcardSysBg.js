import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/kcard_system_bg/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/kcard_system_bg/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/kcard_system_bg/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/kcard_system_bg/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/kcard_system_bg/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/kcard_system_bg/${id}/`)
  }
}
