import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/cf_records/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/cf_records/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/cf_records/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/cf_records/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/cf_records/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/cf_records/${id}/`)
  },
  getAnswerStats(payload) {
    return axios.get(`${base}/cf_answer_stats/`,{
      params: payload,
    })
  }
}
