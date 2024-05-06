<template>
  <el-button
    class="m-button"
    :class="classOption"
    :style="`width: ${w}!important; height: ${h}!important;`"
    v-on="$listeners"
    v-bind="$attrs"
    :icon="icon"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: 'MButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    plain: {
      type: Boolean,
      default: false,
    },
    w: {
      type: String,
      default: 'auto'
    },
    h: {
      type: String,
      default: '46px'
    },
    icon: {
      type: String,
    }
  },
  mounted() {
  },
  computed: {
    classOption() {
      return [
        this.type,
        this.plain ? this.type + '-' + 'plain' : '',
      ]
    }
  },
}
</script>

<style scoped lang="less">
.m-button {
  box-sizing: border-box;
  height: @buttonHeight;
  border-color: unset;
  border: unset;
  font-size: 14px;
  border-radius: @buttonBorderRadius;
}

.primary {
  background-color: @primaryColor;
  color: #fff;

  &:hover, &:focus {
    border-color: unset;
    background-color: #04aea6 !important;
    color: #fff;
  }

  &:active {
    border-color: unset;
    background-color: #019c94 !important;
    color: #fff;
  }
}

.primary-plain {
  background: #ffffff !important;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  border: 1px solid @primaryColor !important;
  color: @primaryColor;

  &:hover, &:focus {
    background-color: #e5f7f3 !important;
    color: #fff;
  }

  &:active {
    background-color: #cdeae3 !important;
    color: #fff;
  }
}

.iron {
  background-color: @colorIronBlue !important;
  color: #fff !important;

  &:hover, &:focus {
    background-color: #666d92 !important;
  }

  &:active {
    background-color: #545a77 !important;
  }
}

.iron-plain {
  background: #ffffff !important;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  border: 1px solid @colorIronBlue !important;
  color: @colorIronBlue;

  &:hover, &:focus {
    background-color: #eaecf1 !important;
    color: #fff;
  }

  &:active {
    background-color: #dcdcde !important;
    color: #fff;
  }
}


.danger {
  color: #fff;
  background-color: #f56c6c !important;

  &:hover, &:focus {
    background-color: #f78989 !important;
    color: #fff;
  }

  &:active {
    background-color: #dd6161 !important;
  }
}

.default {
  color: #5A607F;
  background-color: #e9edfa !important;

  &:hover, &:focus {
    background-color: #dde1f1 !important;
    color: #5A607F;
  }

  &:active {
    background-color: #e9edfa !important;
  }
}

.default-plain {
  background-color: #e9edfa !important;
  border: 1px solid #e9edfa;
  color: #5A607F;

  &:hover, &:focus {
    border: 1px solid #e9edfa;
    background-color: #f5f5f5 !important;
    color: #606266;
  }

  &:active {
    border: 1px solid #e9edfa;
    background-color: #e1e1e1 !important;
    color: #606266;
  }
}
</style>
