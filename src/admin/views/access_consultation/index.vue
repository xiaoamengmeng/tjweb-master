<template>
  <div class="panel">
    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
    >
      <el-breadcrumb-item>
        <icon-box
          icon-name="menu_wdhz"
          w="20"
          h="20"
          box-w="20"
          box-h="90"
        ></icon-box>
        <b>用户管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        接入咨询
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
        <el-form
          class="form-box"
          :model="form"
          ref="form"
          label-position="top"
        >
          <div class="search-bar mt_20">
            <el-row
              class="search-bar-row"
              type="flex"
              justify="start"
              align="middle"
              :gutter="20"
              style="width: 100%; height: 100%"
            >
              <el-col
                class="search-bar-col"
                :span="5"
              >
                <el-row class="label-t">搜索信息</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.search"
                      placeholder="姓名/账户"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="6"
              >
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button
                    icon="el-icon-search"
                    h="40px"
                    w="100px"
                    @click="page=1;getDataFunc()"
                  >搜索</m-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table
          class="m-table"
          ref="table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100% - 8px - 15px - 15px - 60px)'"
          :get-data-func="getDataFunc"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="用户ID"
            min-width="60"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="姓名"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="账户"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="users"
            label="人员类型"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.users && scope.row.users[0]">{{ scope.row.users[0].role_name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="is_active"
            label="状态"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                type="success"
                v-if="scope.row.is_active"
                effect="dark"
              >启用</el-tag>
              <el-tag
                type="info"
                v-else
                effect="dark"
              >禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="department.name"
            label="所属部门"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="date_joined"
            label="创建时间"
            min-width="200"
            show-overflow-tooltip
          >
            <template v-slot="scope">
              <span>{{ scope.row.date_joined | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="100"
          >
            <template v-slot="scope">
              <el-link
                v-auth="'patient.delete'"
                @click="deleteClick(scope.row)"
              >删除账号</el-link>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccessConsultation",
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        search: "",
      },
    };
  },
  mounted() {
    this.getDataFunc();
  },
  methods: {
    getDataFunc() {
      this.$refs.table.loadStart();
      this.$api.accounts
        .getList({
          page: this.page,
          page_size: this.pageSize,
          department__organization: 1,
          ordering: "-id",
          search: this.form.search,
          users__role_id__in: "ld,rd",
        })
        .then((res) => {
          this.$refs.table.loadDone();
          this.tableData = res.data.results;
          this.total = res.data.count;
        })
        .catch((err) => {
          this.$refs.table.loadDone();
          this.$message.error(JSON.stringify(err));
        });
    },
    deleteClick(row) {
      this.$confirm(`确定删除账号吗？`, "删除账号", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$api.accounts
          .deleteForAccounts(row.account_id)
          .then((res) => {
            this.$message.success("删除成功");
            this.getDataFunc();
          })
          .catch((err) => {
            if (err.code === "protected_error") {
              this.$message.error("删除失败，账号受到保护，无法删除");
            } else {
              this.$message.error(JSON.stringify(err));
            }
          });
      });
    },
  },
};
</script>

<style scoped lang="less">
.m-table {
  height: calc(100% - 50px);
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

.form-box {
  .el-select {
    :deep(.el-select__tags) {
      .el-tag {
        box-sizing: border-box;
        background-color: #e9e9eb;
        color: #909399;

        .el-tag__close.el-icon-close::before {
          background: transparent;
          color: #fff;
        }
      }
    }
  }
}
</style>
