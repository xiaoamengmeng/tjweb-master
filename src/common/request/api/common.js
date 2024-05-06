import base from '../base'
import axios from '../http'

export default {
  getCOSUploadSTSToken(fileNameList = []) {
    return axios.post(`${base}/common/get_cos_upload_sts/`, {
      'file_name_list': fileNameList,
      'visible': 'public'
    })
  },
}
