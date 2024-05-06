import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/foods/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/foods/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/foods/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/foods/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/foods/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/foods/${id}/`)
  }
}
