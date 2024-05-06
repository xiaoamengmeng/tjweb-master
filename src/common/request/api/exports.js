import base from '../base'
import axios from '../http'

export default {
  exportFile(payload) {
    return axios({
      url: `${base}/export/my_patient_records`,
      method: 'get',
      responseType: 'blob',
      params: payload,
    })
  },
}

