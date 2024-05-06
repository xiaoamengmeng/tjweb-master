const config = {
  default: {
    outputDir: 'dist/default',
    pages: {
      index: {
        entry: 'src/default/main.js',
        template: 'public/index.html',
        filename: 'index.html'
      },
    },
    devServer: {
      open: false,
      port: 8080,
      proxy: {
        '/api': {
          // target: 'https://tjapi.dev-hk.bviews.top', // 测试服务器
          // target: "https://api.jixianghealth.com",
          target: "https://api.staging.jixianghealth.com",
          // target: "http://127.0.0.1:8000",
          port: 8080,
          ws: true,
          changeOrigin: true,
        }
      }
    },
  },
  admin: {
    outputDir: 'dist/admin',
    pages: {
      index: {
        entry: 'src/admin/main.js',
        template: 'public/index.html',
        filename: 'index.html'
      },
    },
    devServer: {
      open: false,
      port: 8081,
      proxy: {
        '/api': {
          // target: 'https://tjapi.dev-hk.bviews.top', // 测试服务器
          target: "https://api.staging.jixianghealth.com",
          // target: "https://api.jixianghealth.com",
          port: 8081,
          ws: true,
          changeOrigin: true,
        }
      }
    },
  }
}

module.exports = config
