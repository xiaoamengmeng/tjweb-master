<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'Account'}">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>管理员管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="card-title">
        {{ title }}
      </div>
      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="form"
        label-position="top"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" clearable style="width: 450px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="username">
              <el-input :disabled="this.type != 'create'" v-model="form.username" placeholder="请输入注册账号（仅支持手机号）" clearable
                        style="width: 450px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="organization_id">
              <el-select
                v-model="form.organization_id"
                placeholder="请选择所属机构"
                clearable
                style="width: 450px;"
              >
                <el-option
                  v-for="statu in organizations"
                  :key="statu.id"
                  :label="statu.name"
                  :value="statu.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department_id">
              <el-select
                v-model="form.department_id"
                placeholder="请选择所属部门"
                clearable
                style="width: 450px;"
              >
                <el-option
                  v-for="statu in departments"
                  :key="statu.id"
                  :label="statu.name"
                  :value="statu.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="人员类型" prop="users_role_id">
              <el-select
                v-model="form.users_role_id"
                placeholder="请选择"
                clearable
                style="width: 450px;"
                :disabled="this.type != 'create'"
              >
                <el-option
                  v-for="role in roles"
                  :key="role.code"
                  :label="role.label"
                  :value="role.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="is_active">
              <el-radio-group v-model="form.is_active">
                <el-radio
                  v-for="status in STATUS_USER"
                  :key="status.code"
                  :label="status.code"
                >{{ status.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <m-button @click="save">保存</m-button>
          <m-button plain @click="$router.go(-1)">返回</m-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { STATUS_USER } from '@/common/utils/dict'
import RoleEditor from '../components/RoleEditor'

const localSession = new LocalStore('SetAccount', true)

export default {
  name: 'SetAccount',
  components: {
    RoleEditor,
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!this.$valid.phone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }

    // {
    //   "username": "14025593570",
    //   "name": "string",
    //   "phone": "14986304410",
    //   "users": [
    //     {
    //       "name": "string",
    //       "role_id": "string",
    //       "sex": "M",
    //       "is_active": true
    //     }
    //   ],
    //   "is_active": true,
    //   "department_id": 0
    // }

    return {
      type: 'create',
      title: '新增用户',
      form: {
        name: '',
        username: '',
        phone: '',
        is_active: true,
        roles: [],
        users: [],
        organization_id: '',
        department_id: '',
        users_role_id: '',
      },
      accountInfo: {
        users: [],
      },
      rules: {
        name: [{ required: true, message: '请填写姓名', trigger: 'change' }],
        username: [{ required: true, validator: validPhone, trigger: 'change' }],
        users_role_id: [{ required: true, message: '请选择人员类型', trigger: 'change' }],
        organization_id: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
        department_id: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
      },
      roles: [],
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
  watch: {
    'form.username'(n) {
      this.form.phone = n
    },
    'form.organization_id'(n) {
      this.form.department_id = ''
      if (n) {
        this.getDepartments()
      } else {
        this.departments = []
      }
    }
  },
  mounted() {
    this.initForm()
    this.getRoles()
    this.getOrganizations()
  },
  methods: {
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

      this.accountInfo = data
      this.type = data.type || ''
      this.title = this.type === 'create' ? '新增用户' : '修改用户'

      if (data.type === 'create') {
        return
      }

      this.form.compareAssign(data)
      let user = data.users.find(ele => ele.role_id != "user")
      this.form.organization_id = user.department.org_id
      this.getDepartments()

      // 部门回显
      setTimeout(() => {
        this.form.department_id = user.department.id
      }, 200);
      if (data.users.length > 0) {
        this.form.users_role_id = data.users[0].role_id
        this.form.name = data.users[0].name
      }
    },
    getRoles() {
      this.roles = this.$dict.personnelType.data
    },

    getOrganizations() {
      this.$api.organizationManage.getList({
        page: this.organizationsPage,
        page_size: this.organizationsPageSize,
        ordering: 'id',
        is_active: true,
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
        organization: this.form.organization_id,
        is_active: true,
      })
        .then((res) => {
          this.departments = res.data.results
          this.departmentsTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
            this.create()
          } else {
            this.update()
          }
        } else {
          return false
        }
      })
    },
    create() {
      const params = { ...this.form, password: "123456"}
      const user = this.roles.find((item) => item.code == this.form.users_role_id)
      if (user) {
        params.users = [{
          // name: user.label,
          name: this.form.name,
          role_id: user.code,
          department_id: this.form.department_id
        }]
      } else {
        params.users = []
      }
      delete params.users_role_id

      params.group_id = ''

      this.$api.accounts.create(params)
        .then(res => {
          this.$message.success('新增用户成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(err.list.map(item => item.detail).join(''))
          } else {
            this.$message.error(err.detail)
          }
        })
    },
    update() {
      const params = { ...this.form }
      // const user = this.roles.find((item) => item.code == this.form.users_role_id)
      // if (user) {
      //   params.users = [{
      //     name: user.label,
      //     role_id: user.code,
      //   }]
      // } else {
      //   params.users = []
      // }
      if (this.accountInfo.users.length > 0) {
        params.users = this.accountInfo.users.map(ele => {
          ele.name = this.form.name
          ele.department_id = this.form.department_id
          return ele
        })
      }
      delete params.users_role_id

      params.group_id = this.accountInfo.permission_group ? this.accountInfo.permission_group : ''

      this.$api.accounts.patch(this.accountInfo.id, params)
        .then(res => {
          this.$message.success('修改成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(err.list.map(item => item.detail).join(''))
          } else {
            this.$message.error(err.detail)
          }
        })
    },
    leavePage() {
      this.$router.go(-1)
    },

  }, // methods end
  computed: {
    STATUS_USER() {
      return STATUS_USER
    }
  },
}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px);
  }
}

.form-box {
  width: 100%;
  //.el-form-item {
  //  width: 100%;
  //  .el-input {
  //    width: 100%;
  //  }
  //  .el-select {
  //    width: 100%;
  //  }
  //}
}

.upload-box {
  height: 150px;
  width: 150px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }
  
}

.roles-select {
  :deep(.el-input__suffix) {
    display: none;
  }
}

.role-editor {
  :deep(.el-select.roles-select) {
    width: 450px !important;
    .el-select__tags {
      max-width: unset !important;
    }
  }
}
</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
