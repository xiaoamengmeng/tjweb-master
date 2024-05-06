import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/pp_exercises/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/pp_exercises/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/pp_exercises/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/pp_exercises/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/pp_exercises/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/pp_exercises/${id}/`)
  }
}
