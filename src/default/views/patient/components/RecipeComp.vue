<template>
  <el-dialog
    title="添加饮食记录"
    :visible.sync="dialogVisible"
    :modal="true"
    class="dialog"
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
              <div v-else class="food-item">
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
                v-for="food in foods"
                :key="food.id"
                v-show="food.category.id === cate.id"
              >
                <div class="name">
                  {{ food.name }}
                </div>
                <m-button @click="addFoodToMeal(food)" w="54px" h="28px" plain class="p_0 right mr_20">添加</m-button>
              </div>
              <div class="pl_10">暂无更多</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="box-right">
        <el-tabs v-model="periodActive">
          <el-tab-pane
            v-for="pane in recipeData"
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
                height="352"
                :page-sizes="[10, 15, 20]"
                hide-pagination
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
                    <el-input  v-model.number="scope.row.weight" oninput="value=value.replace(/[^0-9]/g,'')" style="width: 100px; margin-right: 5px;"></el-input>
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
        <m-button type="default" @click="closeDialog" w="80px">取 消</m-button>
        <m-button @click="dialogVisible=false" w="80px">确 定</m-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RecipeComp',
  data() {
    return {
      dialogVisible: false,
      recipeData: [
        {
          title: '早餐',
          period: 'breakfast',
          meal: [],
        },
        {
          title: '早加餐',
          period: 'mid_moor',
          meal: [],
        },
        {
          title: '午餐',
          period: 'lunch',
          meal: [],
        },
        {
          title: '午加餐',
          period: 'mid_afternoon',
          meal: [],
        },
        {
          title: '晚餐',
          period: 'dinner',
          meal: [],
        },
        {
          title: '晚加餐',
          period: 'late_night',
          meal: [],
        },
      ],
      foodCategory: [],
      searchText: '',
      categoryActive: '',
      periodActive: 'breakfast',
      foods: []

    }
  },
  watch: {
    periodActive(n) {
      this.currPane = this.recipeData.find(item => item.period === n)
    }
  },
  mounted() {
    this.getCategoryList()
    this.getFoodList()
  },
  methods: {
    getCategoryList() {
      this.$api.foodCategories.getList({}).then((res) => {
        this.foodCategory = res.data.results
      })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getFoodList() {
      this.$api.food.getList({
        page: 1,
        page_size: 10000,
        // category_id: cateId
      }).then((res) => {
        this.foods = res.data.results
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
      if(queryString === undefined) {
        this.searchText = ''
        cb([])
        return
      }
      if (queryString === '') {
        cb([])
        return
      }
      this.$api.food.getList({
        page: 1,
        page_size: 10000,
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
      if(val.tips) {
        this.searchText = ''
      } else {
        this.addFoodToMeal(val)
      }
    },
    categoryChange(active) {
    },
  }, // methods end
}
</script>

<style scoped>

</style>
