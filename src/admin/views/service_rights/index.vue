<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        服务权益
      </el-breadcrumb-item>
    </el-breadcrumb>
    <m-button v-auth="'serviceRight.create'" class="common-add-btn" icon="el-icon-plus" @click="createServiceRights">新建权益</m-button>
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
            label="权益编号"
            width="100"
          >
          </el-table-column>
          <el-table-column
            width="80"
            label="图标"
            align="center"
          >
            <template v-slot="scope">
              <el-image
                :src="scope.row.icon"
                style="width: 40px;"
                :preview-src-list="[scope.row.icon]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="权益名称"
            min-width="100"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="count"
            label="次数"
            min-width="100"
          >
            <template v-slot="scope">
              <template v-if="scope.row.is_unlimited">
                不限次数
              </template>
              <template v-else>
                {{ scope.row.count }}
              </template>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="description"
            label="服务权益描述"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态"
            min-width="100"
          >
            <template v-slot="scope">
              <el-tag type="success" v-if="scope.row.status == '1'" effect="dark">启用</el-tag>
              <el-tag type="info" v-if="scope.row.status == '2'" effect="dark">禁用</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="120px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box v-auth="'serviceRight.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="编辑" @click.native="editCard(scope.row)"></icon-box>
                <icon-box v-auth="'serviceRight.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
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
  name: 'ServiceRights',
  components: {},
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
    }
  },

  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$refs.table.loadStart()
      this.$api.serviceRights.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id'
      }).then((res) => {
        this.total = res.data.count
        this.tableData = res.data.results
      })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    createServiceRights() {
      this.$router.push({
        name: 'SetServiceRights',
        params: {
          type: 'create',
        },
      })
    },
    deleteClick(row) {
      this.$confirm(`确定权益【${row.name}】吗？`, '删除权益', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.serviceRights.delete(row.id)
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
    editCard(row) {
      this.$router.push({
        name: 'SetServiceRights',
        params: {
          type: 'edit',
          ...row
        },
      })
    },
  }, // methods end
}
</script>

<style scoped lang="less">
.panel {
  //.card {
  //  margin-top: 32px;
  //  height: calc(100% - 32px - 32px);
  //}
}

.m-table {
  height: 100%;
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
