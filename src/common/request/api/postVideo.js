import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/post_video/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/post_video/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/post_video/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/post_video/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/post_video/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/post_video/${id}/`)
  }
}