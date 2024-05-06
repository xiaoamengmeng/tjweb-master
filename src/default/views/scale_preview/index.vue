<template>
  <div class="container" v-loading="loading">
    <div class="title">{{ scaleInfo.config.title }}</div>
    <div class="instructions">{{ scaleInfo.config.instructions }}</div>
    <!-- <icon-box icon-name="safety" unit="vw" :w="px2vw(30)" :h="px2vw(33)" :box-h="px2vw(33)"></icon-box> -->
    <!-- <div class="box"></div> -->
    <div class="form-container" v-if="status=='normal'">
      <el-form ref="form" label-position="top" label-width="80px" size="small" :model="form" :rules="rules">
        <template v-for="(item) in scaleForDisplay">
          <el-form-item v-if="!item.config.pass||previewMode||readonly" :class="{'is-pass':item.config.pass}"
                        :key="item.id"
                        :label="`${item.config.index}.${item.config.question}`" :prop="item.config.index+''">
            <el-input v-if="item.config.type==ENUM_QUESTION_TYPE.FILL" v-model="form[item.config.index+'']"
                      :readonly="readonly" :disabled="item.config.pass"></el-input>
            <el-radio-group v-else-if="item.config.type==ENUM_QUESTION_TYPE.SINGLE" v-model="form[item.config.index+'']"
                            :class="{'readonly':readonly}" :disabled="item.config.pass">
              <el-radio v-for="answer in item.config.answer" :key="`${item.id}-${answer.key}`" :label="answer.label"
                        @click.native="radioClick(item.config.index,answer)">
                <template>
                  <span>{{ answer.label }}</span><span
                  v-if="answer.desc!=''&&answer.descDisplay=='interface'">（{{ answer.desc }}）</span>
                  <span v-if="previewMode&&answer.goto!=-1" class="jumping-tip">（跳转到第 {{ answer.goto }} 题）</span>
                </template>
              </el-radio>
            </el-radio-group>
            <el-checkbox-group v-else-if="item.config.type==ENUM_QUESTION_TYPE.MULTIPLE"
                               v-model="form[item.config.index+'']" :class="{'readonly':readonly}"
                               :disabled="item.config.pass">
              <el-checkbox v-for="answer in item.config.answer" :key="`${item.id}-${answer.key}`" :label="answer.label"
                           @click.native="checkboxClick(answer)">
                <template>
                  <span>{{ answer.label }}</span><span
                  v-if="answer.desc!=''&&answer.descDisplay=='interface'">（{{ answer.desc }}）</span>
                </template>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
      </el-form>
      <div class="bottom-btn">
        <m-button v-if="!previewMode&&scaleInfo.fields&&!readonly" class="submit-btn" icon="el-icon-check"
                  @click="submitClick" style="width:100%;" :loading="submitLoading">提 交
        </m-button>
      </div>
    </div>
    <div class="submit-success" v-else-if="status=='success'">
      <div class="inner-wrap">
        <div class="icon-wrap"><i class="el-icon-success"></i></div>
        <div class="tips-text">提交成功<br>
          感谢您的认真作答！
        </div>
      </div>
    </div>
    <div class="submit-success" v-else-if="status=='outOfDate'">
      <div class="inner-wrap">
        <div class="title mb_20">{{ scaleInfo.config.title }}</div>
        <div class="icon-wrap warning"><i class="el-icon-warning"></i></div>
        <div class="tips-text">尚未达到开始时间<br>或超过了答题期限</div>
        <div class="fontsize_14 mt_10 color_999">有效期：{{ dayjs(scaleInfo.start_time).format('YYYY-MM-DD') }} 至
          {{ dayjs(scaleInfo.end_time).format('YYYY-MM-DD') }}
        </div>
      </div>
    </div>
    <div class="submit-success" v-else-if="status=='draft'">
      <div class="inner-wrap">
        <div class="title mb_20">{{ scaleInfo.config.title }}</div>
        <div class="icon-wrap danger"><i class="el-icon-error"></i></div>
        <div class="tips-text">问卷尚未发布</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import dayjs from 'dayjs'

export default {
  name: 'Scale',
  components: {},
  data() {
    return {
      id: -1,
      // scaleInfo: scaleModel,
      scaleInfo: {
        config: { title: '', instructions: '' },
      },
      scaleForDisplay: [],
      loading: false,
      submitLoading: false,
      current: 0,
      success: false,
      readonly: false,
      form: {},
      jumping: {},
      previewMode: false,
      rules: {},
      throttleTimer: null,
    }
  },
  mounted() {
    this.id = this.$route.params.no
    if (this.$route.query.previewMode) this.previewMode = true
    if (this.$route.query.token) {
      this.setToken(this.$route.query.token)
    }
    this.$nextTick(() => {
      if (this.id != -1) this.getScaleInfo()
    })
  },
  methods: {
    dayjs,
    ...mapActions({
      setToken: 'user/setToken',
    }),
    px2vw(px) {
      return (px / 375) * 100
    },
    getRecordDetail() {
      this.$api.cfRecords.getDetail(this.$route.query.record_id).then(res => {
        let fields = res.data.fields
        fields.forEach(item => {
          let value = ~~item.field.field_type == this.ENUM_QUESTION_TYPE.MULTIPLE ? item.value : item.value[0]
          this.form[item.field.config.index + ''] = value ? value : ''
          if (item.field.field_type == this.ENUM_QUESTION_TYPE.SINGLE) {
            let answer = item.field.config.answer.find(a => a.label == value)
            if (answer && answer.goto != -1) {
              this.jumping[item.field.config.index] = answer.goto
            }
          }
        })
        this.scaleForDisplay = this.updateScaleForDisplay()
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getScaleInfo() {
      this.loading = true
      this.$api.scale.getDetail(this.id).then(res => {
        res.data.fields.forEach(item => {
          let defaultValue = item.config.type == this.ENUM_QUESTION_TYPE.MULTIPLE ? [] : ''
          this.$set(this.form, item.config.index + '', defaultValue)
        })
        this.scaleInfo = res.data
        document.title = this.scaleInfo.config.title
        this.scaleForDisplay = this.updateScaleForDisplay()
        if (this.$route.query.record_id) {
          this.readonly = true
          this.getRecordDetail()
        } else {
          this.updateRules()
        }
      }).catch(err => {
        this.$message.error(err?.detail ?? '读取量表发生错误')
        this.scaleInfo.config.title = '量表不存在或读取时发生错误'
        this.scaleInfo.config.instructions = '请稍候重试'
      }).finally(() => {
        this.loading = false
      })
    },
    radioClick(from, to) {
      if (this.throttleTimer) clearTimeout(this.throttleTimer)
      this.throttleTimer = setTimeout(() => {
        if (this.jumping[from] && to.goto == -1) {
          // console.log('delete')
          delete this.jumping[from]
          this.scaleForDisplay = this.updateScaleForDisplay()
        } else if (to.goto != -1) {
          this.$set(this.jumping, from, to.goto)
          this.scaleForDisplay = this.updateScaleForDisplay()
        }
        if (to.desc != '' && to.descDisplay == 'dialog') {
          this.$alert(to.desc, '提示', { confirmButtonText: '知道了', customClass: 'scale-preview-message-box' })
        }
      }, 300)
    },
    checkboxClick(item) {
      if (this.throttleTimer) clearTimeout(this.throttleTimer)
      this.throttleTimer = setTimeout(() => {
        if (item.desc != '' && item.descDisplay == 'dialog') {
          this.$alert(item.desc, '提示', { confirmButtonText: '知道了', customClass: 'scale-preview-message-box' })
        }
      }, 300)
    },
    updateRules() {
      this.scaleInfo.fields.forEach(field => {
        if (field.config.required) {
          let rule = []
          if (field.config.type == this.ENUM_QUESTION_TYPE.MULTIPLE) rule = [{
            type: 'array',
            required: field.config.required,
            message: '请至少选择一项',
            trigger: 'change'
          }]
          else if (field.config.type == this.ENUM_QUESTION_TYPE.FILL) rule = [{
            required: field.config.required,
            message: '此题为必填项',
            trigger: 'blur'
          }]
          else rule = [{ required: field.config.required, message: '此题为必填项', trigger: 'blur' }]
          this.$set(this.rules, field.config.index + '', rule)
        }
      })
    },
    updateScaleForDisplay() {
      if (!this.scaleInfo.fields) return []
      let scales = JSON.parse(JSON.stringify(this.scaleInfo.fields))
      Object.keys(this.jumping).forEach(key => {
        let val = this.jumping[key]
        let fromIndex = scales.findIndex(item => item.config.index == key)
        let toIndex = scales.findIndex(item => item.config.index == val)
        if (fromIndex != -1 && toIndex != -1) {
          let delta = toIndex - fromIndex - 1
          if (delta > 0) {
            for (let index = fromIndex + 1; index < toIndex; index++) {
              const item = scales[index]
              item.config.pass = true
              this.form[item.config.index] = item.config.type == this.ENUM_QUESTION_TYPE.MULTIPLE ? [] : ''
            }
          }
        }
      })
      return scales
    },
    submitClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(this.form))
          let params = {
            form_id: this.id,
            fields: []
          }
          Object.keys(form).forEach(key => {
            if (typeof (form[key]) == 'string') form[key] = form[key] != '' ? [form[key]] : []
            let item = this.scaleInfo.fields.find(item => item.config.index == key)
            let dict = {
              field_id: item.id,
              value: form[key]
            }
            params.fields.push(dict)
          })

          this.submitLoading = true
          this.$api.cfRecords.create(params).then(res => {
            // console.log('提交成功!')
            this.success = true
            this.$message.success('提交成功!')
          }).catch(err => {
            this.$message.error(err)
          }).finally(() => {
            this.submitLoading = false
          })
        } else {
          this.$message.warning('请检查表单是否填写完整!')
          return false
        }
      })

    }
  }, // methods end
  computed: {
    ENUM_QUESTION_TYPE() {
      return this.$enum.QUESTION_TYPE
    },
    status() {
      if (this.previewMode || this.readonly) return 'normal'
      else if (this.success) return 'success'
      else if (this.scaleInfo.status == 'draft') return 'draft'
      else if (dayjs().isAfter(dayjs(this.scaleInfo.end_time)) || dayjs().isBefore(dayjs(this.scaleInfo.start_time))) return 'outOfDate'
      else return 'normal'
    }
  },
}
</script>

<style scoped lang="less">
.px2vw (@attr, @px) {
  @vw: (@px / 375) * 100;
    @{attr}: ~"@{vw}vw";
}

@titleColor: #BBBED1;
@textColor: #A2A4B6;
@titleSize: (24vw / 375) * 100vw;
@textSize: (14vw / 375) * 100vw;
@textSizeSmall: (14vw / 375) * 100vw;
@titleYellow: #EEC61A;
@topOffset: 20;

@1px: (1vw / 375) * 100vw;
@2px: (2vw / 375) * 100vw;
@3px: (3vw / 375) * 100vw;
@4px: (4vw / 375) * 100vw;
@5px: (5vw / 375) * 100vw;
@6px: (6vw / 375) * 100vw;
@7px: (7vw / 375) * 100vw;
@8px: (8vw / 375) * 100vw;
@9px: (9vw / 375) * 100vw;
@10px: (9vw / 375) * 100vw;

.container {
  position: relative;
  min-width: unset;
  width: calc(100vw - 40px);
  height: calc(100vh - 40px);
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px;
}

.form-container {
  border-top: 1px dashed #eee;
  padding: 10px 0;
  margin-top: 30px;

  :deep(.el-form-item) {
    .el-form-item__label {
      height: auto;
      line-height: 2;
    }

    .el-form-item__content {
      .el-checkbox-group {
        .el-checkbox {
          display: flex;
        }

        .el-checkbox__input {
          .el-checkbox__inner {
            top: @6px;
          }
        }

        .el-checkbox__label {
          width: calc(100% - @10px);
          height: auto;
          white-space: pre-line;
          word-wrap: break-word;
          line-height: 2;
        }
      }

      .el-radio-group {
        .el-radio {
          display: flex;
        }
        .el-radio__input {
          .el-radio__inner {
            top: @6px;
          }
        }

        .el-radio__label {
          width: calc(100% - @10px);
          height: auto;
          white-space: pre-line;
          word-wrap: break-word;
        }
      }
    }
  }

  :deep(.el-checkbox), :deep(.el-radio-group), :deep(.el-radio) {
    display: block;
    line-height: 2;
    margin-right: 0;
  }

  .is-pass :deep(.el-form-item__label) {
    color: #999 !important;
  }

  .readonly {
    pointer-events: none;
  }
}

.title {
  color: @primaryColor;
  font-weight: bold;
  //font-size: @titleSize;
  .px2vw(font-size, 24);
}

.instructions {
  color: #666;
  .px2vw(font-size, 14);
}

.jumping-tip {
  color: @textColor;
}

.bottom-btn {
  margin-top: 20px;
  padding-bottom: calc(10px + constant(safe-area-inset-bottom));
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
}

.box {
  .px2vw(width, 110) !important;
  .px2vw(height, 110);
  .px2vw(margin-top, 64);
  .px2vw(margin-left, 32);
  background: @primaryColor;
  //box-shadow: 0 (2vw/375)*100 (5vw/375)*100 0 rgba(0, 0, 0, 0.5000);
  box-shadow: 0 @2px @5px 0 rgba(0, 0, 0, 0.5000);
}

.submit-success {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #eee;

  .inner-wrap {
    width: 80vw;
    height: 400px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #fff;
    border-radius: 10px;

    .icon-wrap {
      margin-bottom: 20px;

      i {
        font-size: 100px;
        color: @primaryColor;
      }

      &.warning i {
        color: #e6a23c !important;
      }

      &.danger i {
        color: #F56C6C !important;
      }
    }

    .tips-text {
      font-size: 28px;
      color: #666;
      text-align: center;
    }
  }
}

::-webkit-scrollbar {
  width: 8px; /*对垂直流动条有效*/
  height: 8px; /*对水平流动条有效*/
  cursor: pointer;
  background-color: transparent;
  position: absolute;
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  background-color: transparent;
}


/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background-color: #DDDEE0;

  &:hover {
    background-color: #cecece;
  }
}
</style>
