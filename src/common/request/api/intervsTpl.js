import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/interv_templates/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/interv_templates/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/interv_templates/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/interv_templates/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/interv_templates/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/interv_templates/${id}/`)
  }
}
