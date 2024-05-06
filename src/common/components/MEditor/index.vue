<template>
  <div class="m-editor">
    <div class="mask"></div>
    <template v-if="mode === 'simple'">
      <Editor
        ref="simpleEditor"
        class="editor simple"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
      <Toolbar
        class="toolbar simple"
        :editor="editor"
        :defaultConfig="simpleToolbarConfig"
        :mode="mode"
      />
    </template>
    <template v-else>
      <Toolbar
        class="toolbar default"
        :editor="editor"
        :defaultConfig="defaultToolbarConfig"
        mode="default"
      />
      <Editor
        ref="editor"
        :defaultConfig="editorConfig"
        class="editor default"
        v-model="html"
        mode="default"
        @onCreated="onCreated"
      />
    </template>

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
          <el-input v-model="calcForm.calorie" :value="calcForm.calorie" placeholder="根据体重自动计算"
                    disabled></el-input>
          <div style="position: absolute; right: -40px; bottom: 0;">千卡</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="hideCalorieCalc">取 消</m-button>
        <m-button @click="insertCalorie">插 入</m-button>
      </span>
    </el-dialog>

    <el-upload
      ref="upload"
      :file-list="fileList"
      action=""
      :auto-upload="false"
      :on-change="onChange"
      v-show="false"
    >
    </el-upload>
  </div>
</template>

<script>
import { Boot } from '@wangeditor/editor'
import calcCalorieMenu from './calcCalorieMenu'

const myMenuConf = {
  key: '热量计算器',
  factory() {
    return new calcCalorieMenu()
  }
}
Boot.registerMenu(myMenuConf)

export default {
  name: 'MEditor',
  props: {
    content: {
      type: String
    },
    mode: {
      type: String,
      default: 'simple'
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      editor: null,
      html: '',
      simpleToolbarConfig: {
        toolbarKeys: [
          "headerSelect",
          // 'header1',
          // 'header2',
          // 'header3',
          'bold',
          'italic',
          {
            "key": "group-justify",
            "title": "对齐",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
            "menuKeys": [
              "justifyLeft",
              "justifyRight",
              "justifyCenter",
              "justifyJustify"
            ]
          },
          "numberedList",
          "bulletedList",
          {
            "key": "group-image",
            "title": "图片",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
            "menuKeys": [
              "insertImage",
              "uploadImage"
            ]
          },
          'insertLink',
          'blockquote',
        ]
      },
      defaultToolbarConfig: {
        toolbarKeys: [
          "headerSelect",
          "blockquote",
          "|",
          "bold",
          "underline",
          "italic",
          "color",
          "bgColor",
          "|",
          "fontSize",
          "lineHeight",
          "|",
          "bulletedList",
          "numberedList",
          {
            "key": "group-justify",
            "title": "对齐",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
            "menuKeys": [
              "justifyLeft",
              "justifyRight",
              "justifyCenter",
              "justifyJustify"
            ]
          },
          {
            "key": "group-indent",
            "title": "缩进",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
            "menuKeys": [
              "indent",
              "delIndent"
            ]
          },
          "insertTable",
          "emotion",
          "divider",
          "insertLink",
          "|",
          {
            "key": "group-image",
            "title": "图片",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
            "menuKeys": [
              "insertImage",
              "uploadImage"
            ]
          },
          "|",
          "undo",
          "redo",
          "|",
          "热量计算器"
          // "fullScreen"
        ]
      },
      editorConfig: {
        MENU_CONF: {
          uploadImage: {
            customBrowseAndUpload: this.customImageUpload
          }
        }
      },

      calorieCalcVisible: false,
      calcForm: {
        weight: '',
        calorie: ''
      },
      calcRules: {},

      fileList: [],
      insertFn: () => {
      }
    }
  },
  watch: {
    content(n) {
      // this.html = n
    },
    html() {
      this.$emit('update:content', this.html)
    },
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  mounted() {
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      if (this.disabled) {
        this.editor.disable()
      }
    },
    setContent(content) {
      this.html = content
    },
    clear() {
      this.html = ''
      this.$emit('update:content', '')
    },
    showCalorieCalc() {
      this.calorieCalcVisible = true
    },
    hideCalorieCalc() {
      this.calorieCalcVisible = false
    },
    insertCalorie(text) {
      this.hideCalorieCalc()
    },
    customImageUpload(insertFn) {
      this.insertFn = insertFn
      this.$refs.upload.$children[0].$refs.input.click()
    },
    onChange(file, fileList) {
      this.fileList = [file]
      this.$cos.uploadFile(this.fileList)
        .then((res) => {
          const imageUrl = 'https://' + res.data.Location
          this.insertFn(imageUrl, file.name, res.uploadKey.path_list[0])
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, // methods end
}
</script>

<style scoped lang="less">
.m-editor {
  :deep(.w-e-text-container) {
    h1 {
      font-size: 2em;
    }
  }
}

.editor {
  box-sizing: border-box;
  height: 340px;
  overflow-y: hidden;
  border-radius: 8px;
  border: 1px solid #D9E1EC;
}

.toolbar {
  //height: 35px;
  box-sizing: border-box;
  border: 1px solid #D9E1EC;

  :deep(.w-e-bar.w-e-bar-show.w-e-toolbar) {
    //height: 33px;
    line-height: 33;
    background-color: #f4f5fa !important;

    .w-e-bar-item {
      height: inherit;
    }
  }

  :deep(.w-e-bar-item-group .w-e-bar-item-menus-container) {
    top: -7px;
  }
}

.editor.default {
  border-radius: 0 0 8px 8px;
  border-top: unset;
}

.toolbar.default {
  border-radius: 8px 8px 0 0;
  //height: 80px;
  background-color: #f4f5fa;

  :deep(.w-e-bar.w-e-bar-show.w-e-toolbar) {
    border-radius: 8px 8px 0 0;

    .w-e-bar-item {
      //height: inherit;
    }
  }
}

.editor.simple {
  height: 152px;
  border-bottom-left-radius: unset;
  border-bottom-right-radius: unset;
  border-bottom: unset;
}

.toolbar.simple {
  height: 35px;
  box-sizing: border-box;
  border: 1px solid #D9E1EC;
  border-radius: 0 0 8px 8px;

  :deep(.w-e-bar.w-e-bar-show.w-e-toolbar) {
    border-radius: 0 0 8px 8px;

    .w-e-bar-item {
      height: inherit;
    }
  }

  :deep(.w-e-bar-item-group .w-e-bar-item-menus-container) {
    top: -7px;
  }
}

.calc-dialog {
  .form-box {
    .el-form-item {
      width: 70%;
    }
  }
}

.editor.default {
  :deep(.w-e-text-container) {
    .w-e-model {
      top: 10px;
    }

    .babel-container {
      height: 55px;

      > span {
        height: 24px;
      }
    }
  }
}

</style>
