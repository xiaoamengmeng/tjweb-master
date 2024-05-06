<template>
  <div
    class="card-carousel--card card-tpl-wrapper"
    :class="[{bg: bgColor}]"
    :style="`cursor: ${config.src ? 'pointer' : 'default' };`"
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
      @click.stop="config.src ? preview() : ''"
    >
      <card-layout
        :config="config"
        :width="width"
        :height="height"
        hide-btn
      ></card-layout>
    </div>
    <m-button v-if="!hideBtn" plain :w="`${width}px`" h="40px" @click="handleUse">{{ btnText }}</m-button>

    <div class="demo-image__preview" style="display: none;">
      <el-image
        :src="config.src"
        ref="previewImage"
        :preview-src-list="[config.src]"
        :z-index="9999"
      >
      </el-image>
    </div>
  </div>
</template>

<script>
import CardLayout from './CardLayout'
import CardImage from './CardImage'

export default {
  name: 'CardTpl',
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
    hideBtn: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: '使 用'
    },
    bgColor: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    handleUse() {
      this.$emit('use', this.config)
    },
    preview() {
      this.$refs.previewImage.showViewer = true
    },
  },
}
</script>

<style scoped lang="less">
.card-tpl-wrapper {
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

.title {
  font-size: 15px;
  font-weight: bold;
  color: #191D51;
}

.desc {
  color: #191D51;
}

.bg {
  background-color: #e8eaee;
}
</style>
