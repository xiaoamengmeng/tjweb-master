module.exports = {
  plugins: {
    'postcss-pxtorem': {
      //根元素字体大小
      rootValue: 16,
      //匹配CSS中的属性，* 代表启用所有属性
      // propList: ['width', 'height', 'line-height', 'top', 'left', 'bottom', 'right', 'padding', 'margin', 'font-size'],
      propList: ['*'],
      //转换成rem后保留的小数点位数
      unitPrecision: 5,
      //小于12px的样式不被替换成rem
      minPixelValue: 12,
      //忽略一些文件，不进行转换，比如我想忽略 依赖的UI框架
      // exclude: ['node_modules'],
      // exclude: /(?!(common\\views\\login\\))/,
      /**
       *
       * @param file 文件路径
       * @returns {boolean}
       */
      exclude: (file) => {
        // 忽略除了login以外的文件
        return file.indexOf('login') === -1;
      }
    }
  }
}
