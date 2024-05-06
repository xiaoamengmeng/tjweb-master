<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/service_right'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>服务权益</b>
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
          <el-form-item label="图标" prop="icon_path">
            <m-upload
              class="upload-box"
              :image-url.sync="form.icon"
              :image-path.sync="form.icon_path"
              accept=".jpg,.jpeg,.png,.gif"
              success-tips="上传图片成功"
            ></m-upload>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="权益名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入权益名称" clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="权益次数" prop="count">
            <el-input
              v-model="form.count"
              placeholder="请输入权益次数"
              clearable
              style="width: 450px;"
              oninput="value=value.replace(/[^\d.]/g,'')"
            ></el-input>
            <span style="margin-left: 10px"> </span>
            <el-checkbox v-model="form.is_unlimited">不限次数</el-checkbox>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="权益说明">
            <el-input
              type="textarea"
              v-model="form.description"
              placeholder="请输入权益说明"
              maxlength="100"
              show-word-limit
              rows="5"
              resize="none"
              clearable style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="权益状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="status in STATUS_SOLUTION"
                :key="status.code"
                :label="status.code"
              >{{ status.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
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
import { STATUS_SOLUTION } from '@/common/utils/dict'
import LocalStore from '@/common/utils/LocalStore'

const dishSession = new LocalStore('SetServiceRights', true)

export default {
  name: 'SetServiceRights',
  data() {
    const validCount = (rule, value, callback) => {
      if (this.form.is_unlimited === false && !this.form.count) {
        callback(new Error('请输入权益次数'))
      }
      callback()
    }
    return {
      type: 'create',
      title: '新建服务权益',
      form: {
        id: '',
        name: '',
        description: '',
        count: 999,
        status: '',
        icon: '',
        icon_path: '',
        is_unlimited: false
      },
      dishInfo: {},
      checked: true,
      rules: {
        name: [
          { required: true, message: '请输入权益名', trigger: 'change' },
        ],
        count: [
          { required: true, validator: validCount, message: '请输入权益次数', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请输入选择权益状态', trigger: 'change' },
        ],
        icon_path: [
          { required: true, message: '请选择权益图标', trigger: 'change' },
        ]
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
        const cache = dishSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        dishSession.set('cache', params)
      }

      this.dishInfo = data
      this.type = data.type || ''
      this.title = this.type === 'create' ? '新建服务权益' : '修改服务权益'
      if (data.type === 'create') {
        return
      }
      this.form.compareAssign(data)
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
      this.$api.serviceRights.create(this.form)
        .then(res => {
          this.$message.success('新增成功')
          this.leavePage()
        })
    },
    update() {
      this.$api.serviceRights.update(this.form.id, this.form)
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
    STATUS_SOLUTION() {
      return STATUS_SOLUTION
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

.form-box {
  width: 850px;
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
  height: 120px;
  width: 120px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
  }
}
</style>
