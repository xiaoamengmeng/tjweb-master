<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/exercise_calorie'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>运动热量表</b>
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
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入项目名称" clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目强度" prop="intensity">
            <el-input v-model="form.intensity" placeholder="请输入强度值（METs）" clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目简介" prop="summary">
            <el-input type="textarea" v-model="form.summary" placeholder="请输入项目简介" :rows="4"
                      style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="status in STATUS_EXERCISE"
                :key="status.code"
                :label="status.code"
              >{{ status.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item>
          <m-button @click="save">保存</m-button>
          <m-button plain @click="leavePage">返回</m-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { PRODUCT, PROJECT_TYPE, STATUS_PROJECT, STATUS_EXERCISE } from '@/common/utils/dict'

const localSession = new LocalStore('setExercise', true)

export default {
  name: 'SetExercise',
  data() {
    const validIntensity = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请输入项目强度'))
      }
      if (!isFinite(value)) {
        callback(new Error('强度值只能是数字'))
      }
      callback()
    }
    return {
      type: 'create',
      title: '新增运动项目',
      form: {
        name: '',
        intensity: '',
        summary: '',
        status: ''
      },
      uploadFile: {
        fileList: [],
        action: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'change' },
        ],
        intensity: [
          { required: true, validator: validIntensity, trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        summary: [
          { required: true, message: '请输入项目简介', trigger: 'change' },
        ],
      },
    }
  },
  mounted() {
    this.initForm()
    this.$nextTick(() => {
      this.$refs.form.clearValidate()
    })
  },
  methods: {
    initForm() {
      const params = this.$route.params
      let data = params
      this.form = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', params)
      }

      this.type = data.type || 'create'
      this.title = this.type === 'create' ? '新增运动项目' : '修改运动项目'
      if (data.type === 'create') {
        return
      }

      this.form = data
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
      this.$api.exercise.create({
        ...this.form,
      })
        .then(res => {
          this.$message.success('新增成功')
          this.leavePage()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    update() {
      this.$api.exercise.update(this.form.id, {
        ...this.form,
      })
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
    }
  }, // methods end
  computed: {
    PRODUCT() {
      return PRODUCT
    },
    PROJECT_TYPE() {
      return PROJECT_TYPE
    },
    STATUS_PROJECT() {
      return STATUS_PROJECT
    },
    STATUS_EXERCISE() {
      return STATUS_EXERCISE
    }
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
</style>
