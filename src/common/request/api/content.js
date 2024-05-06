import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/manage_posts/`, {
      params: payload,
    })
  },
  getPublicList(payload) {
    return axios.get(`${base}/public_posts/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/manage_posts/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/manage_posts/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/manage_posts/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/manage_posts/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/manage_posts/${id}/`)
  },
  reject(id, data) {
    return axios.post(`${base}/manage_posts/${id}/reject/`, data)
  },
  approve(id) {
    return axios.post(`${base}/manage_posts/${id}/approve/`)
  }
}
