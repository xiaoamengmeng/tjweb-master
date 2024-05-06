<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/recipe_library'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>食谱库</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" v-loading="loading">

      <div class="card-title">
        {{ title }}
      </div>

      <el-form
        class="show-calorie mb_4"
        ref="searchForm"
        label-position="top"
        @submit.native.prevent
      >
        <div class="search-bar mt_20">
          <el-row class="search-bar-row" type="flex" justify="start" align="middle" style="width: 100%; height: 100%">
            <el-col class="search-bar-col" style="width: 360px; padding-left: 0;">
              <el-row class="label-t" style="margin-bottom: 20px;">食谱名称</el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    v-model="form.name"
                    placeholder="请输入食谱名称"
                    clearable
                    style="width: 320px; margin-right: 20px; position: relative; top: -5px;"
                    :readonly="type === 'view'"
                  ></el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col class="search-bar-col" style="width: 180px;">
              <el-row class="label-t">累计总热量</el-row>
              <el-row>
                <icon-box class="icon" icon-name="calorie" w="26" h="33" box-w="26" box-h="33"></icon-box>
                <span class="value">{{ caloriesSum }}</span>
                <span class="unit">千卡</span>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-form>


      <el-form
        class="form-box mb_20"
        ref="searchForm"
        label-position="top"
        @submit.native.prevent
        v-if="type !== 'view'"
      >
        <div class="search-bar">
          <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                  :gutter="10" style="width: 100%; height: 100%">
            <el-col class="search-bar-col" :span="24">
              <el-row class="label-t">选择天数</el-row>
              <el-row>
                <el-form-item style="width: 200px; display: inline-block; margin-right: 10px;" prop="stage">
                  <el-select
                    v-model="recipeIndex"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(_, index) in recipeList.length"
                      :key="index"
                      :label="'第' + $numToCN(index + 1) +'天'"
                      :value="index"
                    >
                      <span class="left">{{ '第' + $numToCN(index + 1) + '天' }}</span>
                      <m-button v-if="recipeList.length !== 1" plain type="danger" w="54px" h="28px"
                                class="right p_0 mt_2"
                                @click.stop="removeRecipe(index)">
                        删除
                      </m-button>
                    </el-option>
                  </el-select>
                </el-form-item>
                <m-button w="120px" h="40px" class="mr_20" @click="addRecipe">新 增</m-button>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <template v-if="type !== 'view' && recipeList.length > 0">
        <div class="show-day clearfix">
          <span class="title">{{ '第' + $numToCN(recipeIndex + 1) + '天' }}</span>
          <icon-box class="icon" icon-name="calorie" :w="52 / 4" :h="66 / 4" box-w="26" box-h="28"></icon-box>
          <span class="value">{{ dailyCalorie }}</span><span class="unit">千卡</span>
        </div>

        <div class="rte-box">
          <recipe-table-editor
            ref="rte"
            v-model="recipeList[recipeIndex]"
          ></recipe-table-editor>
        </div>
      </template>
      <template v-if="type === 'view' && recipeList.length > 0">
        <div v-for="(recipe, index) in recipeList">
          <div class="show-day clearfix mt_20">
            <span class="title">{{ '第' + $numToCN(index + 1) + '天' }}</span>
            <icon-box class="icon" icon-name="calorie" :w="52 / 4" :h="66 / 4" box-w="26" box-h="28"></icon-box>
            <span class="value">{{ calcDailyCalorie(recipe) }}</span><span class="unit">千卡</span>
          </div>

          <div class="rte-box">
            <recipe-table-editor
              :key="recipe.id"
              v-model="recipeList[index]"
              hide-edit
              hide-tags-close
            ></recipe-table-editor>
          </div>
        </div>
      </template>
      <div class="mt_20">
        <m-button v-if="type !== 'view'" @click="save" :loading="btnLoading">保存</m-button>
        <m-button plain @click="$router.go(-1)">返回</m-button>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import RecipeTableEditor from '@/common/components/RecipeTableEditor'
import {
  buildFoods,
  buildRecipeData,
  defaultRecipeData,
  recipeIsEmpty
} from '@/common/components/RecipeTableEditor/utils'

const localSession = new LocalStore('SetRecipe', true)

export default {
  name: 'SetRecipe',
  components: { RecipeTableEditor },
  data() {
    return {
      type: 'create',
      title: '添加食谱',
      form: {
        name: '',
        calories: 0,
      },
      recipeList: [],
      recipeIndex: 0,
      rules: {},
      recipeId: '',
      loading: true,
      btnLoading: false,
      menus: [],
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      const params = this.$route.params

      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', { type: params.type, id: params.id, menu_count: params.menu_count })
      }

      this.type = data.type
      if (this.type === 'create') {
        this.title = '创建食谱'
        this.loading = false
      } else if (this.type === 'edit') {
        this.title = '编辑食谱'
      } else if (this.type === 'view') {
        this.title = '食谱详情'
      }

      this.recipeId = data.id

      for (let i = 0; i < data.menu_count; i++) {
        this.recipeList.push(defaultRecipeData())
      }

      if (this.type === 'create') {
        this.recipeList.push(defaultRecipeData())
      } else {
        this.$api.mealPlans.getDetail(this.recipeId)
          .then((res) => {
            this.form.name = res.data.name
            const menus = res.data.menus.sort((a, b) => a.day - b.day)
            this.recipeList = menus.map((menu) => buildRecipeData(menu))
          })
          .catch((err) => {
            this.$message.error(err.detail)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    addRecipe() {
      this.recipeList.push(defaultRecipeData())
      this.recipeIndex = this.recipeList.length - 1
    },
    removeRecipe(index) {
      this.recipeList.splice(index, 1)
      const len = this.recipeList.length
      if (index < len) {
        this.recipeIndex = index
      } else {
        this.recipeIndex = index - 1
      }
    },
    save() {
      if (this.form.name === '') {
        return this.$message.error('请输入食谱名称')
      }

      for (let i = 0; i < this.recipeList.length; i++) {
        const item = this.recipeList[i]
        if (recipeIsEmpty(item)) {
          return this.$message.error(`第${this.$numToCN(i + 1)}天的食物为空，请添加食物后再保存`)
        }
      }

      if (this.type === 'create') {
        this.create()
      } else {
        this.update()
      }
    },
    create() {
      this.btnLoading = true
      const params = {
        name: this.form.name,
        menus: []
      }
      params.menus = this.recipeList.map((item, index) => {
        return {
          day: index + 1,
          foods: buildFoods(item)
        }
      })
      this.$api.mealPlans.create(params)
        .then((mealRes) => {
          this.$message.success('新增食谱成功')
          this.$router.push({
            name: 'RecipeLibrary',
            query: {
              views: 0,
            }
          })
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    update() {
      this.btnLoading = true

      const params = {
        name: this.form.name,
        menus: []
      }
      params.menus = this.recipeList.map((item, index) => {
        return {
          day: index + 1,
          foods: buildFoods(item)
        }
      })
      this.$api.mealPlans.patch(this.recipeId, params)
        .then((res) => {
          this.$message.success('保存成功')
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    leavePage() {
      this.$router.go(-1)
    },
    calcDailyCalorie(recipeData) {
      let sum = 0
      recipeData.forEach((item) => {
        item.meal.forEach((food) => {
          sum += Math.round(food.weight / 100 * food.calories)
        })
      })
      return sum
    },
  }, // methods end
  computed: {
    caloriesSum() {
      let sum = 0
      this.recipeList.forEach((recipe) => {
        recipe.forEach(food => {
          food.meal.forEach((food) => {
            sum += Math.round(food.weight / 100 * food.calories)
          })
        })
      })
      return sum
    },
    currentRecipeData() {
      return this.recipeList[this.recipeIndex]
    },
    dailyCalorie() {
      let sum = 0
      this.currentRecipeData.forEach((item) => {
        item.meal.forEach((food) => {
          sum += Math.round(food.weight / 100 * food.calories)
        })
      })
      return sum
    },
  },
}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    //height: calc(100vh - 32px - 32px - 48px);
    min-height: calc(100% - 90px - 96px);
  }
}

.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
  }
}

.show-day {
  .title {
    float: left;
    font-size: 20px;
    font-weight: 500;
    color: #344563;
    margin: 0 10px 10px 0;
  }

  .value {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    margin-left: 2px;
    margin-right: 2px;
  }

  .unit {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    color: #333333;
  }
}

.show-calorie {
  .el-form-item {
    .el-input {
      :deep(.el-input__inner[readonly]) {
        background-color: #f1f1f1 !important;
        cursor: no-drop;
      }
    }
  }

  .search-bar {
    background-color: unset;
    padding-left: 0;
    border: unset;

    .label-t {
      font-size: 14px;
      font-weight: 500;
      color: #3A3A54;
    }
  }

  .icon {
    position: relative;
    top: 8px;
  }

  .value {
    font-size: 36px;
    font-weight: bold;
    color: #333333;
    margin-left: 4px;
    margin-right: 4px;
  }

  .unit {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
  }
}

.rte-box {
  //width: 850px;
}
</style>
