<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{ path: '/project' }">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>项目管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="card-title">
        {{ title }}
      </div>
      <el-form class="form-box" :model="form" :rules="rules" ref="form" label-position="top">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="所属机构" prop="organization">
              <el-input disabled v-model="form.organization" placeholder="请输入项目名称" clearable style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-input disabled v-model="form.department" placeholder="请输入项目名称" clearable style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品" prop="product">
              <el-select v-model="form.product" placeholder="请选择" clearable style="width: 100%">
                <el-option v-for="product in PRODUCT" :key="product.code" :label="product.label" :value="product.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入项目名称" clearable style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目开始时间" prop="start_date">
              <el-date-picker v-model="form.start_date" type="date" placeholder="开始日期" value-format="yyyy-MM-dd" clearable style="width: 100%"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目结束时间" prop="end_date">
              <el-date-picker v-model="form.end_date" type="date" placeholder="结束日期" value-format="yyyy-MM-dd" clearable style="width: 100%"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务人群" prop="target">
              <el-input v-model="form.target" style="width: 100%" placeholder="请输入服务人群"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务周期" prop="service_days">
              <el-input v-model="form.service_days" style="width: 100%" placeholder="请输入服务周期（天）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目类型" prop="project_type">
              <el-select v-model="form.project_type" placeholder="请选择" clearable style="width: 100%">
                <el-option v-for="type in PROJECT_TYPE" :key="type.code" :label="type.label" :value="type.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目阶段" prop="stage">
              <el-input v-model="form.stage" placeholder="不同阶段之间用逗号隔开 例如:置入期,过渡期,稳定期" clearable style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="status in STATUS_PROJECT" :key="status.code" :label="status.code">{{ status.label }} </el-radio>
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
import { PRODUCT, PROJECT_TYPE, STATUS_PROJECT } from '@/common/utils/dict'
import { mapGetters } from 'vuex'

const projectSession = new LocalStore('setProject', true)

export default {
  name: 'SetProject',
  data() {
    const validStartDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择项目开始时间'))
      }
      callback()
    }
    const validEndDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择项目结束时间'))
      }
      if (this.form.start_date && new Date(this.form.end_date) < new Date(this.form.start_date)) {
        callback(new Error('结束时间不能小于开始时间'))
      }
      callback()
    }
    return {
      type: 'create',
      title: '新增项目',
      form: {
        product: '',
        name: '',
        start_date: '',
        end_date: '',
        target: '',
        service_days: '',
        project_type: PROJECT_TYPE[0].code,
        stage: '',
        status: STATUS_PROJECT[0].code,
        department: '',
        organization: '',
      },
      projectInfo: {},
      presetType: ['上市', '临床试验'],
      rules: {
        product: [{ required: true, message: '请选择产品', trigger: 'change' }],
        name: [{ min: 1, max: 50, required: true, message: '请输入项目名称', trigger: 'blur' }],
        start_date: [
          {
            required: true,
            trigger: 'blur',
            validator: validStartDate,
          },
        ],
        end_date: [
          {
            required: true,
            trigger: 'blur',
            validator: validEndDate,
          },
        ],
        target: [{ required: true, message: '请输入服务人群', trigger: 'blur' }],
        service_days: [{ required: true, message: '请输入服务周期', trigger: 'blur' }],
        project_type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        stage: [{ min: 1, max: 50, required: true, message: '请输入项目阶段', trigger: 'blur' }],
        status: [{ required: true, trigger: 'blur' }],
        organization: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
        department: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
      },
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      const params = this.$route.params

      let data = params
      if (Object.keys(params).length === 0) {
        const cache = projectSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        projectSession.set('cache', params)
      }

      this.projectInfo = data
      this.type = data.type || ''
      this.title = this.type === 'create' ? '新增项目' : '修改项目'

      this.form.organization = this.userInfo.selectedOrganization.name
      this.form.department = this.userInfo.selectedDepartment.name

      if (data.type === 'create') {
        return
      }

      this.form = data
      if (data.stage) {
        // 英文逗号和中文逗号都转为英文逗号
        this.form.stage = data.stage.join(',')
      }

      if (data.dpt) {
        this.form.organization = data.dpt.org_name
        this.form.department = data.dpt.name
      }
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
      this.$api.project
        .create({
          ...this.form,
          dpt_id: this.userInfo.selectedDepartment.id,
          // 英文逗号和中文逗号都转为英文逗号
          stage: this.form.stage.replaceAll(/[,，]/gi, ',').split(','),
        })
        .then((res) => {
          this.$message.success('新增成功')
          this.leavePage()
        })
    },
    update() {
      this.$api.project
        .update(this.form.id, {
          ...this.form,
          dpt_id: this.projectInfo.dpt.id,
          // 英文逗号和中文逗号都转为英文逗号
          stage: this.form.stage.replaceAll(/[,，]/gi, ',').split(','),
        })
        .then((res) => {
          this.$message.success('修改成功')
          this.leavePage()
        })
    },
    leavePage() {
      if (this.type === 'create') {
        this.$router.push('/project')
      } else {
        this.$router.push(`/project`)
      }
    },
  }, // methods end
  computed: {
    ...mapGetters(['userInfo']),
    PRODUCT() {
      return PRODUCT
    },
    PROJECT_TYPE() {
      return PROJECT_TYPE
    },
    STATUS_PROJECT() {
      return STATUS_PROJECT
    },
  },
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

.form-box {
  width: 850px;
}
</style>
