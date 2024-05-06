import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/data_sync/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/data_sync/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/data_sync/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/data_sync/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/data_sync/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/data_sync/${id}/`)
  },
}