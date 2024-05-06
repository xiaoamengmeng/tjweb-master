import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/roles/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/roles/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/roles/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/roles/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/roles/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/roles/${id}/`)
  },
	/**
	 * 权限
	 */
	getUserPermissions(id,payload) {
	  return axios.get(`${base}/roles/${id}/permissions/`, {
	    params: payload,
	  })
	},
	getPermissionsList(payload) {
	  return axios.get(`${base}/module_group_permissions/`, {
	    params: payload,
	  })
	},
	upUserPermissions(id,payload) {
	  return axios.put(`${base}/roles/${id}/permissions/`,payload)
	},
}
