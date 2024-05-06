import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/kcard/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/kcard/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/kcard/`, payload)
  },
  bulkCreate(list) {
    return axios.post(`${base}/kcard/bulk_create/`, list)
  },
  update(id, payload) {
    return axios.put(`${base}/kcard/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/kcard/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/kcard/${id}/`)
  }
}
