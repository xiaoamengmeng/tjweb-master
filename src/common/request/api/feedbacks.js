import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/feedbacks/`, {
      params: payload,
    })
  },

}
