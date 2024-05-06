<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'SolutionTpl'}">
        <icon-box icon-name="menu_xmgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>干预方案模板</b>
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
          标题
          <el-input v-model="form.name" placeholder="请输入方案标题" clearable
                    style="width: 480px; margin-left: 10px; margin-top: 0;"></el-input>
        </div>
        <!--<m-button small @click="showCalorieCalc" h="40px">热量计算器aa</m-button>-->

        <div class="list-title">
          营养方案
          <el-select
            v-model="dietTplSelect"
            placeholder="请选择"
            clearable
            style="width: 450px; margin-left: 10px;"
            @change="useDietTpl"
          >
            <el-option :value="-1" label="自定义"></el-option>
            <el-option
              v-for="(dietTpl, index) in dietTplList"
              :key="dietTpl.id"
              :value="dietTpl.id"
              :label="`使用【${dietTpl.name}】模板`"
            ></el-option>
          </el-select>
        </div>
        <m-editor
          ref="dietEditor"
          mode="default"
          class="editor-box"
          :content.sync="form.nutrition"
          :disabled="type === 'view'"
        ></m-editor>

        <div class="list-title">运动方案
          <el-select
            v-model="exerTplSelect"
            placeholder="请选择"
            clearable
            style="width: 450px; margin-left: 10px;"
            @change="useExerTpl"
          >
            <el-option :value="-1" label="自定义"></el-option>
            <el-option
              v-for="(exerTpl, index) in exerTplList"
              :key="exerTpl.id"
              :value="exerTpl.id"
              :label="`使用【${exerTpl.name}】模板`"
            ></el-option>
          </el-select>
        </div>
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
import axios from "axios"

const solutionTplSession = new LocalStore('solutionTpl', true)

export default {
  name: 'SetSolutionTpl',
  data() {
    return {
      type: 'create',
      title: '添加干预方案',
      form: {
        name: '',
        nutrition: '',
        exercise: ''

      },
      solutionTpl: {},
      rules: {
        stage: [
          { required: true, message: '请选择项目阶段', trigger: 'change' },
        ],
      },
      calorieCalcVisible: false,
      calcForm: {
        weight: '',
        calorie: ''
      },
      calcRules: {},
      dietTplList: [],
      exerTplList: [],
      dietTplSelect: -1,
      exerTplSelect: -1,
    }
  },
  watch: {
    dietTplSelect(n) {
      if (n === '') {
        this.dietTplSelect = -1
        this.$refs.dietEditor.setContent('')
      }
    },
    exerTplSelect(n) {
      if (n === '') {
        this.exerTplSelect = -1
        this.$refs.exerEditor.setContent('')
      }
    }
  },
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
    async initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = solutionTplSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        solutionTplSession.set('cache', { type: params.type, id: params.id })
      }

      this.solutionTpl = data
      this.type = data.type || 'create'
      this.title = data.type === 'create' ? '添加干预方案' : '编辑干预方案'

      await this.getDietTplList()
      await this.getExerTplList()

      if (data.type === 'create') {
        this.form.name = ''
        this.form.nutrition = ''
        this.form.exercise = ''
      } else {
        this.$api.intervsTpl.getDetail(data.id)
          .then((res) => {
            this.form.name = res.data.name
            this.$refs.dietEditor.setContent(res.data.nutrition)
            this.$refs.exerEditor.setContent(res.data.exercise)
            const dietTpl = this.dietTplList.find(item => item.content === res.data.nutrition)
            this.dietTplSelect = dietTpl ? dietTpl.id : -1
            const exerTpl = this.exerTplList.find(item => item.content === res.data.exercise)
            this.exerTplSelect = exerTpl ? exerTpl.id : -1
          })
          .catch((err) => {
         this.$message.error(JSON.stringify(err))
          })
      }
    },
    getDietTplList() {
      return new Promise((resolve, reject) => {
        this.$api.dietTpl.getList({
          page: 1,
          page_size: 100
        })
          .then((res) => {
            this.dietTplList = res.data.results
            resolve(true)
          })
          .catch((err) => {
         this.$message.error(JSON.stringify(err))
            reject(err)
          })
      })
    },
    getExerTplList() {
      return new Promise((resolve, reject) => {
        this.$api.exerTpl.getList({
          page: 1,
          page_size: 100
        })
          .then((res) => {
            this.exerTplList = res.data.results
            resolve(true)
          })
          .catch((err) => {
         this.$message.error(JSON.stringify(err))
            reject(err)
          })
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
      if (this.form.name === '') {
        return this.$message.error('方案标题不能为空')
      }
      const nutr = this.form.nutrition
      const nutrIsEmpty = nutr === '' || nutr === '<p><br></p>'
      const exer = this.form.exercise
      const exerIsEmpty = exer === '' || exer === '<p><br></p>'
      if (nutrIsEmpty && exerIsEmpty) {
        return this.$message.error('营养方案或运动方案必须填写其中一项')
      }
      this.$api.intervsTpl.create(this.form)
        .then(res => {
          this.$message.success('新增成功')
          this.leavePage()
        })
    },
    update() {
      this.$api.intervsTpl.patch(this.solutionTpl.id, this.form)
        .then(res => {
          this.$message.success('编辑成功')
        })
    },
    useDietTpl(id) {
      if (id === -1) {
        this.$refs.dietEditor.setContent('')
      } else {
        const tpl = this.dietTplList.find(item => item.id === id)
        if (tpl) {
          this.$refs.dietEditor.setContent(tpl.content)
        }
      }
    },
    useExerTpl(id) {
      if (id === -1) {
        this.$refs.exerEditor.setContent('')
      } else {
        const tpl = this.exerTplList.find(item => item.id === id)
        if (tpl) {
          this.$refs.exerEditor.setContent(tpl.content)
        }
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

</style>
