import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/dr_ver/`, {
      params: payload,
    })
  },
  getVerDetail(id) {
		return axios.get(`${base}/dr_ver/${id}/`,)
	},
	upStatus(id,payload) {
		return axios.patch(`${base}/dr_ver/${id}/`,payload)
	},
	saveApprove(id) {
		return axios.post(`${base}/dr_ver/${id}/approve/`,)
	},
	saveReject(id,payload) {
		return axios.post(`${base}/dr_ver/${id}/reject/`,payload)
	},
	upDoctorAccoun(id,type,payload) {
		return axios.post(`${base}/dr_ver/${id}/${type}/`,payload)
	},
	getDoctorLogList(payload) {
		return axios.get(`${base}/dr_ver_logs/`, {
			params: payload
		})
	},
	drVerMyQrcodeRetrieve() {
		return axios.get(`${base}/dr_ver/my_qrcode/`,)
	},
}
