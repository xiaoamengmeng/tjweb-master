<template>
  <div>
    <recipe-table-editor ref="rte"></recipe-table-editor>
    <m-button @click="handleClick">click me</m-button>
  </div>
</template>

<script>
import RecipeTableEditor from "../RecipeTableEditor"

export default {
  name: 'Demo',
  components: {
    RecipeTableEditor
  },
  data() {
    return {
    }
  },
  methods: {
    handleClick() {
      console.log(this.$refs.rte.getParams())
    }
  },
}
</script>

<style scoped lang="less">
.box {
  margin-top: 20px;
  margin-left: 20px;
  width: 500px;
}
</style>
