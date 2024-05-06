import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/orgs/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/orgs/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/orgs/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/orgs/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/orgs/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/orgs/${id}/`)
  }
}
