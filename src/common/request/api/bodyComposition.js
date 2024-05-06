import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/patient_body_composition/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/patient_body_composition/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/patient_body_composition/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/patient_body_composition/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/patient_body_composition/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/patient_body_composition/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/patient_body_composition/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/patient_body_composition/${id}/unlike/`)
  },
  statistics(payload) {
    return axios.get(`${base}/patient_body_composition/statistics/`, {
        params: payload,
    })
  }
}
