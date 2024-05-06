import base from '../base'
import axios from '../http'
export default {
  getList(payload) {
    return axios.get(`${base}/notification_template/`, {
      params: payload,
    })
  },
  sendMsg(payload) {
    return axios.post(`${base}/notification_template/${payload.id}/send_template_message/`, payload)
  },
}
