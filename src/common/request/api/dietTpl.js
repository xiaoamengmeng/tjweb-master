import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/diet_templates/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/diet_templates/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/diet_templates/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/diet_templates/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/diet_templates/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/diet_templates/${id}/`)
  }
}
