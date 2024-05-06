import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/kcard_temps/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/kcard_temps/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/kcard_temps/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/kcard_temps/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/kcard_temps/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/kcard_temps/${id}/`)
  }
}
