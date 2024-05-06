<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_blbgmb" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        病历报告模板
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!--<m-button class="right add-auth-btn" icon="el-icon-plus" @click="toSetPage">创建模板</m-button>-->
    <div class="card">
      <div class="container">
        <m-table
          ref="table"
          class="m-table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100% - 8px - 15px - 15px)'"
          :get-data-func="getList"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="模板ID"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="record_type"
            label="分类"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.record_type | medicalType }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="created_at"
            label="创建时间"
            min-width="170"
          >
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="状态"
            min-width="70"
          >
            <template v-slot="scope">
              <el-tag v-if="scope.row.is_enabled" type="success" effect="dark">启用
              </el-tag>
              <el-tag v-else type="info" effect="dark">禁用
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="120px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box v-auth="'medical.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="编辑" @click.native="editClick('edit', scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Medical',
  data() {
    return {
      companyID: -1,
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      current: {},
    }
  },
  mounted() {
    this.getList()
  },
  watch: {},
  methods: {
    ...mapActions({
      setAsideIndex: 'common/setAsideIndex',
    }),
    getList() {
      this.$refs.table.loadStart()
      this.$api.medicalRecordTemps.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id',
      })
        .then((res) => {
          this.total = res.data.count
          this.tableData = res.data.results
        })
        .catch((err) => {
       this.$message.error(JSON.stringify(err))
        })
    },
    deleteClick(row) {
      this.$confirm(`确定删除模板【${ row.name }】吗？`, '删除模板', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.project.delete(row.id)
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
    editClick(type, row = {}) {
      this.current = row
      this.$router.push({
        name: 'SetMedical',
        params: {
          type,
          ...row,
        },
      })
    },
    toSetPage(row) {
      this.$router.push({
        name: 'SetMedical',
        params: {
          type: 'create',
          ...row,
        },
      })
    },
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'asideIndex',
    ]),

  }
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 8px !important;
    height: calc(100% - 8px - 8px) !important;
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
