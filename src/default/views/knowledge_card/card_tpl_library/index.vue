<template>
  <div class="panel scroll">
    <div class="header"></div>
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{path: '/knowledge_card'}">
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>知识卡</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        知识卡模板库
      </el-breadcrumb-item>
      <m-button class="common-add-btn" icon="el-icon-data-board" @click="createTplClick" style="right: 32px;">
        新建模板
      </m-button>
    </el-breadcrumb>

    <div class="card">
      <m-table
        ref="table"
        class="m-table"
        :data="kcardTplList"
        :total="kcardTplTotal"
        :page-sizes="[10, 15, 20]"
        :page-size.sync="kcardTplPageSize"
        :current-page.sync="kcardTplPage"
        :height="360"
        :get-data-func="getKcardTplList"
      >
        <el-table-column
          show-overflow-tooltip
          prop="id"
          label="模板ID"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="extra.layoutLabel"
          label="布局"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="预览图"
          min-width="120"
          align="center"
        >
          <template v-slot="scope">
            <el-image
              :src="scope.row.image"
              style="width: auto; height: 60px;cursor: pointer;"
              fit="cover"
              @click.native.stop="previewClick(scope.row)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="updated_at"
          min-width="120"
          label="创建时间"
        >
          <template v-slot="scope">
            {{ scope.row.created_at | dateFormatWithoutTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="120"
          align="center"
        >
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.extra.status == '1'" effect="dark">启用</el-tag>
            <el-tag type="info" v-if="scope.row.extra.status == '0'" effect="dark">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px">
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                        title="编辑" @click.native="editTplClick(scope.row)"></icon-box>
              <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                        @click.native="deleteClick(scope.row)"></icon-box>
            </div>
          </template>
        </el-table-column>
      </m-table>

      <div class="mt_20 mb_10 relative">
        <el-radio-group @change="viewsModeChange" class="radio-group" v-model="viewsMode">
          <el-radio-button label="布局"></el-radio-button>
          <el-radio-button label="背景图"></el-radio-button>
        </el-radio-group>
      </div>

      <template v-if="viewsMode === '布局'">
        <card-carousel
          class="card-layout-carousel"
          mode="custom"
        >
          <card-layout
            class="card-layout-list"
            v-for="(item, index) in layoutList"
            :key="'card-layout' + index"
            :config="item"
            :width="180"
            :height="240"
            :title="item.label"
            hide-btn
            bg-color
          ></card-layout>
        </card-carousel>
      </template>
      <template v-else>
        <card-carousel
          class="card-bg-carousel"
          mode="img"
          :items="sysBgList"
          :item-width="180"
          :item-height="240"
          :window-size="4"
          :pagination-factor="220"
          btn-text="删除"
          @itemUse="bgDeleteClick"
          :prefix-count="1"
        >
          <template #prefix>
            <div class="used-img-upload relative">
              <m-upload
                ref="sysBgUpload"
                class="upload-box"
                :image-url.sync="sysBgUploadFiles.imgSrc"
                :image-path.sync="sysBgUploadFiles.image_path"
                accept=".jpg,.jpeg,.png,.gif"
                hide-tips
                @upload-success="sysBgUploadSuccess"
              >
                <div class="flex flex_column">
                  <i class="el-icon-plus"></i>
                  <span>上传背景图</span>
                </div>
              </m-upload>
            </div>
          </template>
        </card-carousel>
      </template>
    </div>

    <el-dialog
      :title="setTplTitle"
      :visible.sync="setKcardTplVisible"
      class="custom-creation-dialog"
    >
      <div class="creation-box">
        <div class="card-editor">
          <div class="left">
            <card-builder
              ref="cardBuilder"
              class="card-box"
              width="180"
              height="240"
              :config="cardModel"
              bg-color
            ></card-builder>
          </div>
          <div class="right">
            <el-form
              class="form-box"
              :model="form"
              ref="form"
              label-position="right"
              label-width="70px"
            >
              <el-row>
                <el-row>
                  <el-form-item label="名称" required>
                    <el-input v-model="form.name" placeholder="请输入名称" clearable></el-input>
                  </el-form-item>
                </el-row>
                <el-form-item label="布局" required>
                  <el-select
                    v-model="form.layout"
                    placeholder="请选择"
                    style="width: 100%;"
                    clearable
                    @change="layoutChange"
                  >
                    <el-option
                      v-for="item in layoutList"
                      :key="item.code"
                      :label="item.label"
                      :value="item.layout"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="状态" required>
                  <el-radio-group v-model="form.status" style="position: relative; top: 4px;">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div class="creation-box">
        <div class="list-title">选择布局</div>
        <card-carousel
          mode="layout"
          :items="layoutList"
          item-width="180"
          item-height="240"
          :window-size="4"
          :pagination-factor="220"
          @itemUse="userLayout"
          show-layout-card-title
        ></card-carousel>
        <div class="list-title">选择背景图</div>
        <card-carousel
          mode="img"
          :items="sysBgList"
          item-width="180"
          item-height="240"
          :window-size="4"
          :pagination-factor="220"
          @itemUse="userSysBg"
        ></card-carousel>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button plain @click="setKcardTplVisible = false" w="80px">取 消</m-button>
        <m-button @click="saveCardTpl" w="80px">确 定</m-button>
      </span>
    </el-dialog>

    <card-builder style="width: 0;height: 0; overflow: hidden;" ref="cardTplPreview"  :config="currentTplConfig"></card-builder>

  </div>
</template>

<script>
import CardCarousel from '../components/CardCarousel'
import CardTpl from '../components/CardTpl'
import CardLayout from '../components/CardLayout'
import CardImage from '../components/CardImage'
import CardBuilder from '../components/CardBuilder'
import { mapGetters } from 'vuex'

export default {
  name: 'CardTplLibrary',
  components: {
    CardImage,
    CardLayout,
    CardTpl,
    CardCarousel,
    CardBuilder,
  },
  data() {
    return {
      viewsMode: '布局',
      kcardTplList: [],
      kcardTplTotal: 0,
      kcardTplPageSize: 10,
      kcardTplPage: 1,

      assignedForm: {},
      assignedRules: {},

      layoutList: [],
      sysBgList: [],

      sysBgUploadFiles: {
        imgSrc: '',
        image_path: '',
      },

      cardModel: {
        src: '',
        layout: ''
      },
      setKcardTplVisible: false,

      setTplTitle: '创建知识卡模板',

      form: {
        name: '',
        layout: '',
        status: 1,
      },

      usedLayout: {},
      usedSysBg: {},
      tplInfo: {},
      currentTplConfig: {
        layout: '',
        src: '',
      }
    }
  },
  watch: {
    'cardModel': {
      deep: true,
      handler: function (obj) {
        this.usedLayout = this.layoutList.find(item => item.layout === obj.layout)
        this.form.layout = obj.layout
      }
    },
    setKcardTplVisible(n) {
      if (!n) {
        this.tplInfo = {}
        Object.assign(this.$data.cardModel, this.$options.data().cardModel)
        Object.assign(this.$data.form, this.$options.data().form)
      }
    }
  },
  mounted() {
    this.getKcardTplList()
    this.layoutList = this.$dict.cardLayout.data
  },
  methods: {
    getKcardTplList() {
      this.$refs.table.loadStart()
      this.$api.kcardTpl.getList({
        page: this.kcardTplPage,
        page_size: this.kcardTplPageSize,
        ordering: '-updated_at',
      })
        .then((res) => {
          this.kcardTplList = res.data.results
          this.kcardTplTotal = res.data.count
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getSysBgList() {
      this.$api.kcardSysBg.getList({
        ordering: 'id',
      })
        .then((res) => {
          this.sysBgList = res.data.results.map(item => {
            return {
              ...item,
              src: item.image
            }
          })
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    createTplClick() {
      this.usedLayout = {}
      this.usedSysBg = {}
      Object.assign(this.$data.form, this.$options.data().form)
      Object.assign(this.$data.cardModel, this.$options.data().cardModel)
      this.getSysBgList()
      this.setTplTitle = '创建知识卡模板'

      this.setKcardTplVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    editTplClick(data) {
      this.tplInfo = data
      this.form.name = data.name
      this.form.status = data.extra.status
      this.setTplTitle = '编辑知识卡模板'
      this.cardModel.src = data.image
      this.usedSysBg.image_path = data.image_path
      this.cardModel.layout = data.extra.layout
      this.setKcardTplVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    sysBgUploadSuccess(image_path) {
      this.$api.kcardSysBg.create({ image_path })
        .then((res) => {
          this.myBgList = res.data.results
          this.$message.success('背景图上传成功')
          this.$refs.sysBgUpload.handleRemove()
          this.getSysBgList()
        })
        .catch((err) => {
          // console.log(err)
          this.$message.error(JSON.stringify(err))
        })
    },
    deleteClick(row) {
      const tips = `确定删除模板【${row.name}】吗？`
      this.$confirm(tips, '删除模板', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.kcardTpl.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getKcardTplList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    bgDeleteClick(bg) {
      const tips = `确定删除背景图吗？`
      this.$confirm(tips, '删除背景图', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.kcardSysBg.delete(bg.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getSysBgList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    viewsModeChange() {
      if (this.viewsMode === '背景图') {
        this.getSysBgList()
      }
    },
    userLayout(config) {
      this.usedLayout = config
      this.cardModel.layout = config.layout
    },
    userSysBg(config) {
      this.usedSysBg = config
      if (config.src) {
        this.cardModel.src = config.src
      }
    },
    layoutChange(value) {
      this.cardModel.layout = value
    },
    validForm() {
      if (this.form.name === '') {
        this.$message.error('请输入名称')
        return false
      }
      if (this.form.layout === '') {
        this.$message.error('请选择布局')
        return false
      }
      if (this.form.status === '') {
        this.$message.error('请选择状态')
      }
      if (this.cardModel.src === '' || !this.usedSysBg.image_path) {
        this.$message.error('请选择背景图')
        return false
      }
      return true
    },
    saveCardTpl() {
      // this.$refs.cardBuilder.build()
      if (this.validForm()) {
        const params = {
          name: this.form.name,
          image_path: this.usedSysBg.image_path,
          extra: {
            layout: this.usedLayout.layout,
            layoutLabel: this.usedLayout.label,
            status: this.form.status
          },
          creator_id: this.userInfo.id
        }

        if (this.setTplTitle === '创建知识卡模板') {
          this.$api.kcardTpl.create(params)
            .then((res) => {
              this.$message.success('创建成功')
              this.getKcardTplList()
              this.setKcardTplVisible = false
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        } else {
          this.$api.kcardTpl.update(this.tplInfo.id, params)
            .then((res) => {
              this.$message.success('编辑成功')
              this.getKcardTplList()
              this.setKcardTplVisible = false
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        }
      }
    },
    previewClick(row) {
      this.currentTplConfig = {
        layout: row.extra.layout,
        src: row.image
      }
      const {cardTplPreview} = this.$refs
      if(cardTplPreview) {
        this.$nextTick(() => {
          cardTplPreview.preview()
        })
      }
    },
  }, // methods end
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
}
</script>

<style scoped lang="less">
.panel {
  .card {
    position: relative;
    z-index: 999;
    margin-top: 0 !important;
    //height: calc(100vh - 32px - 32px - 48px);
    min-height: calc(100% - 90px - 96px);
  }
}

.breadcrumb-reset {
  min-width: calc(1440px - 250px - 32px);
  .common-add-btn {
    position: static;
    float: right;
    margin-top: 32px;
    margin-right: 32px;
  }

}
.breadcrumb-reset{
  :deep(.el-breadcrumb__item:last-of-type) {
    .el-breadcrumb__separator {
      display: none;
    }
  }
}

.radio-group {
  width: 250px;
  height: 46px;
  border-radius: 23px;
  background-color: #F4F5FA;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-radio-button :deep(.el-radio-button__inner) {
    width: 91px;
    height: 34px;
    line-height: 34px;
    padding: 0;
    border-radius: 17px;
    border: none;
    user-select: none;
    color: #000;
    background-color: #F4F5FA;

    &:hover {
      color: #797979;
    }
  }

  .el-radio-button.is-active {
    border: none;

    :deep(.el-radio-button__inner) {
      height: 34px;
      line-height: 34px;
      padding: 0;
      background: #344563;
      border: none;
      user-select: none;
      color: #fff;
    }
  }

  .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
    box-shadow: unset;
  }
}


.m-table {
  height: calc(100% - 155px);

  :deep(.el-table__body-wrapper) {
    overflow-x: hidden;
  }

  .el-link {
    color: #00B386;
    text-decoration: none;
  }
}

.card-layout-carousel {
  :deep(.card-carousel-wrapper) {
    justify-content: flex-start;
    margin-bottom: 0;

    .card-carousel--nav__left {
      display: none;
    }

    .card-carousel--nav__right {
      display: none;
    }
  }
}

.used-img-upload {
  .upload-box {
    width: 180px;
    height: 240px;
    overflow: hidden;
    margin: 0 20px;
    margin-left: 0;

    :deep(.el-upload-list__item) {
      transition: none !important;
    }

    :deep(.el-upload-dragger) {
      i {
        position: relative;
        top: 60px;
      }

      :hover i {
        color: @primaryColor;
      }
    }

    :deep(.el-upload--picture-card) {
      width: 100%;
      height: 100%;
    }
  }
}


.card-bg-carousel {
  :deep(.card-carousel-wrapper) {
    justify-content: flex-start;
    margin-bottom: 0;

    .card-carousel {
      justify-content: flex-start;
    }
  }
}

.custom-creation-dialog {
  :deep(.el-dialog) {
    width: 1020px;
    height: 860px;
    margin-top: 5vh !important;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .preview-card {
    width: 240px;
    height: 320px;
    background-color: #f44336;
  }

  .used-img-upload {
    .upload-box {
      width: 180px;
      height: 240px;
      overflow: hidden;
      margin: 0 20px;
      margin-left: 0;

      :deep(.el-upload-list__item) {
        transition: none !important;
      }

      :deep(.el-upload-dragger) {
        i {
          position: relative;
          top: 60px;
        }

        :hover i {
          color: @primaryColor;
        }
      }

      :deep(.el-upload--picture-card) {
        width: 100%;
        height: 100%;
      }
    }
  }

  .list-title {
    position: relative;
    left: 30px;
    font-size: 14px;
    font-weight: 600;
    color: #5A6D86 !important;
    line-height: 40px;
  }
}

.creation-box {
  width: 100%;

  .card-editor {
    height: 280px;
    margin-bottom: 20px;

    .left {
      width: 220px;
      height: 100%;

      .card-box {
        width: 180px;
        height: 240px;
        float: right;
      }

      .el-button {
        display: block;
        margin: 0 auto;
        margin-top: 10px;
      }
    }

    .right {
      width: calc(100% - 220px);
      height: 100%;

      .form-box {
        width: 710px;

        .el-textarea {
          :deep(.el-textarea__inner) {
            height: 140px;
            resize: none;
          }
        }
      }
    }
  }
}

.custom-creation-dialog {
  :deep(.card-carousel-wrapper) {
    justify-content: flex-start;

    .card-carousel {
      justify-content: flex-start;
    }
  }
}
</style>
