<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <b>知识库</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        食谱库
      </el-breadcrumb-item>
    </el-breadcrumb>

    <m-button v-auth="'nutrRecipeLibrary.create'" v-if="viewsMode==='食谱库'" icon="el-icon-plus" class="common-add-btn" @click="toSetPage('create')">添加食谱
    </m-button>
    <div class="card">
      <div class="container">

        <div class="relative">
          <el-radio-group @change="viewsModeChange" class="radio-group" v-model="viewsMode">
            <el-radio-button label="食谱库"></el-radio-button>
            <el-radio-button label="配餐记录"></el-radio-button>
          </el-radio-group>
        </div>

        <template v-if="viewsMode === '食谱库'">
          <m-table
            ref="recipeTable"
            class="m-table mt_20"
            :data="recipeData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :height="'calc(100% - 8px - 15px - 15px)'"
            :get-data-func="getRecipeData"
          >
            <el-table-column
              show-overflow-tooltip
              prop="id"
              label="食谱记录ID"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="食谱名称"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="包含天数"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.menu_count ? scope.row.menu_count : 0 }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="累计总热量"
              min-width="120"
            >
              <template v-slot="scope">
                {{ (scope.row.calories ? scope.row.calories : 0) + '千卡' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="creator.name"
              show-overflow-tooltip
              label="创建人"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              label="创建时间"
              min-width="150"
            >
              <template v-slot="scope">
                {{ scope.row.created_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160px">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-auth="'nutrRecipeLibrary.info'" icon-name="table_detail" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="详情" @click.native="toSetPage('view', scope.row)"></icon-box>
                  <icon-box v-auth="'nutrRecipeLibrary.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="编辑" @click.native="toSetPage('edit', scope.row)"></icon-box>
                  <icon-box v-auth="'nutrRecipeLibrary.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                            @click.native="deleteClick(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </m-table>
        </template>

        <template v-else>
          <el-form
            class="form-box"
            :model="searchForm"
            :rules="rules"
            ref="searchForm"
            label-position="top"
            @submit.native.prevent
          >
            <div class="search-bar mt_20">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                      :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">项目名称</el-row>
                  <el-row>
                    <el-form-item prop="stage">
                      <el-input
                        v-model="searchForm.name"
                        placeholder="请输入患者姓名搜索"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button icon="el-icon-search" h="40px" w="100px" @click="pprecipePage=1;getPprecipeData()">搜索</m-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <m-table
            ref="ppRecipeTable"
            class="m-table pp-recipe"
            :data="pprecipeData"
            :total="pprecipeTotal"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pprecipePageSize"
            :current-page.sync="pprecipePage"
            :get-data-func="getPprecipeData"
          >
            <el-table-column
              show-overflow-tooltip
              prop="id"
              label="配餐记录ID"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="project_patient.patient"
              label="用户"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="包含天数"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.menu_count ? scope.row.menu_count : 0 }}
              </template>
            </el-table-column>
            <el-table-column
              label="累计总热量"
              min-width="120"
            >
              <template v-slot="scope">
                {{ (scope.row.calories ? scope.row.calories : 0) + '千卡' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="creator.name"
              show-overflow-tooltip
              label="创建人"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              label="创建时间"
              min-width="150"
            >
              <template v-slot="scope">
                {{ scope.row.created_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160px">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-auth="'nutrRecipeLibrary.info'" icon-name="table_detail" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="详情" @click.native="toSetPatientRecipePage('view', scope.row)"></icon-box>
                  <icon-box v-auth="'nutrRecipeLibrary.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="编辑" @click.native="toSetPatientRecipePage('edit', scope.row)"></icon-box>
                  <icon-box v-auth="'nutrRecipeLibrary.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                            @click.native="deletePatientRecipe(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </m-table>
        </template>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'RecipeLibrary',
  data() {
    return {
      viewsMode: '',
      searchForm: {
        name: '',
      },
      rules: {},

      recipeData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      pprecipeData: [],
      pprecipeTotal: 0,
      pprecipePageSize: 10,
      pprecipePage: 1,

      assignedForm: {},
      assignedRules: {},
    }
  },
  created() {
    let index = 0
    if (this.$route.query.views) {
      index = parseInt(this.$route.query.views)
    }
    if (index === 0) {
      this.viewsModeChange('食谱库')
    } else {
      this.viewsModeChange('配餐记录')
    }

  },
  methods: {
    viewsModeChange(val) {
      this.viewsMode = val
      if (val === '食谱库') {
        this.$router.push(`${this.$route.path}?views=0`)
        this.getRecipeData()
      } else {
        let url = `${this.$route.path}?views=1`
        const query = this.$route.query
        if (query.ppid) url += `&ppid=${query.ppid}`
        if (query.name) this.searchForm.name = query.name
        this.$router.push(url)
        this.getPprecipeData()
      }
    },
    getRecipeData() {
      this.$nextTick(() => {
        const { recipeTable } = this.$refs
        if (recipeTable) recipeTable.loadStart()
      })

      this.$api.mealPlans.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: '-created_at',
      })
        .then((res) => {
          this.recipeData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getPprecipeData() {
      this.$nextTick(() => {
        const { ppRecipeTable } = this.$refs
        if (ppRecipeTable) ppRecipeTable.loadStart()
      })

      const params = {
        page: this.pprecipePage,
        page_size: this.pprecipePageSize,
        search: this.searchForm.name,
        ordering: '-created_at',
      }
      const query = this.$route.query
      if (query.ppid) params.project_patient = query.ppid
      this.$api.ppMealPlans.getList(params)
        .then((res) => {
          this.pprecipeData = res.data.results
          this.pprecipeTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    toSetPage(type, row = {}) {
      this.$router.push({
        name: 'SetRecipe',
        params: {
          type,
          ...row
        }
      })
    },
    toSetPatientRecipePage(type, row) {
      this.$router.push({
        name: 'SetPatientRecipe',
        params: {
          type,
          ...row
        }
      })
    },
    deleteClick(row) {
      this.$confirm(`确定食谱【${row.name}】吗？`, '删除食谱', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.mealPlans.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getRecipeData()
            })
            .catch((err) => {
              this.$message.error(err.detail)
            })
        })
        .catch(() => {
        })
    },
    deletePatientRecipe(row) {
      this.$confirm(`确定配餐记录吗？`, '删除配餐', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.ppMealPlans.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getPprecipeData()
            })
            .catch((err) => {
              this.$message.error(err.detail)
            })
        })
        .catch(() => {
        })
    },
  }, // methods end
  computed: {},
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
  }
}

.radio-group {
  width: 250px;
  height: 46px;
  border-radius: 23px;
  background-color: #F4F5FA;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-radio-button :deep(.el-radio-button__inner) {
    width: 91px;
    height: 34px;
    line-height: 34px;
    padding: 0;
    border-radius: 17px;
    border: none;
    user-select: none;
    color: #000;
    background-color: #F4F5FA;

    &:hover {
      color: #797979;
    }
  }

  .el-radio-button.is-active {
    border: none;

    :deep(.el-radio-button__inner) {
      height: 34px;
      line-height: 34px;
      padding: 0;
      background: #344563;
      border: none;
      user-select: none;
      color: #fff;
    }
  }

  .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
    box-shadow: unset;
  }
}


.m-table {
  height: calc(100% - 56px);

  :deep(.el-table__body-wrapper) {
    overflow-x: hidden;
  }

  .el-link {
    color: #00B386;
    text-decoration: none;
  }
}

.m-table.pp-recipe {
  height: calc(100% - 156px);
}

.search-bar {

  .el-form-item {
    margin: 0;

    .el-select {
      width: 100%;
    }

    :deep(.el-input__inner) {
      width: 100%;
      cursor: default !important;
      font-size: 14px;
      height: 40px !important;
    }
  }
}

</style>
