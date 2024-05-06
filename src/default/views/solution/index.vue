<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        干预方案
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <m-button v-auth="'solution.create'" class="right add-auth-btn" icon="el-icon-plus" @click="toSetSolutionTpl('create')">创建方案</m-button>
        <m-table
          ref="table"
          class="m-table"
          :data="intervsTplList"
          :total="intervsTplTotal"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="intervsTplPageSize"
          :current-page.sync="intervsTplPage"
          :get-data-func="getIntervsTplList"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="编号"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="方案名称"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="created_at"
            min-width="120"
            label="创建时间"
          >
            <template v-slot="scope">
              {{ scope.row.updated_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160px">
            <template v-slot="scope">
              <div class="flex justify_center">
<!--                <icon-box icon-name="table_view" w="39" h="39" box-w="39" style="cursor:pointer;"-->
<!--                          title="查看" @click.native="toSetSolutionTpl('view', scope.row)"></icon-box>-->
                <icon-box v-auth="'solution.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="编辑" @click.native="toSetSolutionTpl('edit', scope.row)"></icon-box>
                <icon-box v-auth="'solution.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                          @click.native="deleteClick(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolutionTpl',
  data() {
    return {
      viewsMode: '营养模板',
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
    this.getIntervsTplList()
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
    toSetSolutionTpl(type, row = {}) {
      this.$router.push({
        name: 'SetSolution',
        params: {
          type: type,
          ...row
        }
      })
    },
    deleteClick(row) {
      const tips = `确定删除干预方案【${row.name}】吗？`
      this.$confirm(tips, '删除干预方案', {
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

.add-auth-btn {
  position: absolute;
  top: 80px;
  right: 32px;
}

.m-table {
  height: 100%;

  :deep(.el-table__body-wrapper) {
    overflow-x: hidden;
  }

  .el-link {
    color: #00B386;
    text-decoration: none;
  }
}

:deep(.el-date-editor) {
  width: 100% !important;

  .el-range-separator {
    line-height: 32px;
  }
}
</style>
