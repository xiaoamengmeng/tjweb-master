import base from '../base'
import axios from '../http'
import qs from 'qs'
export default {
  getList(payload) {
    return axios.get(`${base}/custom_forms/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/custom_forms/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/custom_forms/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/custom_forms/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/custom_forms/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/custom_forms/${id}/`)
  }
}
