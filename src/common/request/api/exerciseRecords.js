import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/exercise_records/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/exercise_records/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/exercise_records/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/exercise_records/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/exercise_records/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/exercise_records/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/exercise_records/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/exercise_records/${id}/unlike/`)
  },
  getExerciseRecords(payload) {
    return axios.get(`${base}/exercise_records/statistics/`, {
      params: payload
    })
  }
}
