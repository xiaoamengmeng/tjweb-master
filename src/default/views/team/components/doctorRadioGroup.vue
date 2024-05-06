<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "doctorRadioGroup",
  provide() {
    return {
      RadioGroup: this,
    };
  },
  props: {
    // RadioGroup组件 接受到value值
    // 之后得触发一下 当前input事件 动态改变父组件的value值
    // RadioGroup组件 操作radio组件 -> 使用provide 和 inject
    value: {
      type: [String,Number],
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style  lang="less" scoped>
</style>
