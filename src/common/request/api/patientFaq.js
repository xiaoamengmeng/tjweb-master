import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/patient_faq/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/patient_faq/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/patient_faq/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/patient_faq/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/patient_faq/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/patient_faq/${id}/`)
  }
}
