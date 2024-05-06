<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <icon-box icon-name="menu_blbgmb" w="20" h="20" box-w="20" box-h="90"></icon-box>
      <el-breadcrumb-item>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/medical'}">
        <b>病历报告模板</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="form"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-form-item label="分类" prop="product">
            <el-select
              v-model="form.record_type"
              placeholder="请选择"
              clearable
              style="width: 450px;"
              disabled
            >
              <el-option
                v-for="product in MEDICAL_RECORD_TYPE"
                :key="product.code"
                :label="product.label"
                :value="product.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.is_enabled">
              <!--              <el-radio-->
              <!--                v-for="status in STATUS_PROJECT"-->
              <!--                :key="status.code"-->
              <!--                :label="status.code"-->
              <!--              >{{ status.label }}-->
              <!--              </el-radio>-->
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
            <m-button h="40px" class="add-field-btn" @click="addFieleItem">插入</m-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字段注释">
            <div class="mt_20">
              <el-descriptions title="" :column="1" border>
                <el-descriptions-item>
                  <template slot="label">
                    <span class="fontsize_16 font_bold p_10">字段名称</span>
                  </template>
                  <span class="fontsize_16 font_bold">操作</span>
                </el-descriptions-item>
                <el-descriptions-item
                  v-for="(field, index) in form.fields"
                  :key="'fieldItem' + index"
                >
                  <template slot="label">
                    <el-input v-model="form.fields[index]" placeholder="点击后输入"></el-input>
                  </template>
                  <template>
                    <el-link @click="deleteFieldItem(index)">删除</el-link>
                  </template>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <m-button @click="save">保存</m-button>
            <m-button plain @click="$router.go(-1)">返回</m-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { MEDICAL_RECORD_TYPE } from '@/common/utils/dict'

const localSession = new LocalStore('SetMedical', true)

export default {
  name: 'SetMedical',
  data() {
    return {
      type: 'create',
      title: '创建报告模板',
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        record_type: '',
        fields: [],
        is_enabled: true,
      },
      rules: {},
      recordInfo: {}
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
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', { type: params.type, id: params.id })
      }
      this.type = data.type || 'create'
      this.title = this.type === 'create' ? '创建报告模板' : '编辑报告模板'

      if (this.type === 'create') {
        Object.assign(this.$data.form, this.$options.data().form)
      } else {
        this.$api.medicalRecordTemps.getDetail(data.id)
          .then((res) => {
            this.recordInfo = this.$clone(res.data)
            this.form.compareAssign(res.data)
          })
      }
    },
    save() {
      const fields = this.form.fields
      if(fields.some(item => item === '')) {
        return this.$message.error('存在有空字段，请补充完整后再进行保存')
      }
      this.$api.medicalRecordTemps.update(this.recordInfo.id, this.form)
        .then((res) => {
          this.$message.success('编辑成功')
          this.$router.go(-1)
        })
        .catch((err) => {
       this.$message.error(JSON.stringify(err))
        })
    },
    deleteFieldItem(index) {
      this.form.fields.splice(index, 1)
    },
    addFieleItem() {
      this.form.fields.push('')
    }
  }, // methods end
  computed: {
    MEDICAL_RECORD_TYPE() {
      return MEDICAL_RECORD_TYPE
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
  margin-left: 40px;
  //.el-form-item {
  //  width: 100%;
  //  .el-input {
  //    width: 100%;
  //  }
  //  .el-select {
  //    width: 100%;
  //  }
  //}
  :deep(.el-form-item__label) {
  }

  :deep(.el-form-item__content) {
    line-height: 48px;
    position: relative;
    left: 10px;
  }
  .el-select {
    :deep(.el-input__inner) {
      color: #606266 !important;
      cursor: default;
    }
  }
}

.el-descriptions .el-link:hover, .el-descriptions .el-link:focus {
  color: @primaryColor;
  border-color: @primaryColor !important;
}

.el-descriptions {
  position: relative;
  top: -20px;

  :deep(.el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label) {
    //background-color: #f4f5fa !important;
    background-color: #fff;
    padding: 0;
    width: 70%;

    .el-input__inner {
      border: none !important;
      border-radius: 0;
      //background-color: #f4f5fa !important;
      background-color: #fff;
    }
  }

  :deep(.el-descriptions-item__cell.el-descriptions-item__content) {
    //background-color: #f4f5fa !important;
  }

  :deep(.el-descriptions__table.is-bordered) {
    tbody:first-child {
      background-color: #f4f5fa !important;

      .el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label {
        background-color: #f4f5fa !important;
      }
    }
  }
}

.add-field-btn {
  float: right;
  position: relative;
  top: 20px;
}
</style>
