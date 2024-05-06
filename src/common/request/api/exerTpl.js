import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/exer_templates/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/exer_templates/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/exer_templates/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/exer_templates/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/exer_templates/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/exer_templates/${id}/`)
  }
}
