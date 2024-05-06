import base from '../base'
import axios from '../http'

// 项目患者
export default {
  getList(payload) {
    return axios.get(`${base}/my_project_patients/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/my_project_patients/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/my_project_patients/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/my_project_patients/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/my_project_patients/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/my_project_patients/${id}/`)
  },
  cancelAssign(id) {
    return axios.post(`${base}/my_project_patients/${id}/cancel_assign/`)
  },
  continueService(id) {
    return axios.post(`${base}/my_project_patients/${id}/continue_service/`)
  },
  endService(id) {
    return axios.post(`${base}/my_project_patients/${id}/end_service/`)
  },
  getStat(payload) {
    return axios.get(`${base}/my_project_patients/stats/`, {
      params: payload
    })
  },
}
