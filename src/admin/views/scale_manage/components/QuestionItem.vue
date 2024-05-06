<template>
  <div>
    <div class="question-item-wrapper">
      <div v-if="!hideRemoveBtn" class="remove-btn" @click="removeClick"><i class="el-icon-remove"></i></div>
      <div class="title">
        {{ localConfig.index + '.' }}
        {{ localConfig.question }}
        <!--        <el-input v-model="localConfig.question" class="title-input"></el-input>-->
        <span class="dot" v-if="localConfig.required"></span>

      </div>
      <div class="answer">
        <div
          v-if="singleQuestion"
          class="single-type"
        >
          <template v-if="mode === 'edit'">
            <el-radio-group>
              <el-radio
                v-for="(item, index) in localConfig.answer"
                :key="'answerItem' + index"
                :label="item.label"
                readonly
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-else>
            <el-radio-group v-model="localConfig.select">
              <el-radio
                v-for="(item, index) in localConfig.answer"
                :key="'answerItem' + index"
                :label="item.label"
                readonly
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </template>
        </div>
        <div
          v-if="multipleQuestion"
          class="multiple-type"
        >
          <template v-if="mode === 'edit'">
            <el-checkbox
              v-for="(item, index) in localConfig.answer"
              :key="'answerItem' + index"
              :label="item.label"
              onclick="return false"
            >
            </el-checkbox>
          </template>
          <template v-else>
            <el-checkbox-group v-model="localConfig.selection">
              <el-checkbox
                v-for="(item, index) in localConfig.answer"
                :key="'answerItem' + index"
                :label="item.label"
              >
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </div>
        <div
          v-if="fillQuestion"
          class="fill-type"
        >
          <el-input type="textarea" :readonly="true" v-model="localConfig.content" placeholder="" :rows="3"></el-input>
        </div>
      </div>
      <a
        style="display: block;padding: 10px; cursor: pointer;"
        @click="handleEditClick"
        v-if="mode === 'edit'"
      >
        {{ visible ? '完成编辑' : '编辑选项' }}
        <i :class="visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
      </a>

      <div
        class="edit-config-box"
        :class="{visible: visible}"
      >
        <el-row>
          <el-col :span="7">
            <el-form
              label-position="right"
              label-width="60px"
              class="form-box"
            >
              <el-form-item label="类型">
                <el-select
                  v-model="localConfig.type"
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in QUESTION_TYPE"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标题">
                <el-input clearable v-model="localConfig.question"></el-input>
              </el-form-item>
              <el-form-item label="必答">
                <el-radio-group v-model="localConfig.required">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="17" style="padding-left: 20px">
            <el-form
              label-position="left"
              label-width="60px"
              class="form-box"
            >
              <el-row class="edit-answer-header mb_10" type="flex" justify="space-between">
                <el-col :span="12">
                  选项文字
                </el-col>
                <el-col :span="8">
                  操作
                </el-col>
                <el-col :span="4">
                  跳转题目
                </el-col>
              </el-row>
              <el-row
                class="edit-answer-row"
                justify="space-between"
                type="flex"
                v-for="(option, index) in localConfig.answer"
                :key="'optionItem' + index"
              >
                <el-col :span="12">
                  <el-form-item>
                    <el-input
                      v-model="option.key"
                      readonly
                      style="display: inline-block;width: 100px;margin-right: 5px;"
                      clearable
                    ></el-input>
                    <el-input
                      v-model="option.label"
                      style="width: calc(100% - 100px - 5px);"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <m-button
                    icon="el-icon-bottom" w="38px" h="38px" type="iron"
                    style="line-height: 38px;padding: 0;margin-top: 4px"
                    @click="moveDown(index)"
                  ></m-button>
                  <m-button
                    icon="el-icon-top" w="38px" h="38px" type="iron"
                    style="line-height: 38px;padding: 0;margin-top: 4px"
                    @click="moveUp(index)"
                  ></m-button>
                  <m-button w="80px" h="38px" style="padding: 0;" @click="addExplanClick(index)">添加说明</m-button>
                  <m-button type="danger" w="38px" h="38px" style="padding: 0;" icon="el-icon-delete"
                            @click="deleteOption(index)"></m-button>
                </el-col>

                <el-col v-if="singleQuestion" :span="4">
                  <el-link v-if="option.goto !== -1" style="margin-top: 10px;" @click="setQuestionJump(index)">
                    跳转至第{{ option.goto }}题
                  </el-link>
                  <el-link v-else style="margin-top: 10px;" @click="setQuestionJump(index)">未设置</el-link>
                </el-col>
                <el-col v-else :span="4"></el-col>
              </el-row>
              <el-row class="edit-answer-row">
                <el-col :span="12">
                  <el-form-item>
                    <m-button w="100%" h="40px" plain @click="addOption">添加选项</m-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>

      <!--      <el-divider v-if="!visible"></el-divider>-->

      <el-dialog
        title="添加选项说明"
        :visible.sync="explanDialogVisible"
        :modal="true"
        class="explan-dialog"
      >
        <el-form
          class="form-box"
          :model="explanForm"
          :rules="explanRules"
          ref="explanForm"
          label-width="60"
          label-position="left"
        >
          <el-form-item label="选项说明">
            <el-input
              type="textarea"
              v-model="explanForm.text" placeholder="请输入选项说明"
              maxlength="200"
              show-word-limit
              rows="5"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item label="显示方式">
            <el-radio-group v-model="explanForm.display">
              <el-radio label="interface">直接显示在问卷界面</el-radio>
              <el-radio label="dialog">点击按钮后在弹窗中显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="explanDialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="saveExplan" w="80px">确 定</m-button>
      </span>
      </el-dialog>

      <el-dialog
        title="跳转题目"
        :visible.sync="questionJumpDialogVisible"
        :modal="true"
        class="jump-dialog"
      >
        <el-form
          class="form-box"
          :model="questionJumpForm"
          ref="explanForm"
          label-width="60"
          label-position="left"
        >
          <el-form-item label="跳转至" prop="status">
            <el-select
              v-model="questionJumpForm.goto"
              placeholder="请选择"
              style="width: 300px;"
            >
              <el-option
                label="不进行跳转"
                :value="-1"
              ></el-option>
              <el-option
                v-for="item in questions.slice(localConfig.index, questions.length)"
                :key="item.index"
                :label="item.index + '.' + item.question"
                :value="item.index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="questionJumpDialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="saveJump" w="80px">确 定</m-button>
      </span>
      </el-dialog>


    </div>
  </div>
</template>

<script>
import { QUESTION_TYPE } from '@/common/utils/dict'

export default {

  name: 'QuestionItem',
  props: {
    config: {
      type: Object,
      required: true
    },
    questions: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: 'edit' // edit | view | answer
    },
    hideRemoveBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localConfig: {
        id: null,
        index: 0,
        type: 0,
        question: '',
        required: true,
        answer: [
          {
            key: '',
            label: '',
            desc: '',
            descDisplay: 'interface',
            goto: 1,
          },
        ],
        select: '', // 单选的选择
        selection: [], // 多选的选择
        content: '', // 填空的内容
      },
      visible: false,
      explanDialogVisible: false,
      explanForm: {
        text: '',
        display: 'interface', // interface, dialog
      },
      explanRules: {},

      questionJumpDialogVisible: false,
      questionJumpForm: {
        goto: -1,
      },
      currAnswer: {},
      currIndex: null,
    }
  },
  watch: {
    config(n) {
      this.localConfig = n
    }
  },
  mounted() {
    this.initConfig()
  },
  methods: {
    addOption() {
      if (!this.localConfig.answer) {
        this.localConfig.answer = []
      }
      this.localConfig.answer.push({
        key: `选项${this.localConfig.answer.length + 1}`,
        label: '',
        desc: '',
        descDisplay: 'interface',
        goto: -1,
      })
    },
    initConfig() {
      this.localConfig = this.config
    },
    deleteOption(index) {
      if (this.localConfig.answer.length === 1) return
      this.localConfig.answer.splice(index, 1)
    },
    moveDown(index) {
      if (index === this.localConfig.answer.length - 1) return
      const answer = this.localConfig.answer
      this.moveInArray(answer, index, index + 1)
    },
    moveUp(index) {
      if (index === 0) return
      const answer = this.localConfig.answer
      this.moveInArray(answer, index, index - 1)
    },
    moveInArray(arr, from, to) {
      const item = arr.splice(from, 1)
      arr.splice(to, 0, item[0])
      return arr
    },
    handleEditClick() {
      // if (this.visible) {
      //   // 完成编辑时校验选项的配置是否完整
      //   this.visible = !this.checkConfig()
      // } else {
      //   this.visible = true
      // }
      this.visible = !this.visible
    },
    checkConfig() {
      const config = this.localConfig
      if (config.question === '') {
        this.$message.error(`问题【${config.index}】没有填写标题`)
        return false
      }
      // if (!this.fillQuestion) {
      for (let j = 0; j < config.answer.length; j++) {
        const item = config.answer[j]
        if (item.label === '') {
          this.$message.error(`问题【${config.index}】的【选项${j + 1}】存在空的选项文字`)
          return false
        }
      }
      // }
      return true
    },
    addExplanClick(index) {
      this.currIndex = index
      this.currAnswer = this.localConfig.answer[index]
      this.explanForm.text = this.currAnswer.desc
      this.explanForm.display = this.currAnswer.descDisplay
      this.explanDialogVisible = true
    },
    setQuestionJump(index) {
      this.currIndex = index
      this.currAnswer = this.localConfig.answer[index]
      this.questionJumpForm.goto = this.localConfig.answer[index].goto
      this.questionJumpDialogVisible = true
    },
    saveExplan() {
      this.localConfig.answer[this.currIndex].desc = this.explanForm.text
      this.localConfig.answer[this.currIndex].descDisplay = this.explanForm.display
      this.currIndex = null
      this.explanDialogVisible = false
    },
    saveJump() {
      this.localConfig.answer[this.currIndex].goto = this.questionJumpForm.goto
      this.currIndex = null
      this.questionJumpDialogVisible = false
    },
    removeClick() {
      this.$emit('remove')
    },
  }, // methods end
  computed: {
    singleQuestion() {
      return this.localConfig.type === this.$enum.QUESTION_TYPE.SINGLE
    },
    multipleQuestion() {
      return this.localConfig.type === this.$enum.QUESTION_TYPE.MULTIPLE
    },
    fillQuestion() {
      return this.localConfig.type === this.$enum.QUESTION_TYPE.FILL
    },
    QUESTION_TYPE() {
      return QUESTION_TYPE
    }
  },
}
</script>

<style scoped lang="less">
.question-item-wrapper {
  position: relative;
  //border: 1px solid #dadce0;
  //padding-left: 10px;
  //border-radius: 12px;
  .el-divider {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    line-height: 2;
    padding-right: 24px;
  }

  .remove-btn {
    position: absolute;
    right: 0;
    top: 6px;

    i {
      display: block;
      font-size: 24px;
      color: red;
      cursor: pointer;
    }
  }

  .single-type {
    width: 100%;

    .el-radio {
      display: block;
      line-height: 2;
      white-space: pre-wrap;
      margin: 0;
    }
  }

  .multiple-type {
    .el-checkbox {
      display: block;
      line-height: 2;
      white-space: pre-wrap;
      margin: 0;
    }
  }

  .fill-type {
    .el-textarea {
      :deep(.el-textarea__inner) {
        height: 100px;
        resize: none;
      }
    }
  }

  .edit-config-box {
    border: 1px solid #dadce0;
    padding: 0;
    max-height: 0;
    height: 0;
    //border-radius: 12px;
    overflow: hidden;
    border: unset;
    border-bottom: 1px solid #dadce0;
    transition: max-height .3s;
    transition-timing-function: linear;

    .edit-answer-header {
      .el-col:first-child {
        text-align: left;
      }

      .el-col {
        text-align: center;
      }
    }

    .edit-answer-row {
      .el-col {
        text-align: center;
        height: 50px;
      }

      .el-form-item {
        :deep(.el-form-item__content) {
          margin-left: 0 !important;
        }
      }
    }
  }
}

.form-box.el-form {
  .el-form-item {
    :deep(.el-form-item__label) {
      height: 40px !important;
      line-height: 40px;
      min-height: 40px !important;
    }

    :deep(.el-form-item__content) {
      .el-input__inner {
        height: 40px !important;
        min-height: 40px !important;
        line-height: 40px;
      }
    }
  }
}

.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
  position: relative;
  top: -3px;
}

.explan-dialog {
  :deep(.el-dialog) {
    width: 700px;
    height: 460px;
  }

  .el-textarea {
    :deep(.el-textarea__inner) {
      height: 140px;
      resize: none;
    }
  }
}

.jump-dialog {
  :deep(.el-dialog) {
    width: 460px;
    height: 360px;
  }
}

.visible {
  height: auto !important;
  padding: 15px !important;
  padding-top: 20px !important;
  border-radius: 12px !important;
  max-height: 800px !important;
  border: 1px solid #dadce0 !important;
  overflow: visible !important;
  transition: max-height .3s;
}

.title-input {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  line-height: 2;
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
</style>
