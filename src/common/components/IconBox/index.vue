<template>
  <div
    class="icon-container"
    :style="`width: ${boxW}; height: ${boxH ? boxH + unit : '100%'}`"
  >
    <img
      class="icon-img" v-if="iconName"
      :src="require(`@/common/assets/${folder}/${iconName}.png`)"
      :alt="iconName"
      :style="`width: ${w}${unit}; height: ${h}${unit}`"
    >
  </div>
</template>
<script>
export default {
  name: 'IconBox',
  props: {
    //文件名
    iconName: {
      required: true,
      type: String
    },
    w: {
      type: [String, Number],
      default: '20'
    },
    h: {
      type: [String, Number],
      default: '20'
    },
    boxW: {
      type: [String, Number],
    },
    boxH: {
      type: [String, Number],
    },
    folder: {
      type: String,
      default: 'icons'
    },
    unit: {
      type: String,
      default: 'px'
    }
  }
}
</script>
<style scoped lang="less">

.icon-container {
  float: left;
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
}

.icon-img {
  vertical-align: middle;
  object-fit: contain;
}
</style>
