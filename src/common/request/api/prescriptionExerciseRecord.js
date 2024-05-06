import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/prescription_exercise_record/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/prescription_exercise_record/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/prescription_exercise_record/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/prescription_exercise_record/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/prescription_exercise_record/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/prescription_exercise_record/${id}/`)
  }
}
