<template>
  <div
    class="card-carousel--card card-image-wrapper"
    :style="`width: ${width}px;`"
  >
    <el-image
      :src="config.src" alt=""
      fit="cover"
      :style="`width: ${width}px; height: ${height}px;`"
      :preview-src-list="[config.src]"
    ></el-image>
    <m-button v-if="!hideBtn" plain :w="`${width}px`" h="40px" @click="handleUse">{{ btnText }}</m-button>
  </div>
</template>

<script>
export default {
  name: 'CardImage',
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
  },
  methods: {
    handleUse() {
      this.$emit('use', this.config)
    }
  }
}
</script>

<style scoped lang="less">
.card-image-wrapper {
  box-sizing: border-box;

  .el-image {
    width: inherit;
    height: inherit;
    border-radius: 12px;
    //opacity: .6;

    :deep(.el-image__error) {
      display: none;
    }
  }
}
</style>
