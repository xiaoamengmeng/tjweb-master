import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/weekly_reports/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/weekly_reports/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/weekly_reports/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/weekly_reports/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/weekly_reports/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/weekly_reports/${id}/`)
  }
}
