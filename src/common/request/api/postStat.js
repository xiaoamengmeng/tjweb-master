import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/post_stats/`, {
      params: payload,
    })
  },
  monthViews(payload) {
    return axios.get(`${base}/post_stats/month_viewers/`, {
      params: payload,
    })
  }
}
