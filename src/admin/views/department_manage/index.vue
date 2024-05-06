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
        <b>机构管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        部门管理
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
        <m-button
          v-auth="'department.create'"
          class="common-add-btn"
          icon="el-icon-plus"
          @click="toSetPage('create')"
        >新建</m-button>

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
                :span="6"
              >
                <el-row class="label-t">搜索信息</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.search"
                      placeholder="部门名称"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="5"
              >
                <el-row class="label-t">所属机构</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.organization"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in organizations"
                        :key="statu.id"
                        :label="statu.name"
                        :value="statu.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col
                class="search-bar-col"
                :span="5"
              >
                <el-row class="label-t">启用状态</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.is_active"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in status"
                        :key="statu.code"
                        :label="statu.label"
                        :value="statu.code"
                      ></el-option>
                    </el-select>
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
            label="ID"
            min-width="60"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="organization"
            label="所属机构"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.organization">{{ scope.row.organization.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="部门名称"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="contact"
            label="联系人"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="contact_details"
            label="联系方式"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="is_active"
            label="启用状态"
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
            prop="head_count"
            label="部门人数"
            min-width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="creator"
            label="创建人"
            min-width="80"
          >
            <template v-slot="scope">
              <span v-if="scope.row.creator">{{ scope.row.creator.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            label="创建时间"
            min-width="200"
            show-overflow-tooltip
          >
            <template v-slot="scope">
              <span>{{ scope.row.created_at | dateFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            min-width="120"
          >
            <template v-slot="scope">
              <div class="flex justify_center">
                <el-link
                  v-auth="'department.update'"
                  @click.native="changeInfoClick(scope.row)"
                >修改信息</el-link>
                <span
                  v-if="scope.row.head_count === 0"
                  class="inline_block mr_10"
                ></span>
                <el-link
                  v-if="scope.row.head_count === 0"
                  v-auth="'department.delete'"
                  @click.native="deleteClick(scope.row)"
                >删除</el-link>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
// filterable
// remote
// :remote-method="remoteMethod"

export default {
  name: "DepartmentManage",
  components: {},
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        search: "",
        is_active: "",
        organization: "",
      },
      status: [],
      organizations: [],
      organizationsTotal: 0,
      organizationsPage: 1,
      organizationsPageSize: 9999,
    };
  },
  mounted() {
    this.initForm();
    this.getStatus();
    this.getDataFunc();
    this.getOrganizations();
  },
  methods: {
    initForm() {
      const params = this.$route.params;
      this.form.compareAssign(params);
    },
    getStatus() {
      this.status = this.$dict.departmentManageStatus.data;
    },
    getOrganizations(search = "") {
      this.$api.organizationManage
        .getList({
          page: this.organizationsPage,
          page_size: this.organizationsPageSize,
          search,
        })
        .then((res) => {
          this.organizationsTotal = res.data.count;
          this.organizations = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    remoteMethod(query) {
      // if (query !== '') {
      //   setTimeout(() => {
      //     this.getOrganizations(query)
      //   }, 200);
      // }
    },
    getDataFunc() {
      this.$refs.table.loadStart();
      this.$api.departmentManage
        .getList({
          page: this.page,
          page_size: this.pageSize,
          ordering: "-id",
          search: this.form.search,
          is_active: this.form.is_active,
          organization: this.form.organization,
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
    toSetPage() {
      this.$router.push({
        name: "SetDepartment",
        params: {
          type: "create",
        },
      });
    },
    changeInfoClick(row) {
      this.$router.push({
        name: "SetDepartment",
        params: {
          type: "edit",
          ...row,
        },
      });
    },
    deleteClick(row) {
      this.$confirm(`确定删除部门吗？`, "删除部门", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.$api.departmentManage
          .delete(row.id)
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
