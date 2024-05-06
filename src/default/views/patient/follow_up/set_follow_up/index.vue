<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{ path: '/patient' }">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/patient_detail/${ppid}` }">
        <b>患者详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" v-loading="pageLoading">
      <div class="card-title">
        {{ title }}
      </div>
      <el-form class="form-box" :model="form" :rules="followIsSameOrAfter ? rulesTimeAfter : rulesTimeBefore" ref="form" label-position="top">
        <el-row>
          <el-divider></el-divider>
          <div class="list-title">患者基本信息</div>
        </el-row>
        <el-row class="mb_20">
          <span class="left" style="color: #566085">姓名：{{ ppInfo.patient.name }}</span>
          <span class="left ml_20" style="color: #566085">性别：{{ ppInfo.patient.sex | sexText }}</span>
          <span class="left ml_20" style="color: #566085">出生日期：{{ ppInfo.patient.user_profile.birthday | dateFormatCN }}</span>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="随访方式" prop="follow_up_type">
              <el-select :disabled="isDisabled" v-model="form.follow_up_type">
                <el-option label="电话" value="phone"></el-option>
                <el-option label="微信" value="wechat"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="随访时间" prop="follow_up_time">
              <el-date-picker :disabled="isDisabled" type="datetime" disabledDate :picker-options="pickerFollowOptions" v-model="form.follow_up_time" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" style="width: 350px" @change="followTimeChange"> </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="isShowFollowInfo">
          <el-row>
            <el-divider></el-divider>
            <div class="list-title">随访信息</div>
          </el-row>
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item label="随访项目">
                <el-input class="border-unset" readonly v-model="ppInfo.project.name" style="width: 100%" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="阶段" prop="project_stage">
                <el-select :disabled="isDisabled" v-model="form.project_stage" placeholder="请选择" clearable style="width: 200px">
                  <el-option v-for="(item, index) in ppInfo.project.stage" :key="index" :value="item" :label="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收缩压" prop="systolic_pressure">
                <el-input :disabled="isDisabled" v-model="form.systolic_pressure" placeholder="请输入" clearable style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="舒张压" prop="diastolic_pressure">
                <el-input :disabled="isDisabled" v-model="form.diastolic_pressure" placeholder="请输入" clearable style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="体重" prop="weight">
                <el-input :disabled="isDisabled" v-model="form.weight" style="width: 100%" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="腰围" prop="waistline">
                <el-input :disabled="isDisabled" v-model="form.waistline" placeholder="请输入" clearable style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="血糖" prop="blood_sugar">
                <el-input :disabled="isDisabled" v-model="form.blood_sugar" placeholder="请输入" clearable style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="不良反应记录" prop="info_adverse_reaction">
                <el-select :disabled="isDisabled" class="adverse" style="width: 100%" v-model="form.info_adverse_reaction" multiple filterable allow-create default-first-option placeholder="请输入内容">
                  <el-option v-for="item in followUpAdverseType" :key="item.code" :label="item.label" :value="item.label"> </el-option>
                </el-select>
              </el-form-item>
              <div style="color: #999999; font-size: 12px; margin-top: -16px">如果没有症状选项，可在输入框中输入，键盘输入Enter</div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="随访服务记录" prop="info">
                <el-input :disabled="isDisabled" type="textarea" :rows="4" resize="none" placeholder="请输入内容" v-model="form.info"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-form-item>
          <template v-if="type == 'view'">
            <m-button @click="save" v-if="isCanEdit">保存</m-button>
            <m-button @click="setCanEdit" v-else>编辑</m-button>
          </template>
          <template v-else>
            <m-button @click="save">保存</m-button>
          </template>
          <m-button plain @click="$router.go(-1)">返回</m-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('PatientSetFollowUp', true)

export default {
  name: 'PatientSetFollowUp',
  data() {
    return {
      type: 'create',
      title: '新建随访项目',
      form: {
        name: '',
        project_patient: 0,
        status: 'pending',
        follow_up_type: 'phone',
        follow_up_time: '',
        project_stage: '',
        weight: '',
        waistline: '',
        blood_sugar: '',
        info_adverse_reaction: [],
        info: '',
        systolic_pressure: '',
        diastolic_pressure: '',
      },
      // 随访时间小于现在的日期，则为必填项
      rulesTimeBefore: {
        name: [{ required: true }],
        follow_up_type: [{ required: true, message: '请选择随访方式', trigger: 'change' }],
        follow_up_time: [{ required: true, trigger: 'change', validator: this.validateFollow_up_time }],
        project_stage: [{ required: true, message: '请选择阶段', trigger: 'change' }],
        weight: [{ required: true, message: '请输入体重', trigger: 'change' }],
        // waistline: [{ required: true, message: '请输入腰围', trigger: 'change' }],
      },
      // 随访时间小于等于现在的日期，则为可选项
      rulesTimeAfter: {
        name: [{ required: true }],
        follow_up_type: [{ required: true, message: '请选择随访方式', trigger: 'change' }],
        follow_up_time: [{ required: true, trigger: 'change', validator: this.validateFollow_up_time }],
        project_stage: [{ required: true, message: '请选择阶段', trigger: 'change' }],
        weight: [{ required: false, message: '请输入体重', trigger: 'change' }],
        waistline: [{ required: false, message: '请输入腰围', trigger: 'change' }],
        blood_sugar: [{ required: false, message: '请输入血糖', trigger: 'change' }],
      },

      ppInfo: {
        patient: {
          user_profile: {},
        },
        project: {},
      },
      ppid: '', // 项目患者id
      projectId: '', // 项目id
      userId: '', // 患者id
      stage: '',
      followId: '',
      createMethod: '', //创建方式
      pageLoading: true,
      followUpAdverseType: [],
      pickerFollowOptions: {
        disabledDate: (date) => {
          if (this.type == 'create') {
            if (this.createMethod == 'create') {
              return this.$Day(date).isBefore(this.$day.format('YYYY-MM-DD'))
            } else if (this.createMethod == 'additional') {
              return date.getTime() - 8.64e7 > Date.now() - 24 * 60 * 60 * 1000
            }
          } else if (this.type == 'edit') {
            return false
          } else if (this.type == 'view') {
            return date.getTime() - 8.64e7 > Date.now() - 24 * 60 * 60 * 1000
          }
        },
      },
      importType: '',
      isCanEdit: false,
    }
  },

  watch: {},
  mounted() {
    const params = this.$route.params
    let data = params
    if (Object.keys(params).length === 0) {
      const cache = localSession.get('cache')
      if (!cache) return
      data = cache
    } else {
      localSession.set('cache', {
        type: params.type,
        projectId: params.projectId,
        ppid: params.ppid,
        userId: params.userId,
        stage: params.stage,
        followId: params.followId,
        createMethod: params.createMethod,
        importType: params?.importType || '',
      })
    }

    this.type = data.type
    this.title = this.type === 'create' ? '新建随访项目' : this.type === 'edit' ? '编辑随访' : '查看随访'
    this.projectId = data.projectId
    this.createMethod = data.createMethod

    this.ppid = data.ppid
    this.importType = data.importType
    this.userId = data.userId
    this.stage = data.stage
    this.followId = data.followId
    this.form.project_patient = this.ppid

    this.pageLoading = true
    this.getPpInfo()
    this.getFollowUpAdverseType()
  },
  methods: {
    setCanEdit() {
      this.isCanEdit = true
    },
    validateFollow_up_time(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择随访时间'))
        return
      }
      if (this.type == 'create') {
        if (this.createMethod == 'create') {
          if (this.$Day(value).isBefore(this.$day)) {
            callback(new Error('随访时间必须大于当前时间'))
            return
          }
        } else if (this.createMethod == 'additional') {
          if (this.$Day(value).isAfter(this.$day)) {
            callback(new Error('随访时间必须小于当前时间'))
            return
          }
        }
      } else if (this.type == 'edit') {
      } else if (this.type == 'view') {
        if (this.$Day(value).isAfter(this.$day)) {
          callback(new Error('随访时间必须小于当前时间'))
          return
        }
      }
      callback()

      // console.log(value)
      // if (value === '') {
      //   callback(new Error('请输入密码'))
      // } else {
      //   if (this.ruleForm.checkPass !== '') {
      //     this.$refs.ruleForm.validateField('checkPass')
      //   }
      // }
    },
    getFollowUpAdverseType() {
      this.followUpAdverseType = this.$dict.followUpAdverseType.data
    },
    ppInfoLoadDone() {
      if (this.type === 'create') {
        this.form.name = this.ppInfo.patient.name
        this.form.project_stage = this.ppInfo.stage
        this.pageLoading = false
      } else {
        this.$api.ppFollowUps
          .getDetail(this.followId)
          .then((res) => {
            this.pageLoading = false
            const info = res.data
            this.form = {
              name: info.patient_name,
              project_patient: this.ppid,
              status: info.status,
              follow_up_type: info.follow_up_type,
              follow_up_time: this.$Day(info.follow_up_time).format('YYYY-MM-DD HH:mm'),
              project_stage: info.project_stage,
              weight: info.weight,
              systolic_pressure: info.systolic_pressure,
              diastolic_pressure: info.diastolic_pressure,
              waistline: info.waistline,
              blood_sugar: info.blood_sugar,
              info_adverse_reaction: info.info_adverse_reaction,
              info: info.info,
            }
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })
      }
    },
    getPpInfo() {
      this.$api.myProjectPatient
        .getDetail(this.ppid)
        .then((res) => {
          this.ppInfo = res.data
          this.ppInfoLoadDone()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 随访时间大于现在时间，保存状态为未完成
          // 随访时间小于现在时间，保存状态为已完成
          // pending: 待完成, finished: 已完成
          if (this.followIsSameOrAfter) {
            this.form.status = 'pending'
          } else {
            this.form.status = 'finished'
          }
          let form = {}
          Object.keys(this.form).forEach((key) => {
            if (this.form[key]) {
              form[key] = this.form[key]
            }
          })
          if (this.type == 'create') {
            this.$api.ppFollowUps
              .create(form)
              .then((res) => {
                this.$message.success('新增随访成功')
                this.$router.push({
                  name: 'PatientFollowUp',
                  params: {
                    ppid: this.ppid,
                  },
                })
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err))
              })
          } else {
            this.$api.ppFollowUps
              .update(this.followId, form)
              .then((res) => {
                this.$message.success('编辑随访成功')
                if (this.importType == 'todo_task') {
                  this.leavePage()
                } else {
                  this.$router.push({
                    name: 'PatientFollowUp',
                    params: {
                      ppid: this.ppid,
                    },
                  })
                }
              })
              .catch((err) => {
                this.$message.error(JSON.stringify(err))
              })
          }
        }
      })
    },
    followTimeChange() {
      // this.$refs.form.clearValidate()
    },
    leavePage() {
      this.$router.go(-1)
    },

    disabledDate(date) {
      console.log(date)
    },
  }, // methods end
  computed: {
    followIsSameOrAfter() {
      const selectTime = this.form.follow_up_time
      if (selectTime === '' || selectTime === null) {
        return false
      } else {
        return this.$Day(this.form.follow_up_time).isAfter(this.$day)
      }
    },
    isShowFollowInfo() {
      if (this.type == 'create') {
        if (this.createMethod == 'create') {
        } else if (this.createMethod == 'additional') {
          return true
        }
      } else if (this.type == 'edit') {
        return !this.followIsSameOrAfter
      } else if (this.type == 'view') {
        return true
      }
      return false
    },
    isDisabled() {
      return this.type == 'view' && !this.isCanEdit
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

.list-title {
  font-size: 18px !important;

  span {
    font-size: 14px;
  }
}

.adverse {
  :deep(.el-select__tags-text) {
    color: #333333 !important;
  }
}
</style>
