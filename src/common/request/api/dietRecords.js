import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/diet_records/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/diet_records/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/diet_records/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/diet_records/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/diet_records/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/diet_records/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/diet_records/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/diet_records/${id}/unlike/`)
  },
  getDietRecords(payload) {
    return axios.get(`${base}/diet_records/statistics/`, {
      params: payload
    })
  }
}
