<template>
  <div class="upload-viewer-wrapper">
    <el-upload
      ref="upload"
      v-show="visible"
      drag
      :multiple="false"
      :limit="1"
      :file-list="localFileList"
      :show-file-list="true"
      action=""
      :auto-upload="false"
      :on-change="onChange"
      :on-remove="onChange"
      :accept="accept"
      list-type="picture-card"
      class="upload"
    >
      <div v-if="$slots.default" class="tips">
        <slot></slot>
      </div>
      <div v-else class="tips">
        <i class="el-icon-plus"></i>
      </div>
    </el-upload>
    <div v-if="!visible && previewSrc !== ''" class="image-wrapper box">
      <i v-if="!readonly" class="close-btn el-icon-close" @click="handleRemove"></i>
      <i v-if="mode === 'video' && !previewVideoVisible" class="play-btn el-icon-video-play" @click="preview"></i>
      <i v-if="mode === 'video' && previewVideoVisible" class="play-btn el-icon-video-pause" @click="preview"></i>
      <el-image
        class="img-box"
        :src="previewSrc"
        alt=""
        fit="cover"
        @click="preview"
      />
      <div class="upload-progress" v-show="progressVisible">
        <el-progress
          :show-text="false"
          :percentage="percentage"
          :color="progressColors"
          :stroke-width="6"
        ></el-progress>
      </div>
    </div>

    <div class="demo-image__preview" style="display: none;">
      <el-image
        :src="previewSrc"
        ref="previewImage"
        :preview-src-list="[previewSrc]"
        :z-index="9999"
      >
      </el-image>
    </div>

    <div v-if="mode === 'video' && previewVideoVisible" class="el-image-viewer__wrapper" style="z-index: 9999;">
      <div class="el-image-viewer__mask" @click="previewVideoVisible = false">

      </div>
      <span class="el-image-viewer__btn el-image-viewer__close">
        <i class="el-icon-close" @click="previewVideoVisible = false"></i></span>
      <div class="el-image-viewer__canvas">
        <video
          :src="previewVideoUrl"
          controls
          width="640"
          autoplay
          style="z-index: 9999;"
        ></video>
      </div>
    </div>
    <el-dialog
      title="裁剪图像"
      :visible.sync="avatarCropVisible"
      class="crop-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-show="cropOption.img" class="crop-container">
        <vueCropper
          class="crop-box"
          ref="cropper"
          :img="cropOption.img"
          :autoCrop="cropOption.autoCrop"
          :fixedBox="cropOption.fixedBox"
          :canMoveBox="cropOption.canMoveBox"
          :autoCropWidth="cropOption.autoCropWidth"
          :autoCropHeight="cropOption.autoCropHeight"
          :centerBox="cropOption.centerBox"
          :fixed="cropOption.fixed"
          :fixedNumber="cropOption.fixedNumber"
          :canMove="cropOption.canMove"
          :canScale="cropOption.canScale"
          :info="cropOption.info"
          :mode="cropOption.mode"
          :high="cropOption.high"
          :info-true="cropOption.infoTrue"
          :full="cropOption.full"
          :output-type="cropOption.outputType"
        ></vueCropper>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="cancelCrop">取 消</m-button>
        <m-button @click="cropUploadFile">上 传</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MUpload',
  props: {
    fileList: {  //文件列表
      type: Array,
      default: () => []
    },
    imageUrl: {
      type: String,
    },
    imagePath: {
      type: String,
    },
    accept: {
      type: String,
      default: 'image/jpg'
    },
    tips: {
      type: String,
      default: ''
    },
    // image | video
    mode: {
      type: String,
      default: 'image',
    },
    successTips: {
      type: String,
      default: '上传成功'
    },
    failTips: {
      type: String,
      default: '上传发生错误'
    },
    hideTips: {
      type: Boolean,
      default: false,
    },
    hideErrTips: {
      type: Boolean,
      default: false,
    },
    limitSize: { // 单位：MB
      type: Number,
      default: 5,
    },
    videoUrl: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // 上传前进行裁剪
    useCrop: {
      type: Boolean,
      default: false,
    },
    coverSrc: {
      type: String,
    }
  },
  data() {
    return {
      localFileList: [],
      visible: true,
      previewSrc: '',

      progressVisible: false,
      percentage: 0,
      progressColors: [
        { color: '#909399', percentage: 0 },
        { color: '#67c23a', percentage: 100 },
      ],
      progressStatus: '',

      previewVideoVisible: false,
      previewVideoUrl: '',
      avatarCropVisible: false,
    }
  },
  watch: {
    imageUrl(n) {
      if (n !== '' && n !== null && n !== undefined) {
        this.visible = false
        this.previewSrc = n
      } else {
        this.handleRemove()
      }
    },
    imagePath(n) {
      if (!this.imageUrl) {
        if (n === '' && n === null && n === undefined) {
          this.handleRemove()
        }
      }
    },
    progressVisible(n) {
      if (!n) {
        this.progressStatus = ''
        this.percentage = 0
      }
    },
    videoUrl(n) {
      this.previewVideoUrl = n
    },
    coverSrc(n) {
      if (!n && this.previewVideoUrl) {
        this.$getVideoCover(this.previewVideoUrl, (imageUrl) => {
          this.previewSrc = imageUrl
        })
      }
    }
  },
  mounted() {
    if (this.imageUrl !== '' && this.imageUrl !== null && this.imageUrl !== undefined) {
      this.visible = false
      this.previewSrc = this.imageUrl
    } else {
      this.handleRemove()
    }
  },
  methods: {
    async onChange(file, fileList) {
      const verify = this.verifyUpload(file)
      if (!verify) {
        return
      }
      this.localFileList = fileList
      if (this.mode === 'image') {
        // 上传图片
        this.previewSrc = file.url
        this.$emit('update:imageUrl', this.previewSrc)
      } else {
        // 上传视频
        this.previewVideoUrl = file.url
        if (this.coverSrc) {
          this.previewSrc = this.coverSrc
        } else {
          this.$getVideoCover(file.url, (imageUrl) => {
            this.previewSrc = imageUrl
          })
        }
      }
      this.visible = false
      this.$emit('update:file-list', fileList)
      this.$emit('change')
      if (this.mode === 'image' && this.useCrop) {
        this.avatarCropVisible = true
      } else {
        this.uploadFile()
      }
    },
    handleRemove() {
      this.visible = true
      this.localFileList = []
      this.previewSrc = ''
      if (this.mode === 'video') {
        this.previewVideoUrl = ''
      }
      this.$emit('update:file-list', this.fileList)
      this.$emit('update:imagePath', '')
      this.$emit('update:imageUrl', '')
      this.$emit('update:videoUrl', '')
      this.$emit('remove')
      this.progressVisible = false
    },
    preview() {//预览图片
      if (this.mode === 'image') {
        this.$refs.previewImage.showViewer = true
      } else {
        this.previewVideoVisible = true
      }
    },
    processHandle(progressData, uploadKey) {
      this.percentage = progressData.percent * 100
      if (progressData.percent === 1) {
        this.progressStatus = 'success'
        const image_path = uploadKey.path_list[0]
        this.$emit('upload-success', image_path)
        setTimeout(() => {
          this.progressVisible = false
        }, 800)
      }
    },
    uploadFile() {
      this.progressVisible = true
      this.$cos.uploadFile(this.localFileList, this.processHandle)
        .then((res) => {
          this.$emit('update:imagePath', res.uploadKey.path_list[0])
          // setTimeout(() => {
          if (!this.hideTips) {
            this.$message.success(this.successTips)
          }
          // }, 800)
          const url = res.data.Location
          // if(this.mode === 'image') {
          // this.previewSrc = this.repUrl(url)
          // }
        })
        .catch((err) => {
          if (!this.hideErrTips) {
            this.$message.error(this.failTips)
          }
          this.progressStatus = 'exception'
          this.$emit('update:imagePath', '')
          this.previewSrc = 'err'
          this.progressVisible = false
        })
    },
    cropUploadFile() {
      this.$refs.cropper.getCropBlob(blob => {
        const url = window.URL.createObjectURL(blob)
        this.previewSrc = url
        this.$emit('update:imageUrl', this.previewSrc)
        this.localFileList[0].raw = blob
        this.localFileList[0].size = blob.size
        this.localFileList.url = url
        this.uploadFile()
        this.avatarCropVisible = false
      })
    },
    cancelCrop() {
      this.avatarCropVisible = false
      this.handleRemove()
    },
    verifyUpload(file) {
      let pass = false
      const limitSize = this.limitSize * 1024 * 1024
      const sizeMB = file.size
      if (sizeMB <= limitSize) {
        pass = true
      } else {
        pass = false
        this.handleRemove()
        this.$message.error(`上传文件大小不能超过 ${this.limitSize} MB`)
      }

      return pass
    },
    repUrl(url) {
      return url.substring(0, 4) === 'http' ? url : 'https://' + url
    },
  }, // methods end
  computed: {
    cropOption() {
      return {
        img: this.imageUrl,
        autoCrop: true,
        fixedBox: false,
        canMoveBox: true,
        canMove: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixed: true,
        fixedNumber: [1, 1],
        centerBox: true,
        canScale: true,
        info: true,
        mode: 'contain',
        high: true,
        full: true,
        infoTrue: false,
        outputType: 'png',
      }
    }
  },
}
</script>

<style scoped lang="less">
.upload-viewer-wrapper {
  box-sizing: border-box;
  /*/deep/ .el-upload-list {*/
  /*  display: none;*/
  /*}*/

  .upload {
    height: 100%;
  }

  :deep(.el-upload--picture-card) {
    width: 100%;
    height: 100%;
  }

  :deep(.el-upload-list__item) {
    transition: none !important;
  }
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
}

:deep(.el-upload-list--picture .el-upload-list__item) {
  //max-width: 150px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  z-index: 10;

  .img-box {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
  }

  .upload-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: 12;

    .el-progress {
      padding: 0 10px 4px 10px;
    }
  }
}

.close-btn {
  display: none;
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 11;
  cursor: pointer;
  font-weight: bold;
  padding: 4px;
  color: #fff;
  background-color: #000;
  opacity: .3;
  border-radius: 50%;
  font-size: 12px;
}

.image-wrapper:hover .close-btn {
  //visibility: visible;
  display: block;
}

.play-btn {
  font-size: 46px;
  position: absolute;
  top: calc(50% - 23px);
  left: calc(50% - 23px);
  color: #414141;
  cursor: pointer;
}


.tips {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover > i {
    color: @primaryColor;
  }
}

.crop-dialog {
  :deep(.el-dialog) {
    width: 500px;
    height: 600px;

    .el-dialog__header {
      height: 30px;
    }

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow-y: auto;
      overflow-x: hidden;

      .crop-container {
        height: 100%;

        .crop-box {
          height: 100%;
        }
      }
    }
  }


}
</style>
