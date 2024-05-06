<template>
  <div
    class="card-builder-wrapper"
    :class="[{bg: bgColor}]"
    :style="`
      width: ${width}px;
      height: ${height}px;
      cursor: ${config.src ? 'pointer' : 'default' };
    `"
    @click="preview"
  >
    <card-image
      :config="config"
      :width="width"
      :height="height"
      hide-btn
    ></card-image>
    <div
      class="box"
      :style="`width: ${width}px; height: ${height}px;`"
    >
      <card-layout
        :config="config"
        :width="width"
        :height="height"
        hide-btn
      ></card-layout>
    </div>
    <!--    <m-button v-if="!hideBtn && this.config.src !== ''" type="iron" :w="`${width}px`" h="40px" @click="preview">-->
    <!--      {{ btnText }}-->
    <!--    </m-button>-->
    <div class="preview-btn">
      <i class="el-icon-zoom-in" @click.stop="preview"></i>
    </div>


    <div v-show="previewVisible" class="el-image-viewer__wrapper" style="z-index: 9999;">
      <div class="el-image-viewer__mask" @click.stop="closePreview">
      </div>
      <span class="el-image-viewer__btn el-image-viewer__close">
        <i class="el-icon-close" @click.stop="closePreview"></i></span>
      <div class="el-image-viewer__canvas">
        <!--        <div class="canvas" ref="canvas" :style="`background: url('${config.src}') no-repeat;`">-->
        <!--        <img :src="config.src" id="bgImage" class="img" alt="">-->
        <div
          class="canvas" ref="canvas"
          :style="`zoom: ${scale}`"
        >
          <div class="img-box">
            <img
              ref="bgImage"
              class="img"
              :src="config.src"
              width="1440"
              height="2560"
              alt=""
            >
          </div>
          <div
            class="layout-box"
            :class="['kcard__' + config.layout]"
            :style="`padding: ${kcardPadding}px;`"
          >
            <div
              class="title"
              :style="`
                 font-size: ${titleFontSize}px;
                 width: ${titleWidth}px;
                 line-height: ${titleLineHeight}px;
                 margin-top: ${titleMarginTop}px;
                 margin-bottom: ${titleMarginBottom}px;
               `"
            >{{ config.title ? config.title : '标题XXXXX' }}
            </div>
            <div
              class="desc"
              :style="`
                font-size: ${descFontSize}px;
                 width: 100%;
                 line-height: ${descLineHeight}px;
              `"
            >{{ config.desc ? config.desc : '描述描述描述描述描述描述描述' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import domtoimage from 'dom-to-image'
import CardLayout from './CardLayout'
import CardImage from './CardImage'

export default {
  name: 'CardBuilder',
  components: {
    CardImage,
    CardLayout,
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    width: {
      type: [Number, String],
      default: 200
    },
    height: {
      type: [Number, String],
      default: 200
    },
    // hideBtn: {
    //   type: Boolean,
    //   default: false,
    // },
    // btnText: {
    //   type: String,
    //   default: '预 览'
    // },
    bgColor: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      previewVisible: false,
      imageWidth: 0,
      imageHeight: 0,
      titleFontSize: 0,
      descFontSize: 0,
      titleWidth: 0,
      titleHeight: 0,
      titleLineHeight: 0,
      descLineHeight: 0,

      titleMarginTop: 0,
      titleMarginBottom: 0,

      scale: 0.5,
      kcardPadding: 0,
    }
  },
  watch: {
    // previewVisible(n) {
    //   // 预览图片时根据图片实际宽高来计算字体大小
    //   if (n) {
    //     this.$nextTick(() => {
    //       this.calcPercentageSize()
    //     })
    //   }
    // }
  },
  methods: {
    handleUse() {
      this.$emit('use', this.config)
    },
    closePreview() {
      this.previewVisible = false
    },
    preview() {
      if (this.config.src === '' || this.config.layout === '') return this.$message.warning('预览需要选择背景图和布局')
      if (this.config.src !== '' && this.config.layout !== '') {
        this.calcPercentageSize()
        this.previewVisible = true
      }
    },
    calcPercentageSize() {
      const standardWidth = 1440
      const standardHeight = 2560
      const img = this.$refs.bgImage
      const naturalWidth = img.naturalWidth
      const naturalHeight = img.naturalHeight

      this.imageWidth = naturalWidth
      this.imageHeight = naturalHeight

      this.titleFontSize = naturalWidth * (93 / standardWidth)
      this.descFontSize = naturalWidth * (57 / standardWidth)

      this.kcardPadding = naturalWidth * (96 / standardWidth)

      this.titleWidth = naturalWidth * (896 / standardWidth)
      this.titleHeight = naturalWidth * (393 / standardWidth)

      this.titleLineHeight = naturalWidth * (131 / standardWidth)
      this.descLineHeight = naturalWidth * (103 / standardWidth)

      this.titleMarginTop = naturalWidth * (353 / standardWidth)
      this.titleMarginBottom = naturalWidth * (106 / standardWidth)

      // 计算一个适合当前浏览器预览的缩放比
      const winHeight = window.innerHeight
      const pHeight = winHeight * 0.8
      this.scale = pHeight / standardHeight
    },
    build() {
      this.calcPercentageSize()
      this.scale = 1
      this.previewVisible = true
      const canvas = this.$refs.canvas

      return new Promise((resolve, reject) => {
        domtoimage.toJpeg(canvas, {
          // width: this.imageWidth,
          // height: this.imageHeight,
          width: 1440,
          height: 2560,
          quality: 0.8,
          bgcolor: '#ffffff'
        })
          .then((data) => {
            resolve(this.dataURLtoBlob(data))
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
  }, // methods end
  computed: {},
}
</script>

<style scoped lang="less">
@import "./kcard-layout.less";

.card-builder-wrapper {
  box-sizing: border-box;
  position: relative;
  border-radius: @kcardBorderRadius;

  .el-image {
    border-radius: 12px;
    opacity: .6;

    :deep(.el-image__error) {
      border-radius: @kcardBorderRadius;
    }
  }

  .box {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: @kcardBorderRadius;

    .grid {
      width: calc(100% - @kcardBorderRadius - @kcardBorderRadius);
      height: calc(100% - @kcardBorderRadius - @kcardBorderRadius);
      padding: 12px;
    }
  }
}


.bg {
  background-color: #e8eaee;
}

.el-image-viewer__canvas {
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas {
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "苹方", "Source Han Sans CN", "思源黑体", "Microsoft Yahei", "微软雅黑", sans-serif;
  font-weight: 600;

  position: relative;
  padding-bottom: 0 !important;
  //height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  //overflow: hidden;


  .title {
    font-size: 93px;
    font-weight: bold;
    color: #F3F3F3;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    letter-spacing: 2px;
  }

  .desc {
    font-size: 58px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 103px;
    letter-spacing: 2px;
  }


  .img-box {
    height: 100%;

    .img {
      display: block;
      // height: 100%;
      z-index: 10000;
    }
  }

  .layout-box {
    width: 100%;
    height: 100%;
    position: absolute;
    padding: 20px;
    box-sizing: border-box;

    .title {
      z-index: 10001;
      width: inherit;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }

    .desc {
      white-space: pre-wrap;
      width: inherit;
      z-index: 10001;
      margin: 0;
      padding: 0;
    }
  }
}

.global-mask {
  height: 100vh;
  width: 100vh;
  background: red;
}

.preview-btn {
  font-size: 20px;
  position: absolute;
  bottom: 0;
  left: auto;
}

.preview-btn {
  display: none;
  cursor: pointer;
  background-color: #000;
  opacity: .3;
  width: 100%;
  height: 100%;
  border-radius: @kcardBorderRadius;

  > i {
    display: block;
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    top: 50%;
    left: 50%;
    margin-top: -10px;
    margin-left: -10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #fff;
  }
}

.card-builder-wrapper:hover .preview-btn {
  //visibility: visible;
  display: block;
}
</style>
