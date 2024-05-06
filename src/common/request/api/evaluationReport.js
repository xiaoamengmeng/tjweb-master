import base from '../base'
import axios from '../http'

// 评估报告
export default {
  getList(payload) {
    return axios.get(`${base}/evaluation_report/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/evaluation_report/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/evaluation_report/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/evaluation_report/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/evaluation_report/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/evaluation_report/${id}/`)
  },
}
