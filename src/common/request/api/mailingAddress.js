import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/mailing_address/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/mailing_address/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/mailing_address/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/mailing_address/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/mailing_address/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/mailing_address/${id}/`)
  }
}
