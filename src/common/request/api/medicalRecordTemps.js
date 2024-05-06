import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/medical_record_temps/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/medical_record_temps/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/medical_record_temps/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/medical_record_temps/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/medical_record_temps/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/medical_record_temps/${id}/`)
  }
}
