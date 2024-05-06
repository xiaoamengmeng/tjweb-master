import base from '../base'
import axios from '../http'

export default {
  // 登录时获取验证码
  getCode(payload) {
    return axios.get(`${base}/auth/otp/`, {
      params: payload,
    })
  },
  // 修改密码时获取验证码
  getPwdCode(payload) {
    return axios.get(`${base}/accounts/reset_password/`, {
      params: payload,
    })
  },
  resetPassword(payload) {
    return axios.post(`${base}/accounts/reset_password/`, payload)
  },
  login(payload) {
    return axios.post(`${base}/auth/otp/`, payload)
  },
  pwdLogin(payload) {
    return axios.post(`${base}/login`, payload)
  },
  info() {
    return axios.get(`${base}/users/me/`)
  },
  getList(payload) {
    return axios.get(`${base}/users/`, {
      params: payload
    })
  },
  getTeamMembers(page, pageSize, department, organization, keyword) {
    console.log('====================================');
    console.log(organization);
    console.log('====================================');
    return axios.get(`${base}/users/`, {
      params: {
        ordering: 'id',
        role_id__in: 'admin,ld,rd,dr,da',
        account__is_active: true,
        account__department__in: department,
        // 包含糖吉科技所有人
        account__department__organization__in: organization,
        page: page,
        page_size: pageSize,
        verification__status: 'approved'
      }
    })
  },
  create(payload) {
    return axios.post(`${base}/users/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/users/${id}/`)
  },
  patch(id, payload) {
    return axios.patch(`${base}/users/${id}/`, payload)
  },
  patchMe(payload) {
    return axios.patch(`${base}/users/me/`, payload)
  }
}
