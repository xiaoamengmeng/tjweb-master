<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/scale_manage'}">
        <icon-box icon-name="menu_lbgl" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>量表管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" v-loading="loading">
      <div class="card-title">
        量表名称：
        <el-input v-model="form.title" placeholder="请输入量表名称" class="title-input"></el-input>
      </div>

      <div class="list-title" style="color: #344563 !important;">
        问卷说明：
        <el-input
          type="textarea"
          v-model="form.instructions" placeholder="请输入问卷说明"
          maxlength="200"
          show-word-limit
          rows="5"
          clearable
        ></el-input>
      </div>
      <div class="list-title" style="color: #344563 !important;">
        状态：
        <el-switch
          v-model="form.status"
          style="position: relative; top: -1px;"
        ></el-switch>
        <span v-if="form.status" class="ml_4">已发布</span>
        <span v-else class="ml_4">未发布</span>
      </div>

      <div class="scale">
        <question-item
          v-for="(item, index) in questions"
          :key="'questionItem' + index"
          :title="'questionItem' + index"
          :config="item"
          :questions="questions"
          @remove="questionRemove(index)"
          mode="edit"
        ></question-item>
      </div>

      <m-button class="mt_10" w="240px" type="iron" @click="addQuestionItem">添加题目</m-button>
      <div>
        <m-button class="mt_20" w="100%" @click="save">完成编辑</m-button>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import QuestionItem from '../components/QuestionItem'

const localSession = new LocalStore('setScale', true)

export default {
  name: 'SetScale',
  components: {
    QuestionItem
  },
  data() {
    return {
      type: 'create',
      title: '新建量表',
      form: {
        title: '',
        instructions: '',
        status: true,
      },
      rules: {},
      scaleInfo: {},
      questions: [],
      loading: true,
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
        localSession.set('cache', params)
      }

      this.type = data.type
      this.title = (this.type === 'create' || this.type === 'copy') ?
        '新建量表' : '编辑量表'

      if (data.type === 'create') {
        this.loading = false
      } else {
        this.$api.scale.getDetail(data.scaleId)
          .then((res) => {
            this.scaleInfo = res.data
            this.form = this.scaleInfo.config
            this.questions = this.scaleInfo.fields.map((item) => {
              if (this.type === 'edit') {
                return {
                  ...item.config,
                  id: item.id
                }
              } else {
                // copy
                return {
                  ...item.config,
                }
              }
            })
            this.$nextTick(() => {
              this.loading = false
            })
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })
      }

      this.form.compareAssign(data)

    },
    checkScale() {
      if (this.form.title === '') {
        this.$message.error('请输入量表名称')
        return false
      }
      for (let i = 0; i < this.questions.length; i++) {
        const config = this.questions[i]
        if (config.question === '') {
          this.$message.error(`问题【${config.index}】没有填写标题`)
          return false
        }

        const set = new Set()
        config.answer.forEach(item => set.add(item.key))
        if (set.size !== config.answer.length) {
          this.$message.error(`问题【${config.index}】存在相同的选项标识`)
          return false
        }

        if (config.type !== this.$enum.QUESTION_TYPE.FILL) {
          for (let j = 0; j < config.answer.length; j++) {
            const item = config.answer[j]
            if (item.key === '' || item.key.trim() === '') {
              this.$message.error(`问题【${config.index}】存在空的选项标识`)
              return false
            }
            if (item.label === '') {
              this.$message.error(`问题【${config.index}】的【${item.key}】存在空的选项文字`)
              return false
            }
          }
        }
      }
      return true
    },
    getParams() {
      const params = {
        name: this.form.title,
        config: {},
        fields: []
      }

      params.config = this.form

      this.questions.forEach((item) => {
        const id = item.id
        delete item.id
        params.fields.push({
          id: id,
          name: item.question,
          field_type: item.type,
          config: item,
          order: item.index
        })
      })

      return params
    },
    save() {
      if (this.checkScale()) {
        if (this.type === 'create' || this.type === 'copy') {
          this.create()
        } else {
          this.update()
        }
      }
    },
    create() {
      this.$api.scale.create(this.getParams())
        .then(res => {
          this.$message.success('新增成功')
          this.leavePage()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    update() {
      this.$api.scale.update(this.scaleInfo.id, this.getParams())
        .then(res => {
          this.$message.success('编辑成功')
          this.leavePage()
        })
        .catch((err) => {
          if (err.code === 'cannot_delete_protected') {
            this.$message.error('保存时发生错误，无法删除带有保护的选项，请重新编辑')
          } else {
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    leavePage() {
      this.$router.go(-1)
    },
    addQuestionItem() {
      this.questions.push({
        index: this.questions.length + 1,
        type: 0,
        question: '无标题',
        answer: [{
          key: '选项1',
          label: '',
          desc: '',
          descDisplay: 'interface',
          goto: -1
        }],
        required: true,
        select: '',
        selection: [],
        content: '',
      })
    },
    resetGoto(question) {
      question.answer.forEach(item => {
        if (item.goto > this.questions.length) {
          item.goto = -1
        }
      })
    },
    questionRemove(index) {
      this.questions.splice(index, 1)
      this.questions.forEach((item, index) => {
        item.index = index + 1
        this.resetGoto(item)
      })
      // console.log(this.questions)
    }
  }, // methods end
  computed: {},
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

.card-title {
  height: 40px;
  line-height: 40px;
}

.title-input {
  width: 400px;
  font-size: 20px;
  font-weight: 500;
  color: #344563;
  margin-bottom: 20px;

  :deep(.el-input__inner) {
    border-top: unset;
    border-left: unset;
    border-right: unset;
    border-radius: unset;
    color: #344563;
    padding: 0;
  }
}

.el-textarea {
  width: 700px;
  position: relative;
  display: block;

  :deep(.el-textarea__inner) {
    height: 140px;
    resize: none;
  }

  :deep(.el-input__count) {
    right: 16px;
  }
}
</style>
