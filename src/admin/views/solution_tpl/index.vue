<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        干预方案模板
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="list-title" style="margin-top: 0;">
        模板列表
        <m-button v-auth="'solutionTpl.create'" w="80px" h="40px" class="right" @click="toSetSolutionTpl('create')">新建</m-button>
      </div>
      <m-table
        ref="table"
        class="m-table"
        :data="intervsTplList"
        :total="intervsTplTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="intervsTplPageSize"
        :current-page.sync="intervsTplPage"
        :height="300"
        :get-data-func="getIntervsTplList"
      >
        <el-table-column
          show-overflow-tooltip
          prop="title"
          label=""
        >
          <template v-slot="scope">
            标题：{{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updated_at"
          width="120"
        >
          <template v-slot="scope">
            {{ scope.row.updated_at | dateFormatWithoutTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px">
          <template v-slot="scope">
            <div class="flex justify_center">
              <!--              <icon-box icon-name="table_view" w="39" h="39" box-w="39" style="cursor:pointer;"-->
              <!--                        title="查看" @click.native="toSetSolutionTpl('view', scope.row)"></icon-box>-->
              <icon-box v-auth="'solutionTpl.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                        title="编辑" @click.native="toSetSolutionTpl('edit', scope.row)"></icon-box>
              <icon-box v-auth="'solutionTpl.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                        @click.native="deleteClick(scope.row)"></icon-box>
            </div>
          </template>
        </el-table-column>
      </m-table>

      <div class="mt_20 mb_10 relative">
        <el-radio-group @change="viewsModeChange" ref="viewChangeBar" class="radio-group" v-model="viewsMode">
          <el-radio-button label="营养模板"></el-radio-button>
          <el-radio-button label="运动模板"></el-radio-button>
        </el-radio-group>
        <m-button v-auth="'solutionTpl.createNutritional'" v-if="viewsMode === '营养模板'" w="80px" h="40px" class="absolute bottom_0 right_0"
                  @click="toSetDietTpl('create')">
          新建
        </m-button>
        <m-button v-auth="'solutionTpl.createExercise'"  v-else w="80px" h="40px" class="absolute bottom_0 right_0" @click="toSetExerTpl('create')">新建
        </m-button>
      </div>

      <template v-if="viewsMode === '营养模板'">
        <m-table
          ref="dietTplList"
          class="m-table"
          :data="dietTplList"
          :total="dietTplTotal"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="dietTplPageSize"
          :current-page.sync="dietTplPage"
          :height="240"
          :get-data-func="getDietTplList"
        >
          <el-table-column
            show-overflow-tooltip
            prop="title"
            label=""
          >
            <template v-slot="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="updated_at"
            width="120"
          >
            <template v-slot="scope">
              {{ scope.row.updated_at | dateFormatWithoutTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <!--                <icon-box icon-name="table_view" w="39" h="39" box-w="39" style="cursor:pointer;"-->
                <!--                          title="查看" @click.native="toSetDietTpl('view',scope.row)"></icon-box>-->
                <icon-box v-auth="'solutionTpl.updateNutritional'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="编辑" @click.native="toSetDietTpl('edit',scope.row)"></icon-box>
                <icon-box v-auth="'solutionTpl.deleteNutritional'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                          @click.native="deleteDietTpl(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </template>
      <template v-else>
        <m-table
          ref="exerTplList"
          class="m-table"
          :data="exerTplList"
          :total="exerTplTotal"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="exerTplPageSize"
          :current-page.sync="exerTplPage"
          :height="240"
          :get-data-func="getExerTplList"
        >
          <el-table-column
            show-overflow-tooltip
            prop="title"
            label=""
          >
            <template v-slot="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="updated_at"
            width="120"
          >
            <template v-slot="scope">
              {{ scope.row.updated_at | dateFormatWithoutTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <!--                <icon-box icon-name="table_view" w="39" h="39" box-w="39" style="cursor:pointer;"-->
                <!--                          title="查看" @click.native="toSetExerTpl('view', scope.row)"></icon-box>-->
                <icon-box v-auth="'solutionTpl.updateExercise'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="编辑" @click.native="toSetExerTpl('edit', scope.row)"></icon-box>
                <icon-box v-auth="'solutionTpl.deleteExercise'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                          @click.native="deleteExerTpl(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolutionTpl',
  data() {
    return {
      viewsMode: '',
      intervsTplList: [],
      intervsTplTotal: 0,
      intervsTplPageSize: 10,
      intervsTplPage: 1,
      dietTplList: [],
      dietTplTotal: 0,
      dietTplPageSize: 10,
      dietTplPage: 1,
      exerTplList: [],
      exerTplTotal: 0,
      exerTplPageSize: 10,
      exerTplPage: 1,

      assignedForm: {},
      assignedRules: {},
    }
  },
  mounted() {
    let index = 0
    if (this.$route.query.views) {
      index = parseInt(this.$route.query.views)
    }
    this.getIntervsTplList()
    if (index === 0) {
      this.viewsModeChange('营养模板')
    } else {
      this.viewsModeChange('运动模板')
    }
  },
  methods: {
    getIntervsTplList() {
      this.$refs.table.loadStart()
      this.$api.intervsTpl.getList({
        page: this.intervsTplPage,
        page_size: this.intervsTplPageSize
      })
        .then((res) => {
          this.intervsTplList = res.data.results
          this.intervsTplTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getDietTplList() {
      this.$nextTick(() => {
        const { dietTplList } = this.$refs
        if (dietTplList) dietTplList.loadStart()
      })
      this.$api.dietTpl.getList({
        page: this.dietTplPage,
        page_size: this.dietTplPageSize
      })
        .then((res) => {
          this.dietTplList = res.data.results
          this.dietTplTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getExerTplList() {
      this.$nextTick(() => {
        const { exerTplList } = this.$refs
        if (exerTplList) exerTplList.loadStart()
      })
      this.$api.exerTpl.getList({
        page: this.exerTplPage,
        page_size: this.exerTplPageSize
      })
        .then((res) => {
          this.exerTplList = res.data.results
          this.exerTplTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    toSetSolutionTpl(type, row = {}) {
      this.$router.push({
        name: 'SetSolutionTpl',
        params: {
          type: type,
          ...row
        }
      })
    },
    toSetExerTpl(type, row = {}) {
      this.$router.push({
        name: 'SetExerciseTpl',
        params: {
          type: type,
          ...row,
        }
      })
    },
    toSetDietTpl(type, row = {}) {
      this.$router.push({
        name: 'SetDietTpl',
        params: {
          type: type,
          ...row,
        }
      })
    },
    deleteClick(row) {
      const tips = `确定删除模板【${row.name}】吗？`
      this.$confirm(tips, '删除模板', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.intervsTpl.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getIntervsTplList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    toDetail(row) {

    },
    deleteDietTpl(row) {
      const tips = `确定删除营养模板【${row.name}】吗？`
      this.$confirm(tips, '删除模板', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.dietTpl.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getDietTplList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    deleteExerTpl(row) {
      const tips = `确定删除运动模板【${row.name}】吗？`
      this.$confirm(tips, '删除模板', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.exerTpl.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getExerTplList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    viewsModeChange(val) {
      this.viewsMode = val
      if (val === '营养模板') {
        this.$router.push(`${this.$route.path}?views=0`)
        this.getDietTplList()
      } else {
        this.$router.push(`${this.$route.path}?views=1`)
        this.getExerTplList()
      }
    },
  }, // methods end
  computed: {},
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
  height: calc(100% - 155px);

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

.m-table {
  :deep(.el-table__header-wrapper) {
    display: none;
  }

  :deep(.el-table__row) {
    height: 60px;
  }
}

</style>
