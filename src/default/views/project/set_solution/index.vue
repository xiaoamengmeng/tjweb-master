<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/project'}">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>项目管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: `/project_detail/${this.form.project_id}`}">
        <b>详情</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" style="margin-top: 0;">
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
        <div class="list-title all-border">
          选择项目适用阶段
          <el-select
            v-model="form.stage"
            placeholder="请选择"
            clearable
            style="width: 200px; margin-left: 10px; margin-right: 20px;"
          >
            <el-option
              v-for="(item, index) in projectStage"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
          选择方案
          <el-select
            v-model="intervsTplSelect"
            placeholder="请选择"
            clearable
            style="width: 280px; margin-left: 10px; margin-right: 20px;"
            @change="useIntervsTpl"
          >
            <el-option
              v-for="(item, index) in intervsTplList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
        <!--<m-button small @click="showCalorieCalc" h="40px">热量计算器aa</m-button>-->
        <div class="h_30"></div>

        <div class="list-title all-border">
          方案标题
          <el-input v-model="form.name" placeholder="请输入方案标题" clearable
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

const localSession = new LocalStore('projectSetSolution', true)

export default {
  name: 'ProjectSetSolution',
  data() {
    return {
      type: 'create',
      title: '添加项目干预方案',
      form: {
        name: '',
        stage: '',
        nutrition: '',
        exercise: '',
        project_id: ''
      },
      rules: {},
      calorieCalcVisible: false,
      calcForm: {
        weight: '',
        calorie: ''
      },
      calcRules: {},

      projectStage: [],
      intervsTplList: [],
      intervsTplSelect: '',
      intervsId: '',
    }
  },
  watch: {},
  mounted() {
    this.getIntervsTplList()
    this.initForm()
  },
  methods: {
    showCalorieCalc() {
      this.calorieCalcVisible = true
    },
    hideCalorieCalc() {
      this.calorieCalcVisible = false
    },
    async initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', {
          type: params.type,
          id: params.id,
          projectId: params.projectId,
          projectStage: params.projectStage,
          intervsId: params.intervsId
        })
      }

      this.form.project_id = data.projectId
      this.intervsId = data.intervsId
      this.projectStage = data.projectStage
      this.type = data.type || 'create'
      this.title = data.type === 'create' ? '添加项目干预方案' : '编辑项目干预方案'

      if (data.type === 'edit') {
        this.$api.intervs.getDetail(data.intervsId)
          .then((res) => {
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
    getIntervsTplList() {
      this.$api.intervsTpl.getList({
        page: 1,
        page_size: 999
      })
        .then((res) => {
          this.intervsTplList = res.data.results
        })
        .catch((err) => {
       this.$message.error(JSON.stringify(err))
        })
    },
    save() {
      let valid = false

      if (this.form.stage === '') {
        return this.$message.error('请选择适用阶段')
      }
      if (this.form.name === '') {
        return this.$message.error('请输入方案标题')
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
      this.$api.intervs.create(this.form)
        .then(res => {
          this.$message.success('新增成功')
          this.leavePage()
        })
    },
    update() {
      this.$api.intervs.patch(this.intervsId, this.form)
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
      this.$router.go(-1)
    }
  }, // methods end
  computed: {
    calorie() {
      if (this.calcForm.weight === '') {
        return ''
      } else {
        return this.calcForm.weight * 2
      }
    }
  },
}
</script>

<style scoped lang="less">
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


.calc-dialog {
  .form-box {
    .el-form-item {
      width: 70%;
    }
  }
}

.h_30 {
  height: 30px;
}
</style>
