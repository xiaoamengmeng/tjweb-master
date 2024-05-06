<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/solution_tpl'}">
        <b>干预方案模板</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" style="margin-top: 0;">
      <div class="list-title">
        标题
        <el-input
          v-model="tplTitle"
          class="mb_20"
          placeholder="输入营养方案标题"
          :readonly="type === 'view'"
          style="width: 450px; margin-left: 10px;"
        ></el-input>
      </div>
      <m-editor
        ref="editor"
        class="editor-box"
        :content.sync="content"
        mode="default"
        :disabled="type === 'view'"
      ></m-editor>
      <div class="mt_20">
        <m-button v-show="type !== 'view'" @click="save">保存</m-button>
        <m-button plain @click="$router.go(-1)">返回</m-button>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('setDietTpl', true)

export default {
  name: 'SetDietTpl',
  data() {
    return {
      type: 'create',
      title: '添加营养模板',
      tplTitle: '',
      content: '',
      tplId: '',
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
    initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', { type: data.type, id: params.id })
      }

      this.type = data.type
      this.tplId = data.id

      if (this.type === 'create') {
        this.title = '添加营养方案'
      } else if (this.type === 'edit') {
        this.getDietTpl(data.id)
        this.title = '编辑营养方案'
      } else if (this.type === 'view') {
        this.getDietTpl(data.id)
        this.title = '查看营养方案'
      }
    },
    getDietTpl(id) {
      this.$api.dietTpl.getDetail(id)
        .then((res) => {
          const tpl = res.data
          this.tplTitle = tpl.name
          this.content = tpl.content
          this.$refs.editor.setContent(tpl.content)
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    save() {
      if (this.tplTitle === '') {
        return this.$message.error('请填写标题')
      }
      if (this.content === '' || this.content === '<p><br></p>') {
        return this.$message.error('请填写内容')
      }
      if (this.type === 'create') {
        this.create()
      } else {
        this.update()
      }
    },
    create() {
      this.$api.dietTpl.create({
        name: this.tplTitle,
        content: this.content
      })
        .then((res) => {
          this.$message.success('添加成功')
          this.tplTitle = ''
          this.$refs.editor.clear()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    update() {
      this.$api.dietTpl.update(this.tplId, {
        name: this.tplTitle,
        content: this.content
      })
        .then((res) => {
          this.$message.success('保存成功')
        })
        .catch((err) => {
          console.log(err)
          this.$message.error(JSON.stringify(err))
        })

    },
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
.panel {
  .card {
    margin-top: 0 !important;
    //height: calc(100vh - 32px - 32px - 48px);
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
    height: 500px;
  }

  :deep(.toolbar) {
    border-radius: 0;
  }
}

.calc-dialog {
  .form-box {
    .el-form-item {
      width: 70%;
    }
  }
}

.list-title {
  height: 40px;
  border: 1px solid #D9E1EC;
  border-bottom: unset;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 20px 0 20px 20px;
  margin: 0 !important;
  background-color: #f4f5fa;
}
</style>
