import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/mission_curriculum_category/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/mission_curriculum_category/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/mission_curriculum_category/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/mission_curriculum_category/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/mission_curriculum_category/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/mission_curriculum_category/${id}/`)
  }
}
