<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'NutritionalPrescription'}">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>营养处方</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>处方详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
        <div class="info-top">
          <div>
            <div>
              <p>性别</p>
              <p>{{ nutritionalPrescription.sex == 'N/A' ? '全部' : nutritionalPrescription.sex }}</p>
            </div>
            <div>
              <p>年龄</p>
              <p>{{ nutritionalPrescription.age_set }}</p>
            </div>
            <div>
              <p>BMI</p>
              <p>{{ nutritionalPrescription.bmi }}</p>
            </div>
            <div>
              <p>血压</p>
              <p>{{ nutritionalPrescription.blood_pressure }}</p>
            </div>
            <div>
              <p>血糖</p>
              <p>{{ nutritionalPrescription.blood_sugar }}</p>
            </div>
            <div>
              <p>血脂</p>
              <p>{{ nutritionalPrescription.blood_fat }}</p>
            </div>
            <div>
              <p>Pal</p>
              <p>{{ nutritionalPrescription.pal }}</p>
            </div>
          </div>
          <m-button plain @click="$router.go(-1)">返回</m-button>
        </div>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="食材明细" name="1">
                <m-table
                  hidePagination
                  class="m-table"
                  ref="table"
                  :data="foods"
                  :height="'calc(100vh - 340px)'"
                  :get-data-func="getNutritionFoods"
                >
                  <el-table-column
                    show-overflow-tooltip
                    prop="foodtypename"
                    label="1000kcal"
                    min-width="80"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    prop="foodWeights"
                    label="总量（g）"
                    min-width="80"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    v-for="(item, index) in this.mealType" 
                    :key="index"
                    show-overflow-tooltip
                    :prop="item.name"
                    :label="item.label + '（g）'"
                    align="center"
                    min-width="150"
                  >
                    <template v-slot="scope">
                      <span>{{ getMealDetail(scope.row, item.name) }}</span>
                    </template>
                  </el-table-column>
                </m-table>
              </el-tab-pane>
              <el-tab-pane label="菜品明细" name="2">
                <div style="height: calc(100vh - 340px); overflow: scroll;">
                  <!-- <m-button icon="el-icon-plus" @click="toSetPage('create')">添加</m-button> -->
                  <div>
                    <div v-for="meal in dishes" :key="meal.id">
                      <div>
                        <p style="font-size: 14px; font-weight: 700">{{ meal.name }}</p>
                        <div v-if="meal.dishes.length != 0">
                           <m-table
                            hidePagination
                            hideLoading
                            class="m-table"
                            :data="meal.dishes"
                          >
                            <!-- <el-table-column
                              show-overflow-tooltip
                              prop="category"
                              label="菜品分类"
                              min-width="80"
                              align="center"
                            >
                              <template v-slot="scope">
                                <span v-if="scope.row.category">{{ scope.row.category.name }}</span>
                              </template>
                            </el-table-column> -->
                            <el-table-column
                              show-overflow-tooltip
                              prop="name"
                              label="菜品名称"
                              min-width="80"
                              align="center"
                            >
                            </el-table-column>
                            <el-table-column
                              show-overflow-tooltip
                              prop="image"
                              label="图片"
                              min-width="80"
                              align="center"
                            >
                              <template v-slot="scope">
                                <el-image
                                  :src="scope.row.image"
                                  style="width: auto; height: 60px;"
                                  fit="cover"
                                  :preview-src-list="[scope.row.image]"
                                ></el-image>
                              </template>
                            </el-table-column>
                            <el-table-column
                              show-overflow-tooltip
                              prop="dishes_weight"
                              label="重量（克/毫升）"
                              min-width="80"
                              align="center"
                            >
                            </el-table-column>
                            <el-table-column
                              show-overflow-tooltip
                              prop="hot"
                              label="热量（千卡）"
                              min-width="80"
                              align="center"
                            >
                            </el-table-column>
                            <!-- <el-table-column label="操作" align="center" min-width="60">
                              <template v-slot="scope">
                                <div class="flex justify_center">
                                  <el-link @click.native="deleteClick(scope.row)">删除</el-link>
                                </div>
                              </template>
                            </el-table-column> -->
                          </m-table>
                        </div>
                        <p v-else style="font-size: 14px; font-weight: 400; margin-left: 30px">暂无</p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
          </el-tabs>
        </template>
      </div>

        <!-- dishes_weight: '',
        meal_type_id: '',
        dishes_id: '' -->
    <el-dialog
      title="添加菜品"
      :visible.sync="dialogVisible"
      :modal="true"
      class="calc-dialog"
    >
      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="dishForm"
        label-width="100"
        label-position="left"
      >
        <el-form-item label=" 餐类型 " prop="meal_type_id" class="mt_20">
          <el-select
            v-model="form.meal_type_id"
            placeholder="请选择"
            clearable
            style="width: 320px;"
          >
            <el-option
              v-for="statu in mealType"
              :key="statu.code"
              :label="statu.label"
              :value="statu.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 菜品名称 " prop="dishes_id" class="mt_20">
          <el-select
            v-model="form.category_id"
            placeholder="菜品分类"
            clearable
            style="width: 160px;"
          >
            <el-option
              v-for="statu in dishesCategories"
              :key="statu.id"
              :label="statu.name"
              :value="statu.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.dishes_id"
            placeholder="菜品名称"
            clearable
            style="width: 160px;"
          >
            <el-option
              v-for="statu in selectDishes"
              :key="statu.id"
              :label="statu.name"
              :value="statu.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 摄入重量 " prop="dishes_weight" class="mt_20">
          <el-input v-model="form.dishes_weight" type="text" placeholder="请输入需要摄入的重量"
                    class=""
                    style="width: 250px;">
          </el-input>
          克/毫升
        </el-form-item>
        <el-form-item label=" 摄入热量 " prop="hot" class="mt_20">
          <el-input disabled v-model="form.hot" type="text" placeholder="摄入重量*每百克所含热量"
                    class=""
                    style="width: 250px;">
          </el-input>
          千卡
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false" w="80px">取 消</m-button>
        <m-button w="80px" @click="save">保 存</m-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
const localSession = new LocalStore('NutritionalPrescriptionDetail', true)

export default {
  name: 'NutritionalPrescriptionDetail',
  components: {
  },
  watch: {
    'form.category_id'(n) {
      this.form.dishes_id = ''
      if (n) {
        this.getDishes()
      } else {
        this.selectDishes = []
      }
    },
    'form.dishes_weight'(n) {
      if (this.form.dishes_id) {
        if (this.form.dishes_weight) {
          const dishes = this.selectDishes.find(ele => ele.id == this.form.dishes_id)
          if (dishes) {
            this.form.hot = (parseFloat(this.form.dishes_weight) * parseFloat(dishes.calories)) / 100
          } else {
            this.form.hot = ''
          }
        } else {
          this.form.hot = ''
        }
      } else {
        this.form.hot = ''
      }
    }
  },
  computed: {
    foods() {
      let food = []
      if (this.nutritionFoods) {
        this.nutritionFoods.forEach(ele => {
          const category = food.find(item => item.foodtypeid == ele.food.food_one_type_name)
          if (category) {
            this.mealType.forEach(item => {
              if (item.code == ele.meal_type.id) {
                category[item.name].foods.push({ foodid: ele.food.foodid, foodname: ele.food.foodcommonname, weight: ele.food_weight })
                category.foodWeights += ele.food_weight
              }
            })
          } else {
            const categoryItem = { foodtypeid: ele.food.food_one_type_name, foodtypename: ele.food.food_one_type_name, foodWeights: 0 }
            this.mealType.forEach(item => {
              categoryItem[item.name] = {
                foods: [],
                id: item.code,
                name: item.name,
              }
              if (item.code == ele.meal_type.id) {
                categoryItem[item.name].foods.push({ foodid: ele.food.foodid, foodname: ele.food.foodcommonname, weight: ele.food_weight })
                categoryItem.foodWeights += ele.food_weight
              }
            })
            food.push(categoryItem)
          }
        })
      }

      return food
    },
    dishes() {
      let dish = {}
      this.mealType.forEach(ele => {
        dish[ele.name] = {
          id: ele.code,
          name: ele.label,
          dishes: []
        }
      })
      this.nutritionDishes.forEach(ele => {
        for (const key in dish) {
            const element = dish[key];
            if (element.name == ele.meal_type) {
              element.dishes.push({
                dishes_weight: ele.weight,
                hot: ele.calories,
                dish_id: ele.id,
                name: ele.name,
                image: ele.image
              })
            }
        }
      })
      return dish
    }
  },
  data() {
    return {
      activeName: '1',
      form: {
        dishes_weight: '',
        meal_type_id: '',
        dishes_id: '',
        category_id: '',
        hot: '',
      },
      nutritionalPrescription: {

      },
      rules: {
        dishes_id: [{ required: true, message: '请选择菜品名称', trigger: 'change' }],
        meal_type_id: [{ required: true, message: '请选择餐类型', trigger: 'change' }],
        dishes_weight: [{ required: true, message: '请输入摄入重量', trigger: 'change' }],
      },
      mealType: [],
      dialogVisible: false,
      nutritionFoods: [],
      nutritionFoodsTotal: 0,
      nutritionDishes: [],
      nutritionDishesTotal: 0,

      dishesCategories: [],
      dishesCategoriesTotal: 0,
      dishesCategoriesPage: 1,
      dishesCategoriesPageSize: 9999,

      selectDishes: [],
      dishesTotal: 0,
      dishesPage: 1,
      dishesPageSize: 9999,
    }
  },
  mounted() {
    this.initForm()
    this.getMealType()
    this.getNutritionFoods()
    this.getNutritionDishes()
    // this.getDishesCategories()
  },
  methods: {
    getDishesCategories() {
      this.$api.dishesCategories.getList({
        page: this.dishesCategoriesPage,
        page_size: this.dishesCategoriesPageSize,
      })
        .then((res) => {
          this.dishesCategories = res.data.results
          this.dishesCategoriesTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getDishes() {
      this.$api.dishes.getList({
        page: this.dishesPage,
        page_size: this.dishesPageSize,
        ordering: 'id',
        category_id: this.form.category_id,
      })
        .then((res) => {
          this.selectDishes = res.data.results
          this.dishesTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getMealDetail(row, name) {
      return row[name].foods.map(ele => ele.foodname + '：' + ele.weight).join(',')
    },
    getNutritionFoods() {
      this.$refs.table.loadStart()
      this.$api.nutritionFoods.getList({
        page: 1,
        page_size: 9999,
        ordering: 'id',
        nutrition_id: this.nutritionalPrescription.nutrition_id
      })
        .then((res) => {
          this.$refs.table.loadDone()
          this.nutritionFoods = res.data.results
          this.nutritionFoodsTotal = res.data.count
        })
        .catch((err) => {
          this.$refs.table.loadDone()
          this.$message.error(JSON.stringify(err))
        })
    },

    getNutritionDishes() {
      this.$api.nutrition.getNutritionDishes({
        nutrition_id: this.nutritionalPrescription.nutrition_id
      }).then((res) => {
          this.nutritionDishes = res.data
          this.nutritionDishesTotal = res.data.length
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
      // this.$api.nutritionDishes.getList({
      //   page: 1,
      //   page_size: 9999,
      //   ordering: 'id',
      //   nutrition_id: this.nutritionalPrescription.nutrition_id
      // })
      //   .then((res) => {
      //     this.nutritionDishes = res.data.results
      //     this.nutritionDishesTotal = res.data.count
      //   })
      //   .catch((err) => {
      //     this.$message.error(JSON.stringify(err))
      //   })
    },

    getMealType() {
      this.mealType = this.$dict.nutritionalBloodMealType.data
    },
    handleClick(tab, event) {
        
    },
    initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', params)
      }
      this.nutritionalPrescription = data
    },
    save() {
      this.$refs['dishForm'].validate((valid) => {
        if (valid) {
            this.create()
        } else {
          return false
        }
      })
    },
    create() {
      const params = { ...this.form, }
      params.nutrition_id = this.nutritionalPrescription.id
      this.$api.nutritionDishes.create(params)
        .then(res => {
          this.$message.success('新增菜品成功')
          this.dialogVisible = false
          this.getNutritionDishes()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map(item => item.detail).join('')))
          } else {
            this.$message.error(JSON.stringify(err.detail))
          }
        })
    },
    leavePage() {
      this.$router.go(-1)
    },
    toSetPage() {
      this.form = {
        dishes_weight: '',
        meal_type_id: '',
        dishes_id: '',
        category_id: '',
        hot: '',
      },
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dishForm'].clearValidate()
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除菜品吗？`, '删除菜品', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$api.nutritionDishes.delete(row.dish_id)
          .then(res => {
            this.$message.success('删除成功')
            this.getNutritionDishes()
          })
          .catch((err) => {
            if (err.code === 'protected_error') {
              this.$message.error('删除失败，账号受到保护，无法删除')
            } else {
              this.$message.error(JSON.stringify(err))
            }
          })
      })
    }

  }, // methods end
}
</script>

<style scoped lang="less">

.m-table {
  height: calc(100% - 50px);
}

.calc-dialog {
  :deep(.el-dialog) {
    height: 450px;

    .el-form-item__label {
      width: 80px;
    }
  }
}

.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);
    padding-top: 20px;

    .info-top {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      div {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 30px;

        p {
          font-size: 14px;
        }
      }

      div p:first-child {
        font-weight: 700;
      }

      div p:last-child {
        margin-left: 10px;
      }
    }

    :deep(.el-tabs__content) {
      height: calc(100vh - 340px);
    }
  }
}

.form-box {
  width: 100%;

    .add-image-content {

      display: flex;
      flex-direction: row;
      align-items: center;

      .add-image {
          width: 450px; 
          height: 48px; 
          border: 1px solid #D9E1EC !important; 
          border-radius: 12px !important;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-left: 12px;


          
          // .el-button {
          //     background: ;
          // }

      }

      .add-image-select {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .add-image-delete {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffffff;
      }

    }



  //.el-form-item {
  //  width: 100%;
  //  .el-input {
  //    width: 100%;
  //  }
  //  .el-select {
  //    width: 100%;
  //  }
  //}
}

.upload-box {
  height: 150px;
  width: 150px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }
}


.roles-select {
  :deep(.el-input__suffix) {
    display: none;
  }
}

.role-editor {
  :deep(.el-select.roles-select) {
    width: 450px !important;
    .el-select__tags {
      max-width: unset !important;
    }
  }
}

.close-btn {
  display: none;
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 11;
  cursor: pointer;
  font-weight: bold;
  padding: 4px;
  color: #fff;
  background-color: #000;
  opacity: .3;
  border-radius: 50%;
  font-size: 12px;
}

.image-wrapper:hover .close-btn {
  //visibility: visible;
  display: block;
}

</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
