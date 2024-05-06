import base from '../base'
import axios from '../http'

export default {
  get(id) {
    return axios.get(`${base}/physical_data/${id}/`)
  },
  update(id, payload) {
    return axios.put(`${base}/physical_data/${id}/`, payload)
  },
}
