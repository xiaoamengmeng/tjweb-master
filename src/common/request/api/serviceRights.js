import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/service_rights/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/service_rights/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/service_rights/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/service_rights/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/service_rights/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/service_rights/${id}/`)
  }
}
