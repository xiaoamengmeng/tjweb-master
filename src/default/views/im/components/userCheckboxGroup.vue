<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "doctorCheckboxGroup",
  provide() {
    return {
      CheckboxGroup: this,
    };
  },
  props: {
    // CheckboxGroup组件 接受到value值
    // 之后得触发一下 当前input事件 动态改变父组件的value值
    // CheckboxGroup组件 操作radio组件 -> 使用provide 和 inject
    value: {
      type: Array,
      default: [],
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
