import base from '../base'
import axios from '../http'

// 项目患者
export default {
  getList(payload) {
    return axios.get(`${base}/project_patients/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/project_patients/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/project_patients/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/project_patients/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/project_patients/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/project_patients/${id}/`)
  },
  assignDietitian(id, payload) {
    return axios.post(`${base}/project_patients/${id}/assign_dietitian/`, payload)
  },
  cancelDietitian(id, payload) {
    return axios.post(`${base}/project_patients/${id}/cancel_assign/`, payload)
  },
  bulkAssignDietitian(payload) {
    return axios.post(`${base}/project_patients/bulk_assign_dietitian/`, payload)
  },
}
