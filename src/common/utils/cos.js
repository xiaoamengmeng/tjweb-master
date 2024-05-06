import COS from 'cos-js-sdk-v5'
import Vue from 'vue'

const vm = new Vue()

const install = async Vue => {
  Vue.prototype.$cos = {
    uploadFile: (fileList, progressCallback) => {
      return new Promise(async (resolve, reject) => {
        const fileNameList = fileList.map(item => item.name)
        const uploadKey = await getUploadKey(Vue, fileNameList)
        if (!uploadKey) {
          return vm.$message.error('临时密钥获取失败')
        }
        const cos = new COS({
          getAuthorization: async (options, callback) => {
            callback({
              TmpSecretId: uploadKey.credentials.tmp_secret_id,
              TmpSecretKey: uploadKey.credentials.tmp_secret_key,
              SecurityToken: uploadKey.credentials.session_token,
              StartTime: uploadKey.credentials.start_time,
              ExpiredTime: uploadKey.credentials.expired_time,
            })
          }
        })
        cos.uploadFile({
          Bucket: uploadKey.credentials.bucket_name, /* 填写自己的bucket，必须字段 */
          Region: uploadKey.credentials.region,     /* 存储桶所在地域，必须字段 */
          Key: uploadKey.path_list[0],              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          Body: fileList[0].raw ? fileList[0].raw : fileList[0], // 上传文件对象
          SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */
          onProgress: function (progressData) {
            if (typeof progressCallback === 'function') {
              progressCallback(progressData, uploadKey)
            }
          }
        }, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve({uploadKey, data})
          }
        })
      })
    },
    getVideoSnapshot: (key) => {
      return new Promise(async (resolve, reject) => {
        const uploadKey = await getUploadKey(Vue, [key])
        if (!uploadKey) {
          return vm.$message.error('临时密钥获取失败')
        }
        const cos = new COS({
          getAuthorization: async (options, callback) => {
            callback({
              TmpSecretId: uploadKey.credentials.tmp_secret_id,
              TmpSecretKey: uploadKey.credentials.tmp_secret_key,
              SecurityToken: uploadKey.credentials.session_token,
              StartTime: uploadKey.credentials.start_time,
              ExpiredTime: uploadKey.credentials.expired_time,
            })
          }
        })

        cos.request({
          Bucket: uploadKey.credentials.bucket_name, /* 填写自己的bucket，必须字段 */
          Region: uploadKey.credentials.region,     /* 存储桶所在地域，必须字段 */
          Method: 'GET',
          Key: key,  /* 存储桶内的媒体文件，必须字段 */
          Query: {
              'ci-process': 'snapshot', /** 固定值，必须 */
              time: 1, /** 截图的时间点，单位为秒，必须 */
              // width: 0, /** 截图的宽，非必须 */
              // height: 0, /** 截图的高，非必须 */
              // format: 'jpg', /** 截图的格式，支持 jpg 和 png，默认 jpg，非必须 */
              // rotate: 'auto', /** 图片旋转方式，默认为'auto'，非必须 */
              // mode: 'exactframe', /** 截帧方式，默认为'exactframe'，非必须 */
          },
          RawBody: true,
      },
        function(err, data){
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        });
      })
    }
  }
}

function getUploadKey(Vue, fileNameList) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$api.common.getCOSUploadSTSToken(fileNameList)
      .then((res) => {
        if (!res || !res.data.credentials) {
          reject('credentials invalid:\n' + JSON.stringify(res, null, 2))
        }
        resolve(res.data)
      })
      .catch((err) => {
        vm.$message.error('临时密钥获取失败')
        console.error(err)
        reject(err)
      })
  })

}

export default {
  install
}
