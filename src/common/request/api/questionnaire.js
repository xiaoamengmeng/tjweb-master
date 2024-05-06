import base from '../base'
import axios from '../http'

// 问卷调查
export default {
  getList(payload) {
    return axios.get(`${base}/questionnaire/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/questionnaire/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/questionnaire/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/questionnaire/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/questionnaire/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/questionnaire/${id}/`)
  },
}
