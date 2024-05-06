<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>用户管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        患者列表
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
            <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                    :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="5">
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
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">绑定医生</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="form.doctor_name"
                      placeholder="医生姓名"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">所属机构</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.organization_id"
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
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">所属部门</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="form.department_id"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="statu in departments"
                        :key="statu.id"
                        :label="statu.name"
                        :value="statu.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button icon="el-icon-search" h="40px" w="100px" @click="page=1;getDataFunc()">搜索</m-button>
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
            prop="user_id"
            label="用户ID"
            min-width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="昵称"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="real_name"
            label="姓名"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phone_number"
            label="账户"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bond_doctor.name"
            label="绑定医生"
            min-width="100"
          >
            <!-- <template v-slot="scope">
              <span>{{  getDoctor(scope.row) }}</span>
            </template> -->
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="department.org_name"
            label="所属机构"
            min-width="100"
          >
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
              <span>{{ scope.row.created_at | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="100">
            <template v-slot="scope">
                <el-link v-auth="'patient.delete'" @click="deleteClick(scope.row)">删除账号</el-link>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientList',
  components: {
    
  },
  watch: {
    'form.organization_id'(n) {
      this.form.department_id = ''
      if (n) {
        this.getDepartments()
      } else {
        this.departments = []
      }
    }
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        search: '',
        department_id: '',
        organization_id: '',
        doctor_id: '',
        doctor_name: '',
      },

      // 机构
      organizations: [],
      organizationsTotal: 0,
      organizationsPage: 1,
      organizationsPageSize: 9999,
      departments: [],
      departmentsTotal: 0,
      departmentsPage: 1,
      departmentsPageSize: 9999,
    }
  },
  mounted() {
    this.getDataFunc()
    this.getOrganizations()
  },
  methods: {
    getDoctor(row) {
      if (row.subscriptions && row.subscriptions.length > 0 && row.subscriptions[0].doctor && row.subscriptions[0].doctor.name) {
        return row.subscriptions[0].doctor.name
      }
      return ""
    },
    getDataFunc() {
      this.$refs.table.loadStart()
      this.$api.patients.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: '-user_id',
        search: this.form.search,
        department_id: this.form.department_id,
        organization_id: this.form.organization_id,
        doctor_name: this.form.doctor_name,
      })
        .then((res) => {
          this.$refs.table.loadDone()
          this.tableData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$refs.table.loadDone()
          this.$message.error(JSON.stringify(err))
        })
    },
    getOrganizations() {
      this.$api.organizationManage.getList({
        page: this.organizationsPage,
        page_size: this.organizationsPageSize,
        ordering: 'id',
      })
        .then((res) => {
          this.organizations = res.data.results
          this.organizationsTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    getDepartments() {
      this.$api.departmentManage.getList({
        page: this.departmentsPage,
        page_size: this.departmentsPageSize,
        ordering: 'id',
        organization: this.form.organization_id
      })
        .then((res) => {
          this.departments = res.data.results
          this.departmentsTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    deleteClick(row) {
      this.$confirm(`确定删除账号吗？`, '删除账号', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$api.user.delete(row.user_id)
          .then(res => {
            this.$message.success('删除成功')
            this.getDataFunc()
          })
          .catch((err) => {
            if (err.code === 'protected_error') {
              this.$message.error('删除失败，账号受到保护，无法删除')
            } else {
              this.$message.error(JSON.stringify(err))
            }
          })
      })
    }
  }
}
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
