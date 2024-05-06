<template>
  <m-view-table
    :data="recipeData"
    :height="height.toString()"
    border
    hide-pagination
    hide-loading
  >
    <el-table-column label="餐段" width="100" prop="title"></el-table-column>
    <el-table-column label="用餐情况" align="center">
      <template v-slot="scope">
        <div v-if="scope.row.meal.length === 0">
          <span>暂无</span>
        </div>
        <div v-else>
          <el-tag
            v-for="(tag, index) in scope.row.meal"
            :key="'foodTag' + index"
            :closable="!hideTagsClose"
            type="success"
            effect="dark"
            class="tag"
            @close="removeFoodFromMeal(tag, index)"
            :disable-transitions="true"
          >
            {{ tag.name }}({{ tag.weight }}g)
          </el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column v-if="!hideEdit" width="80" label="操作" align="center">
      <template v-slot="scope">
        <div class="flex justify_center">
          <icon-box icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;" title="编辑"
                    @click.native="editMealClick(scope.row)"></icon-box>
        </div>
      </template>
    </el-table-column>
  </m-view-table>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('RecipeTable', true)

export default {
  name: 'RecipeTable',
  inject: ['rdata', 'active'],
  props: {
    height: {
      type: [Number, String],
      default: '353'
    },
    hideEdit: Boolean,
    hideTagsClose: Boolean,
  },
  data() {
    return {}
  },
  methods: {
    removeFoodFromMeal(food, index) {
      const currPane = this.recipeData.find(item => item.period === food.meal)
      currPane.meal.splice(index, 1)
    },
    editMealClick(row) {
      this.$emit('edit-meal', row)
    },
  }, // methods end
  computed: {
    recipeData() {
      return this.rdata()
    },
  },
}
</script>

<style scoped lang="less">
.tag {
  border: 1px solid #D9E1EC !important;
  background-color: #fff !important;
  border-radius: 13px !important;
  color: @textColor;
  box-sizing: border-box;
  height: 28px !important;
  line-height: 28px !important;
  margin: 5px;
  cursor: default;

  :deep(.el-tag__close) {
    position: relative;
    top: -2px;
    background: @bgColor;
    background: @colorIronBlue;

    &:hover {
      background: @colorIronBlue;
      color: #fff;
    }
  }
}
</style>
