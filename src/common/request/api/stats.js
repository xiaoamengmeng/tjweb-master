import base from '../base'
import axios from '../http'

export default {
  getPatientSummary(payload) {
    return axios.post(`${base}/stats/patient_summary/`, payload)
  },
	getPatientSummaryDetail(payload) {
	  return axios.get(`${base}/stats/patient_stat_info/`, {
			params: payload
		})
	},
  getPatientUsage(payload) {
    return axios.post(`${base}/stats/patient_usage/`,payload)
  },
	getPatientUsageDetail(payload) {
	  return axios.get(`${base}/stats/patient_detail_info/`,{
			params: payload
		})
	},
	getDietitianDetail(payload) {
	  return axios.get(`${base}/stats/dietitian_detail/`,{
			params: payload
		})
	},
	getDietitianSummary(payload) {
	  return axios.post(`${base}/stats/dietitian_summary/`,payload)
	},
	patientCfRecords(payload) {
		return axios.get(`${base}/stats/patient_cf_records/`, {
			params: payload
		})
	},
}
