<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        运动热量表
      </el-breadcrumb-item>
    </el-breadcrumb>
    <m-button v-auth="'exerciseCalorie.create'" v-if="viewsMode === '运动库'" class="common-add-btn" icon="el-icon-plus" @click="toSetExercisePage">添加
    </m-button>
    <div class="card">
      <div class="container">

        <div>
          <el-radio-group @change="viewsModeChange" class="radio-group" v-model="viewsMode">
            <el-radio-button label="运动库"></el-radio-button>
            <el-radio-button label="推荐运动"></el-radio-button>
          </el-radio-group>
        </div>

        <template v-if="viewsMode === '运动库'">
          <el-form
            class="form-box"
            :model="searchForm"
            :rules="rules"
            ref="form"
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
                        placeholder="输入项目名称进行搜索"
                        clearable
                        @keydown.enter.p.prevent="getList"
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button icon="el-icon-search" @click.native="page=1;getList()" h="40px" w="100px">搜索</m-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>

          <m-table
            ref="table"
            class="m-table"
            :data="tableData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :get-data-func="getList"
          >
            <el-table-column
              show-overflow-tooltip
              prop="id"
              label="运动项目ID"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="name"
              label="项目名称"
              min-width="100"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="intensity"
              label="强度值（METs）"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="created_at"
              label="创建时间"
              min-width="120"
            >
              <template v-slot="scope">
                {{ scope.row.created_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              min-width="120"
              align="center">
              <template v-slot="scope">
                <el-tag :disable-transitions="true" type="success" v-if="scope.row.status == '1'" effect="dark">启用
                </el-tag>
                <el-tag :disable-transitions="true" type="info" v-if="scope.row.status == '0'" effect="dark">禁用
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-auth="'exerciseCalorie.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="编辑" @click.native="toSetPage(scope.row)"></icon-box>
                  <icon-box v-auth="'exerciseCalorie.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                            @click.native="deleteClick(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </m-table>
        </template>
        <template v-else>
          <el-form
            class="form-box"
            :model="ppsearchForm"
            :rules="rules"
            ref="form"
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
                        v-model="ppsearchForm.name"
                        placeholder="输入项目名称进行搜索"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button icon="el-icon-search" h="40px" w="100px" @click="ppPage=1;getPpList()">搜索</m-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <m-table
            ref="pptable"
            class="m-table"
            :data="pptableData"
            :total="ppTotal"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="ppPageSize"
            :current-page.sync="ppPage"
            :height="'calc(100% - 8px - 15px - 15px)'"
            :get-data-func="getList"
          >
            <el-table-column
              show-overflow-tooltip
              prop="id"
              label="推荐记录ID"
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
              prop="exercise.id"
              label="运动项目ID"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="duration"
              label="运动时长（分钟）"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              prop="calories"
              label="总消耗热量"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="推荐时间"
              min-width="130"
            >
              <template v-slot="scope">
                {{ scope.row.created_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box icon-name="table_detail" w="39" h="39" box-w="39" style="cursor:pointer;"
                            title="详情" @click.native="toDetail(scope.row)"></icon-box>
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
  name: 'ExerciseCalorie',
  data() {
    return {
      viewsMode: '',
      searchForm: {
        name: '',
      },
      ppsearchForm: {
        name: '',
      },
      rules: {},
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      pptableData: [],
      ppTotal: 0,
      ppPageSize: 10,
      ppPage: 1,

    }
  },
  created() {
    let index = 0
    if (this.$route.query.views) {
      index = parseInt(this.$route.query.views)
    }
    if (index === 0) {
      this.viewsModeChange('运动库')
      this.getList()
    } else {
      this.viewsModeChange('推荐运动')
      this.getPpList()
    }
  },
  methods: {
    getList() {
      this.$nextTick(() => {
        const { table } = this.$refs
        if (table) table.loadStart()
      })
      this.$api.exercise.getList({
        page: this.page,
        page_size: this.pageSize,
        // ordering: '-created_at',
        search: this.searchForm.name,
      })
        .then((res) => {
          this.total = res.data.count
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getPpList() {
      this.$nextTick(() => {
        const { pptable } = this.$refs
        if (pptable) pptable.loadStart()
      })
      this.$api.ppexercise.getList({
        page: this.ppPage,
        page_size: this.ppPageSize,
        ordering: '-created_at',
        search: this.ppsearchForm.name
      })
        .then((res) => {
          this.ppTotal = res.data.count
          this.pptableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    toSetExercisePage() {
      this.$router.push({
        name: 'SetExercise',
        params: {
          type: 'create',
        },
      })
    },
    viewsModeChange(val) {
      this.viewsMode = val
      if (val === '运动库') {
        this.$router.push(`${this.$route.path}?views=0`)
        this.getList()
      } else {
        this.$router.push(`${this.$route.path}?views=1`)
        this.getPpList()
      }
    },
    toSetPage(row) {
      this.current = row
      this.$router.push({
        name: 'SetExercise',
        params: {
          type: 'edit',
          ...row,
        },
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除运动项目【${row.name}】吗？`, '删除项目', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.exercise.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    toDetail(row) {
      this.$router.push({
        name: 'PpExerciseDetail',
        params: {
          id: row.id
        }
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
  height: calc(100% - 156px);

  :deep(.el-table__body-wrapper) {
    overflow-x: hidden;
  }

  .el-link {
    color: #00B386;
    text-decoration: none;
  }
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
