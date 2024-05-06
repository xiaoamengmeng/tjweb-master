import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/sleep_record/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/sleep_record/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/sleep_record/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/sleep_record/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/sleep_record/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/sleep_record/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/sleep_record/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/sleep_record/${id}/unlike/`)
  },
  statistics(payload) {
    return axios.get(`${base}/sleep_record/statistics/`, {
        params: payload,
    })
  }
}
