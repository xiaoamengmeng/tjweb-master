<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'DepartmentManage'}">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>部门管理</b>
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
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入部门名称" clearable style="width: 450px;" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="form.contact" placeholder="请输入联系人姓名" clearable style="width: 450px;"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="联系方式" prop="contact_details">
                    <el-input v-model="form.contact_details" placeholder="请输入联系方式" clearable style="width: 450px;"></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-form-item label="状态" prop="is_active">
                    <el-radio-group v-model="form.is_active">
                        <el-radio
                            v-for="status in ORGANIZATION_MANAGE_STATUS"
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
import { ORGANIZATION_MANAGE_STATUS } from '@/common/utils/dict'

const localSession = new LocalStore('SetDepartment', true)

export default {
  name: 'SetDepartment',
  components: {
  },
  data() {
    const validPhone = (rule, value, callback) => {
      if (!this.$valid.phone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      type: 'create',
      title: '新增部门',
      form: {
        is_active: true,
        name: '',
        contact: '',
        contact_details: '',
        organization_id: '',
      },
      accountInfo: {},
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'change' }],
        // contact_details: [{ required: true, validator: validPhone, trigger: 'change' }],
        organization_id: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
        // contact: [{ required: true, message: '请填写联系人', trigger: 'change' }],
      },
      organizations: [],
      organizationsTotal: 0,
      organizationsPage: 1,
      organizationsPageSize: 99999,
    }
  },
  mounted() {
    this.initForm()
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
      this.title = this.type === 'create' ? '新增部门' : '修改部门'

      // 新增
      if (data.type === 'create') {
        return
      }

      this.form.compareAssign(data)
      this.form.organization_id = data.organization.id
    },

    getOrganizations() {
      this.$api.organizationManage.getList({
        page: this.organizationsPage,
        page_size: this.organizationsPageSize,
        is_active: true,
        ordering: "created_at"
      })
        .then((res) => {
            this.organizationsTotal = res.data.count
            this.organizations = res.data.results
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
      const params = { ...this.form, }
      this.$api.departmentManage.create(params)
        .then(res => {
          this.$message.success('新增部门成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map(item => item.detail).join('')))
          } else {
            this.$message.error(JSON.stringify(err.detail))
          }
        })
    },
    update() {
      const params = { ...this.form }
      this.$api.departmentManage.update(this.accountInfo.id, params)
        .then(res => {
          this.$message.success('修改成功')
          this.leavePage()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    leavePage() {
      this.$router.go(-1)
    },

  }, // methods end
  computed: {
    ORGANIZATION_MANAGE_STATUS() {
      return ORGANIZATION_MANAGE_STATUS
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

    .add-image-content {

      display: flex;
      flex-direction: row;
      align-items: center;

      .add-image {
          width: 450px; 
          height: 48px; 
          border: 1px solid #D9E1EC !important; 
          border-radius: 12px !important;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-left: 12px;


          
          // .el-button {
          //     background: ;
          // }

      }

      .add-image-select {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .add-image-delete {
          position: absolute;
          top: 0;
          right: 0;
          color: #ffffff;
      }

    }



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

.close-btn {
  display: none;
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 11;
  cursor: pointer;
  font-weight: bold;
  padding: 4px;
  color: #fff;
  background-color: #000;
  opacity: .3;
  border-radius: 50%;
  font-size: 12px;
}

.image-wrapper:hover .close-btn {
  //visibility: visible;
  display: block;
}

</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
