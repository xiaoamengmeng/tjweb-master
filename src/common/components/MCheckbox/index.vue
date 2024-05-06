<template>
  <div class="m-checkbox" @click="toggle">
    <icon-box v-if="check" icon-name="tongyi" w="16" h="16" box-w="16" box-h="40"></icon-box>
    <icon-box v-else icon-name="butongyi" w="16" h="16" box-w="16" box-h="40"></icon-box>
    <div class="split"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MCheckbox',
  props: {
    check: {
      type: Boolean,
      required: true,
    },
  },
  watch: {
    check(val) {
      this.localCheck = val
    }
  },
  mounted() {
    this.localCheck = this.check
  },
  data() {
    return {
      localCheck: false
    }
  },
  methods: {
    toggle() {
      this.localCheck = !this.check
      this.$emit('change', !this.check)
      this.$emit('update:check', !this.check)
    }
  }
}
</script>

<style scoped lang="less">
.m-checkbox {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  user-select: none;

  .split {
    display: inline-block;
    width: 5px;
  }
}
</style>
