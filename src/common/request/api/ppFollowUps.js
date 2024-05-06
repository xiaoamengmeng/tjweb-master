import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/pp_follow_ups/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/pp_follow_ups/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/pp_follow_ups/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/pp_follow_ups/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/pp_follow_ups/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/pp_follow_ups/${id}/`)
  }
}
