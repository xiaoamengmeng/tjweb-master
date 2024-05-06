const url = window.config.SERVERS_URL
const env = process.env.NODE_ENV
let base = ''
if(env === 'development') {
  // base = 'http://0.0.0.0:8000' + '/api'
  base = '/api'
} else {
  base = url + '/api'
}

export default base
