import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/pp_intervs/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/pp_intervs/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/pp_intervs/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/pp_intervs/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/pp_intervs/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/pp_intervs/${id}/`)
  }
}
