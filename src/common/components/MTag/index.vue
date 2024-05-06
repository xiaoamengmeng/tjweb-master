<template>
  <div>
    <div v-if="custom">
      <el-tag color="#09C582" :class="{'circle': circle}"
      >
        <slot></slot>
      </el-tag>
    </div>
    <template v-else>
      <el-tag v-if="status === this.$enum.PROJECT_STATUS.CLOSED" color="#8B96A9" :class="{'circle': circle}"
      >
        <icon-box icon-name="closed" w="7" h="11" box-w="11" style="margin-right: 5px;"></icon-box>
        {{ status | projectStatus }}
      </el-tag>
      <el-tag v-if="status === this.$enum.PROJECT_STATUS.PROCESSING" color="#09C582" :class="{'circle': circle}"
      >
        <icon-box icon-name="processing" w="7" h="11" box-w="11" style="margin-right: 5px;"></icon-box>
        {{ status | projectStatus }}
      </el-tag>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MTag',
  props: {
    type: '',
    disabled: Boolean,
    status: {
      type: Number,
      // required: true
    },
    custom: Boolean,
    circle: Boolean
  },
}
</script>

<style scoped lang="less">
.circle {
  border-radius: 13px !important;
}
</style>
