import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/menstrual_period/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/menstrual_period/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/menstrual_period/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/menstrual_period/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/menstrual_period/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/menstrual_period/${id}/`)
  },
  like(id) {
    return axios.post(`${base}/menstrual_period/${id}/like/`)
  },
  unlike(id) {
    return axios.post(`${base}/menstrual_period/${id}/unlike/`)
  },
  statistics(payload) {
    return axios.get(`${base}/menstrual_period/statistics/`, {
        params: payload,
    })
  },
  menstrualSetting(payload) {
    return axios.get(`${base}/menstrual_setting/`, {
        params: payload,
    })
  }
}
