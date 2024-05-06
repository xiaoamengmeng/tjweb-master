<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="dialog"
    @close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="food-edit-box">
      <div class="box-left">
        <div class="search-input">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="searchText"
            :fetch-suggestions="querySearch"
            placeholder="输入食物名称查询"
            style="width: 240px;"
            @select="handleSelect"
          >
            <i
              class="el-icon-search el-input__icon"
              slot="suffix">
            </i>
            <template slot-scope="{ item }">
              <div v-if="item.tips" style="padding-left: 20px;">暂无</div>
              <div v-else-if="item.empty" style="padding-left: 20px;"></div>
              <div v-else class="food-item" :title="item.name">
                <div class="name">
                  {{ item.name }}
                </div>
                <m-button @click="addFoodToMeal(item)" w="54px" h="28px" plain class="p_0 right mr_20">添加</m-button>
              </div>
            </template>
          </el-autocomplete>
        </div>
        <div class="category">
          <el-collapse
            v-model="categoryActive"
            @change="categoryChange"
            accordion
          >
            <el-collapse-item
              v-for="cate in foodCategory"
              :key="cate.id"
              :title="cate.name"
              :name="cate.id"
            >
              <div
                class="food-item"
                v-if="foods.length === 0"
              >
                <i class="el-icon-loading"></i>
              </div>
              <div
                class="food-item"
                v-else-if="foods[0] && foods[0].tips"
                style="padding-left: 20px;"
              >
                {{ foods[0].tips }}
              </div>
              <div
                v-else
                class="food-item"
                v-for="food in foods"
                :key="food.id"
              >
                <div class="name">
                  {{ food.name }}
                </div>
                <m-button @click="addFoodToMeal(food)" w="54px" h="28px" plain class="p_0 right mr_20">添加</m-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="box-right">
        <el-tabs v-model="periodActive">
          <el-tab-pane
            v-for="pane in displayMealPanel"
            :key="pane.period"
            :label="pane.title"
            :name="pane.period"
          >
            <div class="meal-content">
              <div class="meal-tips">已添加菜品{{ pane.meal.length }}个</div>
              <m-view-table
                class="food-table"
                :data="pane.meal"
                :total="1"
                height="353"
                :page-sizes="[10, 15, 20]"
                hide-pagination
                hide-loading
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="name"
                  label="菜品名称"
                  min-width="120"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="weight"
                  label="重量"
                >
                  <template v-slot="scope">
                    <el-input :min="0" class="food-weight-input" :step="50" type="number"
                              v-model.number="scope.row.weight" oninput="value=value.replace(/[^0-9]/g,'')"
                              style="width: 100px; margin-right: 5px;"></el-input>
                    克
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template v-slot="scope">
                    <m-button type="danger" w="54px" h="32px" class="p_0"
                              @click="removeFoodFromMeal(scope.row, scope.$index)">
                      删除
                    </m-button>
                  </template>
                </el-table-column>
              </m-view-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="cancelEdit" w="80px">取 消</m-button>
        <m-button @click="save" w="80px">确 定</m-button>
      </span>
  </el-dialog>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { defaultRecipeData } from '@/common/components/RecipeTableEditor/utils'

const localSession = new LocalStore('setRecipe', true)

export default {
  name: 'RecipeEditor',
  props: {
    visible: false,
    data: {
      type: Array,
      required: true,
    },
    active: {
      type: String,
      required: true
    },
    // 只为单个餐段添加饮食，启用此模式时，以active的值为要编辑的餐段
    singleMeadMode: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '添加饮食记录'
    }
  },
  data() {
    return {
      dialogVisible: false,
      recipeData: [],
      recipeDataClone: [],
      foodCategory: [],
      foods: [],
      periodActive: 'breakfast',
      categoryActive: '',
      searchText: '',
      currPane: {},

      recipeId: '',
    }
  },
  watch: {
    visible(n) {
      this.dialogVisible = n
      if (n) {
        this.getCategoryList()
        this.$nextTick(() => {
          this.periodActive = this.active
          this.currPane = this.recipeData.find(item => item.period === this.active)
          this.$emit('update:data', this.recipeData)
          this.recipeDataClone = this.$clone(this.recipeData)
        })
      } else {
        this.categoryActive = ''
        this.foods = []
      }
    },
    periodActive(n) {
      this.currPane = this.recipeData.find(item => item.period === n)
      this.$emit('update:active', n)
    },
    data(n) {
      if (n && n.length === 0) return
      this.recipeData = n
    },
    recipeData(data) {
      this.$emit('update:data', data)
    },
  },
  created() {
    this.recipeData = defaultRecipeData()
  },
  mounted() {
    this.$emit('update:data', this.recipeData)
  },
  methods: {
    resetData() {
      this.recipeData = Object.assign(this.$data.recipeData, this.$options.data().recipeData)
      this.$emit('update:data', this.recipeData)
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    },
    cancelEdit() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
      this.recipeData = this.recipeDataClone
    },
    save() {
      this.$emit('save', this.recipeData)
      this.$emit('update:data', this.recipeData)
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    },
    getCategoryList() {
      this.$api.foodCategories.getList({}).then((res) => {
        this.foodCategory = res.data.results
      })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    categoryChange(active) {
      if (active === '') return
      this.foods = []
      this.getFoodList(active)
    },
    getFoodList(category_id) {
      this.$api.food.getList({
        page: 1,
        page_size: 10,
        category_id: category_id,
        // category_id: cateId
      }).then((res) => {
        const foods = res.data.results
        if (res.data.count === 0) {
          this.foods = [{ tips: '暂无' }]
        } else {
          this.foods = foods
        }
      }).catch((err) => {
        this.$message.error(JSON.stringify(err))
      })
    },
    addFoodToMeal(food) {
      if (this.currPane.meal.some(item => item.food_id === food.id)) {
        // 重复添加
        return
      }
      this.currPane.meal.push({
        name: food.name,
        food_id: food.id,
        food: food,
        calories: food.calories,
        weight: 100,
        meal: this.currPane.period
      })
    },
    removeFoodFromMeal(food, index) {
      const currPane = this.recipeData.find(item => item.period === food.meal)
      currPane.meal.splice(index, 1)
    },
    querySearch(queryString, cb) {
      if (queryString === undefined) {
        this.searchText = ''
        cb([])
        return
      }
      if (queryString === '' || queryString.trim() === '') {
        cb([])
        return
      }
      this.$api.food.getList({
        page: 1,
        page_size: 9999,
        search: queryString,
        // category_id: cateId
      }).then((res) => {
        if (res.data.results.length === 0) {
          cb([{ tips: true }])
        } else {
          cb(res.data.results)
        }
      }).catch((err) => {
        this.$message.error(JSON.stringify(err))
      })
    },
    handleSelect(val) {
      if (val.tips) {
        this.searchText = ''
      } else {
        this.addFoodToMeal(val)
      }
    }
  }, // methods end
  computed: {
    displayMealPanel() {
      if (this.singleMeadMode) {
        return this.recipeData.filter(item => item.period === this.periodActive)
      } else {
        return this.recipeData
      }
    },
  },
}
</script>

<style scoped lang="less">
.dialog {
  :deep(.el-dialog) {
    width: 900px;
    height: 650px;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
    }
  }
}

.food-edit-box {
  height: 100%;
  display: flex;

  .box-left {
    width: 240px;
    height: 100%;

    .search-input {
      :deep(.el-input__inner) {
        border-radius: 20px;
      }

      margin-bottom: 5px;
    }

    .category {
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100% - 40px - 5px);

      .el-collapse {
        :deep(.el-collapse-item__header) {
          box-sizing: border-box;
          height: 40px;
          line-height: 40px;
        }

        :deep(.el-collapse-item__content) {
          //height: 32px;
          //line-height: 32px;
          margin: 0;
          padding: 0;
        }


      }
    }
  }

  .box-right {
    width: 100%;
    flex: 1;
    margin-left: 10px;

    .el-tabs {
      height: 100%;

      :deep(.el-tabs__content) {
        height: calc(100% - 55px);
      }

      .meal-content {
        .meal-tips {
          color: #5A6D86;
          line-height: 32px;
          height: 32px;
          margin-bottom: 10px;
          font-size: 15px;
          font-weight: bold;
        }

        .food-table {
          width: calc(100% - 16px);
        }
      }
    }
  }
}

.food-item {
  position: relative;
  height: 32px;
  line-height: 32px;
  overflow: hidden;

  &:hover {
    background-color: #f4f5fa;
  }

  .name {
    width: 140px;
    height: inherit;
    line-height: inherit;
    .text-ellipsis();
  }

  .m-button {
    position: absolute;
    margin-right: 0;
    top: 2px;
    right: 10px;
  }
}

.food-weight-input {
  :deep(.el-input__inner) {
    padding-right: 0;
  }
}

</style>
<style>
.el-autocomplete-suggestion li {
  padding: 0;
}
</style>
