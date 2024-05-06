import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/blood_pressure_records/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/blood_pressure_records/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/blood_pressure_records/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/blood_pressure_records/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/blood_pressure_records/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/blood_pressure_records/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/blood_pressure_records/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/blood_pressure_records/${id}/unlike/`)
  },
  statistics(payload) {
    return axios.get(`${base}/blood_pressure_records/statistics/`, {
        params: payload,
    })
  }
}
