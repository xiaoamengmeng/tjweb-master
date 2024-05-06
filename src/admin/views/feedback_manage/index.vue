<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>举报及意见反馈</b>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
        <el-form class="form-box" :model="form" :rules="rules" ref="form" label-position="top">
          <div class="search-bar mt_20">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle" :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="4">
                <el-row class="label-t">人员类型</el-row>
                <el-row>
                  <el-form-item prop="user__role_id">
                    <el-select v-model="form.user__role_id" placeholder="全部" clearable>
                      <el-option v-for="role in roles" :key="role.code" :label="role.label" :value="role.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col class="search-bar-col" :span="4">
                <el-row class="label-t">反馈人</el-row>
                <el-row>
                  <el-form-item prop="search">
                    <el-input v-model="form.user__name" placeholder="请输入" clearable></el-input>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">所属机构</el-row>
                <el-row>
                  <el-form-item prop="department__organization">
                    <el-select v-model="form.department__organization" placeholder="全部" clearable>
                      <el-option v-for="role in organizations" :key="role.id" :label="role.name" :value="role.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">所属部门</el-row>
                <el-row>
                  <el-form-item prop="department">
                    <el-select v-model="form.department" placeholder="全部" clearable>
                      <el-option v-for="role in departments" :key="role.id" :label="role.name" :value="role.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="9">
                <el-row class="label-t">反馈时间</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-date-picker v-model="form.range" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="4">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button
                    icon="el-icon-search"
                    h="40px"
                    w="100px"
                    @click="
                      page = 1
                      getDataFunc()
                    "
                    >搜索</m-button
                  >
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table class="m-table" ref="table" :data="tableData" :total="total" :page-sizes="[10, 15, 20]" :page-size.sync="pageSize" :current-page.sync="page" :height="'calc(100% - 8px - 15px - 15px - 60px)'" :get-data-func="getDataFunc">
          <el-table-column show-overflow-tooltip prop="user_role_name" label="反馈人角色" min-width="100"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="user_name" label="姓名" min-width="100"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="organization" label="所属机构" min-width="150"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="department" label="所属部门" min-width="150"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="content" label="反馈内容" min-width="180"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="image" label="图片" min-width="120">
            <template v-slot="scope">
              <el-image v-if="scope.row.image" :src="scope.row.image" style="width: 100px; height: 100px" fit="cover" :preview-src-list="[scope.row.image]"></el-image>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="created_at" label="反馈时间" min-width="150">
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'Feedback',
  data() {
    return {
      visible: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        department: '',
        department__organization: '',
        is_active: '',
        search: '',
        user__role_id: '',
        user__name: '',
        range: [],
      },
      passwordForm: {
        password: '',
      },
      passwordRules: {
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
      },
      rules: {},
      current: {},
      dialogVisible: false,
      dialogTitle: '修改密码',
      roleVisible: false,
      roleTitle: '修改角色',
      roles: [],
      roleForm: {
        roles: [],
      },
      currAccount: {},
      userStatus: [],

      // 机构
      organizations: [],
      organizationsTotal: 0,
      organizationsPage: 1,
      organizationsPageSize: 9999,
      departments: [],
      departmentsTotal: 0,
      departmentsPage: 1,
      departmentsPageSize: 9999,

      consultationList: [],
      isSelectedConsultation: null,
      canEdit: false,
    }
  },
  mounted() {
    this.getOrganizations()
    this.getDataFunc()
    this.getDepartments()
    this.getRoles()
  },
  methods: {
    focusMenu() {
      this.$nextTick(() => {
        const element = document.querySelector('li.el-menu-item[index="/account"]')
        if (element) element.click()
      })
    },
    getDataFunc() {
      this.$refs.table.loadStart()

      let params = {
        page: this.page,
        page_size: this.pageSize,
        user__department: this.form.department,
        user__department__organization: this.form.department__organization,
        ordering: '-id',
        search: this.form.search,
        user__role_id: this.form.user__role_id,
        user__name: this.form.user__name,
      }
      if (this.form.range && this.form.range != '') {
        params.created_at__gte = dayjs(this.form.range[0]).format()
        params.created_at__lte = dayjs(this.form.range[1]).format()
      }
      this.$api.feedbacks
        .getList(params)
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
      this.$api.organizationManage
        .getList({
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
      this.$api.departmentManage
        .getList({
          page: this.departmentsPage,
          page_size: this.departmentsPageSize,
          ordering: 'id',
          organization: this.form.department__organization,
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
    },

    getConsultationList() {
      this.$api.accounts
        .getList({
          page: 1,
          page_size: 9999,
          department__organization: 1,
          ordering: '-id',
          is_active: true,
          users__role_id__in: 'ld,rd',
        })
        .then((res) => {
          this.consultationList = res.data.results
          const select = res.data.results.find((ele) => ele.is_access)
          this.isSelectedConsultation = select ? select.id : null
          this.visible = true
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
  },
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
