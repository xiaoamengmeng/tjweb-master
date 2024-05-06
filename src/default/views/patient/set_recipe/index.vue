<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/patient'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: `/patient_detail/${ppid}?views=3`}">
        <b>患者详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>配置营养餐</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card" v-loading="loading">
      <div class="card-title">
        配置营养餐
        <m-button class="history-btn" plain @click="toHistoryPage">历史配餐</m-button>
      </div>

      <div class="patient-info">
        <div class="base">
          <div class="avatar">
            <el-avatar fit="cover" :size="62" :src="ppInfo.patient.avatar_url"></el-avatar>
          </div>
          <div class="name">{{ ppInfo.patient.name }}</div>
          <div class="sex">
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.M"
              icon-name="sex_male" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.F"
              icon-name="sex_female" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
          </div>
          <div class="tag age">{{ ppInfo.patient.user_profile.birthday | calcAge }}岁</div>
          <div v-if="ppInfo.stage" class="tag stage">{{ ppInfo.stage }}</div>
          <div class="tag id">No.{{ ppInfo.patient.user_id }}</div>
        </div>
        <div class="base2">
          <div class="item">手机号：{{ ppInfo.patient.phone_number }}</div>
          <div class="item">身份证：{{ ppInfo.patient.id_number }}</div>
          <div class="item">出生日期：{{ ppInfo.patient.user_profile.birthday | dateFormatCN }}</div>
        </div>
        <div class="tags">
          <span>患者标签：</span>
          <span v-if="ppInfo.patient.tags && ppInfo.patient.tags.length === 0">暂无</span>
          <template v-else>
          <span
            class="tag mr_8"
            v-for="tag in ppInfo.patient.tags"
            :key="tag.id"
          >#{{ tag.name }}</span>
          </template>
        </div>
        <div class="set-position">
          <div class="recommend-recipe">
            <div class="bg"></div>
            <el-select
              v-model="recipeSelect"
              placeholder="不使用模板"
              clearable
              @change="usingRecipeLibrary"
            >
              <template slot="prefix">
                <icon-box icon-name="lj_ysdk" w="31" h="33" box-w="31" box-h="40"></icon-box>
              </template>
              <el-option
                v-for="(item, index) in recipeLibrary"
                :key="item.id"
                :value="item.id"
                :label="`引用【${item.name}】`"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>

      <el-form
        class="show-calorie mb_20"
        ref="searchForm"
        label-position="top"
        @submit.native.prevent
      >
        <div class="search-bar mt_20">
          <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                  style="width: 100%; height: 100%">
            <el-col class="search-bar-col" style="width: 240px;">
              <el-row class="label-t">累计总热量</el-row>
              <el-row>
                <icon-box class="icon" icon-name="calorie" w="26" h="33" box-w="26" box-h="33"></icon-box>
                <span class="value">{{ caloriesSum }}</span>
                <span class="unit">千卡</span>
              </el-row>
            </el-col>
            <el-col class="search-bar-col">
              <el-row class="label-t ml_10" style="margin-bottom: 20px;">食谱名称</el-row>
              <el-row>
                <el-form-item>
                  <el-input
                    v-model="form.name"
                    placeholder="请输入食谱名称"
                    clearable
                    style="width: 320px; margin-left: 10px; margin-right: 20px; position: relative; top: -5px;"
                  ></el-input>
                </el-form-item>
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
      >
        <div class="search-bar mt_20">
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

      <div class="show-day clearfix">
        <span class="title">{{ '第' + $numToCN(recipeIndex + 1) + '天' }}</span>
        <icon-box class="icon" icon-name="calorie" :w="52 / 3" :h="66 / 3" box-w="26" box-h="28"></icon-box>
        <span class="value">{{ dailyCalorie }}</span><span class="unit">千卡</span>
      </div>
      <div class="rte-box">
        <recipe-table-editor
          ref="rte"
          v-model="recipeList[recipeIndex]"
        ></recipe-table-editor>
      </div>

      <div class="mt_20">
        <m-button :loading="btnLoading" @click="saveRecipe">保存</m-button>
        <m-button plain @click="leavePage">返回</m-button>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import RecipeTableEditor from '@/common/components/RecipeTableEditor'
import {
  defaultRecipeData,
  buildRecipeData,
  buildFoods,
  recipeIsEmpty
} from '@/common/components/RecipeTableEditor/utils'

const localSession = new LocalStore('PatientSetRecipe', true)

export default {
  name: 'PatientSetRecipe',
  components: {
    RecipeTableEditor,
  },
  data() {
    return {
      title: '配置营养餐',
      loading: true,
      ppid: '', // 项目患者id
      userId: '', // 患者id

      ppInfo: {
        project: {},
        patient: {
          user_profile: {}
        },
      },

      recipeLibrary: [],
      recipeSelect: '',
      form: {
        name: '',
      },
      recipeList: [],
      recipeIndex: 0,

      btnLoading: false,
    }
  },
  watch: {
    'recipeData': {
      deep: true,
      handler: function (n) {
        this.calcCalories()
      }
    }
  },
  created() {
    this.initForm()
    this.getRecipeLibrary()
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
        localSession.set('cache', {
          type: params.type,
          ppid: params.ppid,
          userId: params.userId,
        })
      }

      this.ppid = data.ppid
      this.userId = data.userId

      this.recipeList.push(defaultRecipeData())
      this.getPpInfo()
    },
    getPpInfo() {
      this.loading = true
      this.$api.myProjectPatient.getDetail(this.ppid)
        .then((res) => {
          this.ppInfo = res.data
          this.loading = false
          this.ppInfoLoadDone()
        })
        .catch((err) => {
          console.log(err)
          this.$message.error(JSON.stringify(err))
        })
    },
    ppInfoLoadDone() {
    },
    getRecipeLibrary() {
      this.$api.mealPlans.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id',
      })
        .then((res) => {
          this.recipeLibrary = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    usingRecipeLibrary(id) {
      this.recipeIndex = 0
      if (id === '') {
        this.form.name = ''
        this.recipeList = [defaultRecipeData()]
        return
      }
      this.form.name = this.recipeLibrary.find(item => item.id === id).name
      this.$api.mealPlans.getDetail(id)
        .then((res) => {
          const menus = res.data.menus.sort((a, b) => a.day - b.day)
          this.recipeList = menus.map((menu) => {
            return buildRecipeData(menu)
          })
        })
    },
    saveRecipe() {
      if (this.form.name === '') {
        return this.$message.error('请输入食谱名称')
      }

      for (let i = 0; i < this.recipeList.length; i++) {
        const item = this.recipeList[i]
        if (recipeIsEmpty(item)) {
          return this.$message.error(`第${this.$numToCN(i + 1)}天的食物为空，请添加食物后再保存`)
        }
      }

      this.btnLoading = true
      const params = {
        project_patient_id: this.ppid,
        name: this.form.name,
        menus: []
      }
      params.menus = this.recipeList.map((item, index) => {
        return {
          day: index + 1,
          foods: buildFoods(item)
        }
      })
      this.$api.ppMealPlans.create(params)
        .then((mealRes) => {
          this.form.name = ''
          this.recipeList = [defaultRecipeData()]
          this.recipeIndex = 0
          this.recipeSelect = ''
          return this.$message.success('新增配餐成功')

        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    addRecipe() {
      this.recipeList.push(defaultRecipeData())
      this.recipeIndex = this.recipeList.length - 1
    },
    toHistoryPage() {
      this.$router.push({
        name: 'RecipeLibrary',
        query: {
          views: 1,
          ppid: this.ppid,
          name: this.ppInfo.patient.name
        }
      })
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
    leavePage() {
      this.$router.push(`/patient_detail/${this.ppid}?views=3`)
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
      if (!this.currentRecipeData) return 0
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
    position: relative;
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);

    .history-btn {
      position: absolute;
      right: 32px;
    }
  }
}

.patient-info {
  width: 100%;
  position: relative;

  .base {
    position: relative;
    display: flex;
    align-items: center;
    height: 70px;
    margin-bottom: 22px;

    .name {
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: #344563;
      line-height: 28px;
      margin-left: 16px;
    }

    .sex {
      margin-left: 8px;
    }

    .tag {
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 13px;
      border: 1px solid #D9E1EC;
      font-size: 12px;
      font-weight: 600;
      color: #1E242C;
      margin-left: 4px;
    }

    .tag.age {
      min-width: 42px;
    }

    .tag.stage {
      min-width: 52px;
    }

    .tag.id {
      min-width: 76px;
    }

    .btn-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .font-mixin {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #5A607F;
    line-height: 20px;
  }

  .base2 {
    display: flex;
    margin-bottom: 22px;

    .item {
      .font-mixin();
      margin-right: 38px;
    }

  }

  .tags {
    .font-mixin();
    height: auto;

    .tag {
      height: 27px;
      line-height: 27px;
      text-align: center;
      border-radius: 6px;
      border: 1px solid #D9E1EC;
      padding: 4px 8px;
    }

    margin-bottom: 32px;
  }

  .set-position {
    position: absolute;
    right: 0;
    top: 20px;

    .recommend-recipe {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 288px;
      height: 72px;
      border-radius: 8px;
      position: relative;
      padding: 0 10px;

      .bg {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        opacity: 0.1;
        background: linear-gradient(144deg, #FD723C 0%, #FFB470 100%);
      }

      :deep(.el-input) {
        .el-input__inner {
          border: unset;
          background: transparent;
          font-size: 20px;
          font-weight: 500;
          color: #344563;
          padding-left: 40px;
          opacity: 1;
          .text-ellipsis();
        }
      }
    }
  }
}

.show-day {
  .title {
    float: left;
    font-size: 20px;
    font-weight: 500;
    color: #344563;
    margin: 0 20px 20px 0;
  }

  .value {
    height: 28px;
    line-height: 28px;
    margin-left: 2px;
    margin-right: 2px;
  }

  .unit {
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    color: #333333;
  }
}

.show-calorie {
  .search-bar {
    padding-left: 0;
    border: unset;
    background-color: unset;

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
    margin: 0 2px;
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
