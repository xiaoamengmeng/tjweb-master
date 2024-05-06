import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/emotion_record/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/emotion_record/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/emotion_record/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/emotion_record/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/emotion_record/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/emotion_record/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/emotion_record/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/emotion_record/${id}/unlike/`)
  },
  statistics(payload) {
    return axios.get(`${base}/emotion_record/statistics/`, {
        params: payload,
    })
  }
}
