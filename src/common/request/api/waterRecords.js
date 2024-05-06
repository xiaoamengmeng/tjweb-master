import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/water_records/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/water_records/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/water_records/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/water_records/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/water_records/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/water_records/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/water_records/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/water_records/${id}/unlike/`)
  },
  statistics(payload) {
    return axios.get(`${base}/water_records/statistics/`, {
        params: payload,
    })
  }
}
