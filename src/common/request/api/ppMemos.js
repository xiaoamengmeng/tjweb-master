import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/pp_memos/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/pp_memos/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/pp_memos/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/pp_memos/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/pp_memos/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/pp_memos/${id}/`)
  }
}
