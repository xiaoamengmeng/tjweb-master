import Vue from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const vm = new Vue()

const clone = (obj) => {
  var o
  // 如果  他是对象object的话  , 因为null,object,array  也是'object';
  if (typeof obj === 'object') {

    // 如果  他是空的话
    if (obj === null) {
      o = null
    } else {

      // 如果  他是数组arr的话
      if (obj instanceof Array) {
        o = []
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]))
        }
      }
      // 如果  他是对象object的话
      else {
        o = {}
        for (var j in obj) {
          o[j] = clone(obj[j])
        }
      }

    }
  } else {
    o = obj
  }
  return o
}

if (!Object.prototype.hasOwnProperty("compareAssign")) {
  Object.defineProperty(Object.prototype, "compareAssign", {
    enumerable: false,
    writable: true,
    configurable: true,
    /**
     *
     * @param tgrObject
     * @param exclude {Array} 字符串数组，数组每一项是需要排除赋值的key
     * @returns {*}
     */
    value: function (tgrObject, exclude) {
      Object.keys(tgrObject).forEach(key => {
        if (exclude && exclude.includes(key)) {
          return
        }
        if (this.hasOwnProperty(key)) {
          this[key] = tgrObject[key]
        }
      })
      return this
    }
  })
}

Vue.prototype.$clone = clone

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
  return fmt
}

const uuid = () => {
  return URL.createObjectURL(new Blob()).substr(-36).toUpperCase()
}

Object.defineProperty(Vue.prototype, '$uuid', {
  get() {
    return uuid()
  }
})

const download = (url, filename) => {
  axios({
    url: url,
    method: 'GET',
    responseType: 'blob'
  })
    .then(res => {
      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]))
      let a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename // 下载后的文件名
      document.body.appendChild(a)
      a.click() // 点击下载
      document.body.removeChild(a) // 下载完成移除元素
      window.URL.revokeObjectURL(url)
    })
    .catch(err => {
      console.log(err)
      vm.$message.error(`下载发生错误：${ err }`)
    })
}

Vue.prototype.$download = download

const canvasToDataUrl = (video) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const imgHeight = video.videoHeight
  const imgWidth = video.videoWidth
  canvas.width = imgWidth
  canvas.height = imgHeight
  ctx.drawImage(video, 0, 0, imgWidth, imgHeight)
  // 设置图片质量为0.75，如果是缩略图一般取0.35
  return canvas.toDataURL('image/jpeg', 0.35)
}
const genVideoCover = (url, callback, second = 1) => {
  const video = document.createElement('video')
  video.setAttribute('crossorigin', 'anonymous')
  video.style.objectFit = "contain"
  // 取视频第n秒
  video.addEventListener('loadeddata', function () {
    // 设置currentTime
    this.currentTime = second
  })
  video.addEventListener('seeked', function () {
    const imageUrl = canvasToDataUrl(video)
    callback && callback(imageUrl)
  })
  video.addEventListener('error', function () {
    callback && callback()
  })
  video.src = url
}

const getVideoSecond = (url, callback) => {
  const video = document.createElement('video')
  video.setAttribute('crossorigin', 'anonymous')
  video.src = url
  video.onloadedmetadata = function() {
    callback && callback(video.duration)
  }
}

Vue.prototype.$getVideoCover = genVideoCover
Vue.prototype.$getVideoSecond = getVideoSecond

const toChineseNum = (num) => {
  let dtext=['','十','百','千','万']
  let len=num.toString().length
  let numArr=num.toString().split('')
  let numTxt=''


  const toT=(numIndex)=>{
    const arr=['零','一','二','三','四','五','六','七','八','九']
    return arr[numIndex]
  }

  if(num == 10) return '十'
  if(len == 2 && num.toString()[0] == 1) {
    return '十' + toT(num - 10)
  }

  for(let i=1;i<=len;i++){
    if(len>5&&i<(len-3)){
      if(i==(len-4)){
        numTxt+=numArr[i-1]==0?'':toT(numArr[i-1])
        numTxt+='万'
      }else{
        if((numArr[i-2]==0&&numArr[i-1]==0)||((numArr[i-1]==0)&&(numArr[len-5]==0)&&numArr[i]==0)){
          numTxt+=''
        }else{
          numTxt+=(((numArr[i-1]==0)&&(numArr[len-5]!=0))||(numArr[i]!=0&&numArr[i-1]==0))?'零':(toT(numArr[i-1])+dtext[len-i-4])
        }
      }}else{
      if((numArr[i-1]==0&&i==len)||(numArr[i]==0&&numArr[i-1]==0)){
        numTxt+=''
      }else{
        numTxt+=numArr[i-1]==0?'零':(toT(numArr[i-1])+dtext[len-i])
      }
    }}
  return numTxt
}
Vue.prototype.$numToCN = toChineseNum
