import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/accounts_admin/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/accounts_admin/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/accounts_admin/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/accounts_admin/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/accounts_admin/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/accounts_admin/${id}/`)
  },
  deleteForAccounts(id) {
    return axios.delete(`${base}/accounts/${id}/`)
  },
  changePasswordByOldPassword(payload) {
    return axios.post(`${base}/accounts/change_password_by_password/`, payload)
  },
  requestChangePhone() {
    return axios.get(`${base}/accounts/request_change_phone_number/`)
  },
  verifyChangePhone(otp) {
    return axios.post(`${base}/accounts/request_change_phone_number/`, {
      otp: otp
    })
  },
  getNewPhoneVerifyCode(newPhone, secret) {
    return axios.get(`${base}/accounts/change_phone_number/`, {
      params: {
        new_phone_number: newPhone,
        secret: secret,
      }
    })
  },
  changePhoneNumber(otp) {
    return axios.post(`${base}/accounts/change_phone_number/`, {
      otp: otp,
    })
  },

  getNoneGroupList(payload) {
    return axios.get(`${base}/account_none_group/`, {
      params: payload,
    })
  },

  joinGroup(payload) {
    return axios.put(`${base}/account_none_group/join_group/`, payload)
  }

}
