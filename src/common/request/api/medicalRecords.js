import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/medical_records/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/medical_records/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/medical_records/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/medical_records/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/medical_records/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/medical_records/${id}/`)
  }
}
