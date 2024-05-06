import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/project_rules/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/project_rules/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/project_rules/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/project_rules/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/project_rules/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/project_rules/${id}/`)
  }
}
