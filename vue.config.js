const path = require('path')
const projectName = process.env.PROJECT_NAME
const multiConfig = require('./config/multi.entry')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,

  ...multiConfig[projectName],

  configureWebpack: config => {
    config.resolve = {
      extensions: ['.js', '.vue', '.json', '.css'],
      alias: {
        '@': resolve(`src`),
        '/': resolve(`src/${projectName}/`)
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, `src/common/style/global.less`)]
    }
  },

  css: {
    extract: false
  },

  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]

}
