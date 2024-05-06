<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/patient'}">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: `/patient_detail/${this.ppid}?views=1`}">
        <b>患者详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" v-loading="loading">
      <div class="patient-info">
        <div class="base">
          <div class="avatar">
            <el-avatar fit="cover" :size="62" :src="ppInfo.patient.avatar_url"></el-avatar>
          </div>
          <div class="name">{{ ppInfo.patient.name }}</div>
          <div class="sex">
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.M"
              icon-name="sex_male" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
            <icon-box
              v-if="ppInfo.patient.sex === $enum.SEX.F"
              icon-name="sex_female" w="42" h="25" box-w="42" box-h="62"
            ></icon-box>
          </div>
          <div class="tag age">{{ ppInfo.patient.user_profile.birthday | calcAge }}岁</div>
          <div v-if="ppInfo.stage" class="tag stage">{{ ppInfo.stage }}</div>
          <div class="tag id">No.{{ ppInfo.patient.user_id }}</div>

        </div>
        <div class="base2">
          <div class="item">手机号：{{ ppInfo.patient.phone_number }}</div>
          <div class="item">身份证：{{ ppInfo.patient.id_number }}</div>
          <div class="item">出生日期：{{ ppInfo.patient.user_profile.birthday | dateFormatCN }}</div>
        </div>
        <div class="tags">
          <span>患者标签：</span>
          <span v-if="ppInfo.patient.tags && ppInfo.patient.tags.length === 0">暂无</span>
          <template v-else>
          <span
            class="tag mr_8"
            v-for="tag in ppInfo.patient.tags"
            :key="tag.id"
          >
            #{{ tag.name }}
          </span>
          </template>
        </div>
      </div>

      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
      >
        <div class="list-title all-border">
          患者阶段
          <el-select
            v-model="form.stage"
            placeholder="请选择"
            clearable
            style="width: 200px; margin-left: 10px; margin-right: 20px;"
            @change="intervsTplSelect=''"
          >
            <el-option
              v-for="(item, index) in projectStage"
              :key="index"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
          推荐方案
          <el-select
            v-model="intervsTplSelect"
            placeholder="请选择"
            no-data-text='该阶段暂无推荐方案'
            clearable
            style="width: 280px; margin-left: 10px; margin-right: 20px;"
            @change="useIntervsTpl"
          >
            <el-option
              v-for="(item) in intervsTplList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <!--<m-button small @click="showCalorieCalc" h="40px">热量计算器aa</m-button>-->
        <div class="h_30"></div>

        <div class="list-title all-border">
          方名称案
          <el-input v-model="form.name" placeholder="请输入方案名称" clearable
                    style="width: 450px; margin-left: 10px; margin-top: 0;"></el-input>
        </div>

        <div class="list-title">
          营养方案
        </div>
        <m-editor
          ref="dietEditor"
          mode="default"
          class="editor-box"
          :content.sync="form.nutrition"
          :disabled="type === 'view'"
        ></m-editor>

        <div class="list-title">运动方案</div>
        <m-editor
          ref="exerEditor"
          mode="default"
          class="editor-box"
          :content.sync="form.exercise"
          :disabled="type === 'view'"
        ></m-editor>
        <el-form-item label="状态" required>
          <el-radio-group v-model="form.is_enabled" style="position: relative; top: 4px;">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="mt_20">
          <m-button v-show="type !== 'view'" @click="save">保存</m-button>
          <m-button plain @click="leavePage">返回</m-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 热量计算 -->
    <el-dialog
      title="热量计算"
      :visible.sync="calorieCalcVisible"
      :modal="true"
      class="calc-dialog"
    >
      <el-form
        ref="calcForm"
        class="form-box"
        :model="calcForm"
        :rules="calcRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="体重" required>
          <el-input v-model="calcForm.weight" oninput="value=value.replace(/[^\d.]/g,'')"
                    placeholder="请输入体重"></el-input>
        </el-form-item>
        <el-form-item label="推荐热量" required>
          <el-input v-model="calorie" :value="calorie" placeholder="根据体重自动计算" disabled></el-input>
          <div style="position: absolute; right: -40px; bottom: 0;">千卡</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideCalorieCalc">取 消</el-button>
        <el-button type="primary" @click="hideCalorieCalc">插 入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('PatientSetSolution', true)

export default {
  name: 'PatientSetSolution',
  data() {
    return {
      type: 'create',
      title: '创建患者干预方案',
      form: {
        name: '',
        stage: '',
        nutrition: '',
        exercise: '',
        project_patient_id: 0,
        is_enabled: true,
      },
      rules: {},
      calorieCalcVisible: false,
      calcForm: {
        weight: '',
        calorie: ''
      },
      calcRules: {},

      projectStage: [],
      intervsTplSelect: '',

      ppid: '', // 项目患者id
      projectId: '', // 项目id
      intervsId: '', // 编辑的方案id
      userId: '', // 患者id

      projectInfo: {},
      loading: true,
      ppInfo: {
        project: {},
        patient: {
          user_profile: {}
        },
      },
    }
  },
  watch: {},
  mounted() {
    this.initForm()
  },
  methods: {
    showCalorieCalc() {
      this.calorieCalcVisible = true
    },
    hideCalorieCalc() {
      this.calorieCalcVisible = false
    },
    initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', {
          type: params.type,
          intervsId: params.intervsId,
          projectId: params.projectId,
          ppid: params.ppid,
          userId: params.userId,
          stage: params.stage
        })
      }

      this.projectId = data.projectId
      this.ppid = data.ppid
      this.userId = data.userId
      this.form.project_patient_id = data.ppid
      this.form.stage = data.stage
      this.intervsId = data.intervsId
      this.type = data.type || 'create'
      this.title = data.type === 'create' ? '创建患者干预方案' : '编辑患者干预方案'

      this.getPpInfo()
      this.getProjectDetail()

      if (data.type === 'create') {

      } else {
        this.$api.ppIntervs.getDetail(data.intervsId)
          .then((res) => {
            this.form.is_enabled = res.data.is_enabled
            this.form.name = res.data.name
            this.form.stage = res.data.stage
            this.form.nutrition = res.data.nutrition
            this.form.exercise = res.data.exercise
            this.$refs.dietEditor.setContent(res.data.nutrition)
            this.$refs.exerEditor.setContent(res.data.exercise)
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })
      }
    },
    // 获取项目详情推荐的方案
    getProjectDetail() {
      this.$api.project.getDetail(this.projectId)
        .then((res) => {
          const projectInfo = res.data
          this.projectInfo = projectInfo
          this.projectStage = projectInfo.stage
          this.$nextTick(()=>{
            if (this.intervsTplList.length !== 0) {
              const last = this.intervsTplList[this.intervsTplList.length - 1]
              if (this.type === 'create') {
                this.intervsTplSelect = last.id
                this.form.nutrition = last.nutrition
                this.form.exercise = last.exercise
                this.$refs.dietEditor.setContent(last.nutrition)
                this.$refs.exerEditor.setContent(last.exercise)
              }
            }
          })

        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    getPpInfo() {
      this.loading = true
      this.$api.myProjectPatient.getDetail(this.ppid)
        .then((res) => {
          this.ppInfo = res.data
          this.hasRecipe = this.ppInfo.recipe && this.ppInfo.recipe.foods
          this.ppInfoLoadDone()
          this.loading = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    ppInfoLoadDone() {
    },
    save() {
      let valid = false

      if (this.form.stage === '') {
        return this.$message.error('请选择适用阶段')
      }
      if (this.form.name === '') {
        return this.$message.error('请输入方案名称')
      }

      const nutr = this.form.nutrition
      const nutrIsEmpty = nutr === '' || nutr === '<p><br></p>'
      const exer = this.form.exercise
      const exerIsEmpty = exer === '' || exer === '<p><br></p>'
      if (nutrIsEmpty && exerIsEmpty) {
        return this.$message.error('营养方案或运动方案必须填写其中一项')
      }

      valid = true

      if (valid) {
        if (this.type === 'create') {
          this.create()
        } else {
          this.update()
        }
      } else {
        return false
      }
    },
    create() {
      this.$api.ppIntervs.create(this.form)
        .then(res => {
          this.$message.success('新增成功')
          this.leavePage()
        })
    },
    update() {
      this.$api.ppIntervs.update(this.intervsId, this.form)
        .then(res => {
          this.$message.success('编辑成功')
          this.leavePage()
        })
    },
    useIntervsTpl(id) {
      const tpl = this.intervsTplList.find(item => item.id === id)
      if (tpl) {
        this.form.exercise = tpl.exercise
        this.$refs.exerEditor.setContent(tpl.exercise)
        this.form.nutrition = tpl.nutrition
        this.$refs.dietEditor.setContent(tpl.nutrition)
      }
    },
    leavePage() {
      this.$router.push(`/patient_detail/${this.ppid}?views=1`)
    }
  }, // methods end
  computed: {
    calorie() {
      if (this.calcForm.weight === '') {
        return ''
      } else {
        return this.calcForm.weight * 2
      }
    },
    intervsTplList(){
      if(this.projectInfo.interventions){
        const stageIntervs = this.projectInfo.interventions.filter(item => item.stage === this.form.stage)
        return stageIntervs
      }else return []
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

.calc-dialog {
  :deep(.el-dialog) {
    width: 680px;
    height: 330px;

    .el-dialog__body {
      .el-transfer {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.editor-box {
  :deep(.editor) {
    height: 400px;
  }

  :deep(.toolbar) {
    border-radius: 0;
  }
}

.list-title {
  border: 1px solid #D9E1EC;
  border-bottom: unset;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 20px 0 20px 20px;
  margin: 0 !important;
  margin-top: 30px !important;
  background-color: #f4f5fa;
}

.list-title.all-border {
  border: 1px solid #D9E1EC;
  border-radius: 8px;
  margin-top: 0 !important;
}

.h_30 {
  height: 30px;
}

.patient-info {
  width: 100%;

  .base {
    position: relative;
    display: flex;
    align-items: center;
    height: 70px;
    margin-bottom: 22px;

    .name {
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: #344563;
      line-height: 28px;
      margin-left: 16px;
    }

    .sex {
      margin-left: 8px;
    }

    .tag {
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 13px;
      border: 1px solid #D9E1EC;
      font-size: 12px;
      font-weight: 600;
      color: #1E242C;
      margin-left: 4px;
    }

    .tag.age {
      min-width: 42px;
    }

    .tag.stage {
      min-width: 52px;
    }

    .tag.id {
      min-width: 76px;
    }

    .btn-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .font-mixin {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #5A607F;
    line-height: 20px;
  }

  .base2 {
    display: flex;
    margin-bottom: 22px;

    .item {
      .font-mixin();
      margin-right: 38px;
    }


  }

  .tags {
    .font-mixin();

    .tag {
      height: 27px;
      line-height: 27px;
      text-align: center;
      border-radius: 6px;
      border: 1px solid #D9E1EC;
      padding: 4px 8px;
    }

    margin-bottom: 32px;
  }

}
</style>
