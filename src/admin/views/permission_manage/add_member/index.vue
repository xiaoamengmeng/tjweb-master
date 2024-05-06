<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'MemberManage'}">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>成员管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加成员</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
          <div class="info-top">
            <div>
                <p>权限组名称</p>
                 <p>{{ permission.name }}</p>
            </div>
          </div>

          <el-form
            class="form-box"
            :model="form"
            ref="form"
            label-position="top"
          >
            <div class="search-bar mt_20">
              <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                      :gutter="20" style="width: 100%; height: 100%">
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">搜索信息</el-row>
                  <el-row>
                    <el-form-item prop="search">
                      <el-input
                        v-model="form.search"
                        placeholder="姓名/账号"
                        clearable
                      ></el-input>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="4">
                  <el-row class="label-t">人员类型</el-row>
                  <el-row>
                    <el-form-item prop="users__role_id">
                      <el-select
                        v-model="form.users__role_id"
                        placeholder="全部"
                        clearable
                      >
                        <el-option
                          v-for="role in roles"
                          :key="role.code"
                          :label="role.label"
                          :value="role.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">所属机构</el-row>
                  <el-row>
                    <el-form-item prop="department__organization">
                      <el-select
                        v-model="form.department__organization"
                        placeholder="全部"
                        clearable
                      >
                        <el-option
                          v-for="role in organizations"
                          :key="role.id"
                          :label="role.name"
                          :value="role.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">所属部门</el-row>
                  <el-row>
                    <el-form-item prop="department">
                      <el-select
                        v-model="form.department"
                        placeholder="全部"
                        clearable
                      >
                        <el-option
                          v-for="role in departments"
                          :key="role.id"
                          :label="role.name"
                          :value="role.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col class="search-bar-col" :span="6">
                  <el-row class="label-t">&nbsp;</el-row>
                  <el-row>
                    <m-button icon="el-icon-search" h="40px" w="100px" @click="getDataFunc">搜索</m-button>
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
            :height="'calc(100vh - 450px)'"
            :get-data-func="getDataFunc"
            @selection-change="handleSelectionChange"
            >
            <el-table-column
              type="selection"
              align="center"
              width="100">
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
                min-width="100"
            >
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="users"
                label="人员类型"
                min-width="100"
            >
              <template v-slot="scope">
                <span v-if="scope.row.users && scope.row.users[0]">{{ scope.row.users[0].role_name }}</span>
              </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="id"
                label="所属机构"
                min-width="100"
            >
              <template v-slot="scope">
                <span v-if="scope.row.users && scope.row.users.length > 0">{{ scope.row.users[0].department.org_name }}</span>
                <!-- <span v-if="scope.row.department">{{ scope.row.department.org_name }}</span> -->
              </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="id"
                label="所属部门"
                min-width="100"
            >
              <template v-slot="scope">
                <span v-if="scope.row.users && scope.row.users.length > 0">{{ scope.row.users[0].department.name }}</span>
                <!-- <span v-if="scope.row.department">{{ scope.row.department.name }}</span> -->
              </template>
            </el-table-column>
          </m-table>
          <div class="info_bottom">
              <m-button @click="save">保存</m-button>
              <m-button plain @click="$router.go(-1)">返回</m-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
const localSession = new LocalStore('addManage', true)

export default {
  name: 'AddManage',
  components: {
  },
  watch: {
    'form.department__organization'(n) {
      this.form.department = ''
      if (n) {
        this.getDepartments()
      } else {
        this.departments = []
      }
    }
  },
  computed: {

  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        search: '',
        department: '',
        department__organization: '',
        users__role_id: '',
      },
      permission: {

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

      roles: [],

      selected: [],
    }
  },
  mounted() {
    this.initForm()
    this.getDataFunc()
    this.getRoles()
    this.getOrganizations()
  },
  methods: {
    handleSelectionChange(val) {
      this.selected = val
    },
    getDataFunc() {
      this.$refs.table.loadStart()
      this.$api.accounts.getNoneGroupList({
        page: this.page,
        page_size: this.pageSize,
        department: this.form.department,
        department__organization: this.form.department__organization,
        ordering: 'id',
        search: this.form.search,
        users__role_id: this.form.users__role_id,
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
        organization: this.form.department__organization
      })
        .then((res) => {
          this.departments = res.data.results
          this.departmentsTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    getRoles() {
      this.roles = this.$dict.personnelType.data
      // this.$api.roles.getList({ ordering: 'id' })
      //   .then((res) => {
      //     // this.roles = res.data.results
      //   })
      //   .catch((err) => {
      //     this.$message.error(JSON.stringify(err))
      //   })
    },
    initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', params)
      }
      this.permission = data
    },
    save() {

      if (this.selected.length <= 0) {
        this.$message.error('请选择添加的账户')
        return
      }

      this.$api.accounts.joinGroup({
        ids: this.selected.map(ele => ele.id),
        group_id: this.permission.id
      }).then((res) => {
          this.$message.success('添加成功')
          this.form.page = 1
          this.getDataFunc()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    leavePage() {
      this.$router.go(-1)
    },
  }, // methods end
}
</script>

<style scoped lang="less">

.m-table {
  height: calc(100% - 50px);
}

.panel {
  .card {
    position: relative;
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

.info-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 20px;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 30px;

      p {
          font-size: 14px;
      }
    }

    div p:first-child {
    font-weight: 700;
    }

    div p:last-child {
    margin-left: 10px;
    }
}

.info_bottom {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    bottom: 12px;
}

</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
