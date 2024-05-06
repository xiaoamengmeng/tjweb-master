<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        知识卡管理
      </el-breadcrumb-item>
    </el-breadcrumb>
<!-- ,{
      name: '修改',
      codename: 'knowledgeCard.update',
    },{
      name: '删除',
      codename: 'knowledgeCard.delete',
    },{
      name: '知识卡模板库',
      codename: 'knowledgeCard.templateLibrary',
    },{
      name: '按模板创作',
      codename: 'knowledgeCard.templateCreate',
    },{
      name: '上传图片',
      codename: 'knowledgeCard.uploadImg',
    } -->
    <m-button v-auth="'knowledgeCard.templateLibrary'" class="common-add-btn" icon="el-icon-data-board" @click="toLibrary" style="right: 298px;">知识卡模板库
    </m-button>
    <m-button v-auth="'knowledgeCard.templateCreate'" class="common-add-btn" icon="el-icon-brush" @click="creationClick" style="right: 158px;">按模板创作
    </m-button>
    <m-button v-auth="'knowledgeCard.uploadImg'" class="common-add-btn" icon="el-icon-upload2" @click="uploadImageCard">上传图片</m-button>
    <div class="card">
      <div class="container">

        <el-form
          class="form-box"
          :model="searchForm"
          ref="form"
          label-position="top"
        >
          <div class="search-bar">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                    :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="6">
                <el-row class="label-t">知识卡名称</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-input
                      v-model="searchForm.name"
                      clearable
                      placeholder="请输入知识卡名称搜索"
                    ></el-input>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">分类</el-row>
                <el-row>
                  <el-form-item prop="stage">
                    <el-select
                      v-model="searchForm.category"
                      placeholder="全部"
                      clearable
                    >
                      <el-option
                        v-for="cate in category"
                        :key="cate.id"
                        :label="cate.name"
                        :value="cate.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col class="search-bar-col" :span="10">
                <el-row class="label-t">&nbsp;</el-row>
                <el-row>
                  <m-button @click="page=1;getKcardList()" icon="el-icon-search" h="40px" w="100px">搜索</m-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <m-table
          class="m-table"
          ref="table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100% - 8px - 15px - 15px)'"
          :get-data-func="getKcardList"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="知识卡ID"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="知识卡名称"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="category.name"
            label="分类"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="预览图"
            min-width="80"
            align="center"
          >
            <template v-slot="scope">
              <el-image
                :src="scope.row.image"
                style="width: auto; height: 60px;"
                fit="cover"
                :preview-src-list="[scope.row.image]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="120"
          >
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box v-auth="'knowledgeCard.update'" v-if="scope.row.extra && scope.row.extra.custom" icon-name="table_edit" w="39" h="39"
                          box-w="39" style="cursor:pointer;"
                          title="编辑"
                          @click.native="scope.row.extra.use_tpl ? editTplCard(scope.row) : editCustomCard(scope.row)"></icon-box>
                <icon-box v-auth="'knowledgeCard.update'" v-else icon-name="table_edit" w="39" h="39"
                          box-w="39" style="cursor:pointer;"
                          title="编辑"
                          @click.native="editImageKcardClick(scope.row)"></icon-box>
                <icon-box v-auth="'knowledgeCard.delete'"  icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                          @click.native="deleteClick(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
      </div>
    </div>

    <el-dialog
      :title="creationDialogTitle"
      :visible.sync="creationDialogVisible"
      class="creation-dialog"
    >
      <div class="creation-box">
        <div class="card-editor">
          <div class="left">
            <card-builder
              ref="tplCardBuilder"
              class="card-build-box"
              style="margin: 0 auto;"
              width="180"
              height="240"
              :config="cardModel"
              bg-color
            ></card-builder>
            <div>
              <m-button w="180px" h="40px" @click="customCreationClick">自定义创作</m-button>
            </div>
          </div>
          <div class="right">
            <el-form
              class="form-box"
              :model="cardForm"
              ref="form"
              label-position="right"
              label-width="70px"
            >
              <el-row>
                <el-form-item label="分类" required>
                  <el-select
                    v-model="cardForm.category_id"
                    placeholder="请选择"
                    style="width: 100%;"
                    clearable
                  >
                    <el-option
                      v-for="cate in category"
                      :key="cate.id"
                      :label="cate.name"
                      :value="cate.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="标题" required>
                  <el-input placeholder="请输入标题" maxlength="20" show-word-limit v-model="cardForm.title"
                            clearable></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="描述" required class="textarea-box">
                  <el-input placeholder="请输入描述" maxlength="300" show-word-limit v-model="cardForm.desc"
                            type="textarea"></el-input>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="list-title">模板库推荐</div>
        <card-carousel
          mode="tpl"
          :items="kcardTplList"
          item-width="180"
          item-height="240"
          :window-size="4"
          :pagination-factor="220"
          @itemUse="tplCardUse"
        ></card-carousel>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="creationDialogVisible = false" w="120px">取 消</m-button>
        <m-button @click="submitTplKcard" :loading="kcardSubmitLoading" w="120px">上 传</m-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="customCreationDialogTitle"
      :visible.sync="customCreationDialogVisible"
      class="custom-creation-dialog"
    >
      <div class="creation-box">
        <div class="card-editor">
          <div class="left">
            <card-builder
              ref="customCardBuilder"
              class="card-box"
              width="180"
              height="240"
              :config="customCardModel"
              bg-color
            ></card-builder>
          </div>
          <div class="right">
            <el-form
              class="form-box"
              :model="customCardForm"
              ref="form"
              label-position="right"
              label-width="70px"
            >
              <el-row>
                <el-form-item label="分类" required>
                  <el-select
                    v-model="customCardForm.category_id"
                    placeholder="请选择"
                    style="width: 100%;"
                    clearable
                  >
                    <el-option
                      v-for="cate in category"
                      :key="cate.id"
                      :label="cate.name"
                      :value="cate.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="标题" required>
                  <el-input type="text" placeholder="请输入标题" maxlength="20" show-word-limit
                            v-model="customCardForm.title"
                            clearable></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="描述" required class="textarea-box">
                  <el-input placeholder="请输入描述" maxlength="300" show-word-limit v-model="customCardForm.desc"
                            type="textarea"></el-input>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="list-title">选择布局</div>
        <card-carousel
          mode="layout"
          :items="layoutList"
          item-width="180"
          item-height="240"
          :window-size="4"
          :pagination-factor="220"
          @itemUse="layoutCardUse"
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
          @itemUse="bgCardUse"
        ></card-carousel>
        <div class="list-title">我的常用背景图</div>
        <card-carousel
          mode="img"
          :items="myBgList"
          item-width="180"
          item-height="240"
          :window-size="4"
          :pagination-factor="220"
          @itemUse="bgCardUse"
          :prefix-count="1"
        >
          <template #prefix>
            <div class="used-img-upload relative">
              <m-upload
                ref="myBgUpload"
                class="upload-box"
                :image-url.sync="myBgUploadFiles.imgSrc"
                :image-path.sync="myBgUploadFiles.image_path"
                accept=".jpg,.jpeg,.png,.gif"
                hide-tips
                @upload-success="myBgUploadSuccess"
              >
                <div class="flex flex_column">
                  <i class="el-icon-plus"></i>
                  <span>本地上传背景图</span>
                </div>
              </m-upload>
            </div>
          </template>
        </card-carousel>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="customCreationDialogVisible = false" w="120px">取 消</m-button>
        <m-button :loading="kcardSubmitLoading" @click="submitCustomCard" w="120px">上 传</m-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="uploadImageCardDialogTitle"
      :visible.sync="uploadImageCardDialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="upload-kcard-dialog"
    >
      <template v-if="uploadImageCardDialogTitle === '上传知识卡'">
        <m-button v-if="singleUpload" w="100px" h="40px" class="mb_20" @click="toggleUploadMode">批量上传</m-button>
        <m-button v-if="!singleUpload" w="100px" h="40px" class="mb_20" @click="singleUploadMode">单张上传</m-button>
      </template>
      <template
        v-if="singleUpload"
      >
        <el-row
          class="img-card-row"
          v-for="(uploadFile, index) in uploadFiles"
          :key="'uploadFile' + index"
        >
          <el-col :span="8" class="img-card-upload flex justify_center align_center">
            <m-upload
              class="upload-box"
              :image-url.sync="uploadFile.imgSrc"
              :image-path.sync="uploadFile.image_path"
              accept=".jpg,.jpeg,.png,.gif"
              success-tips="图片上传成功"
            ></m-upload>
          </el-col>
          <el-col :span="16" class="img-card-info">
            <el-descriptions title="" :column="1" border>
              <el-descriptions-item>
                <template slot="label">
                  分类
                  <div class="dot"></div>
                </template>
                <el-select
                  v-model="uploadFile.category_id"
                  placeholder="请选择"
                  style="width: 100%;"
                  clearable
                >
                  <el-option
                    v-for="cate in category"
                    :key="cate.id"
                    :label="cate.name"
                    :value="cate.id"
                  ></el-option>
                </el-select>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  标题
                  <div class="dot"></div>
                </template>
                <el-input maxlength="20" show-word-limit v-model="uploadFile.name" clearable
                          placeholder="请输入标题"></el-input>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  描述
                </template>
                <div class="textarea-box" style="height: 130px;">
                  <el-input placeholder="请输入描述" type="textarea" maxlength="300" show-word-limit
                            v-model="uploadFile.summary"
                            row="2"></el-input>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row
          class="img-card-row"
          v-for="(uploadFile, index) in uploadFiles"
          :key="'uploadFile' + index"
        >
          <el-col :span="8" class="img-card-upload flex justify_center align_center">
            <m-upload
              class="upload-box"
              :image-url.sync="uploadFile.imgSrc"
              :image-path.sync="uploadFile.image_path"
              accept=".jpg,.jpeg,.png,.gif"
              success-tips="图片上传成功"
            ></m-upload>
          </el-col>
          <el-col :span="13" class="img-card-info">
            <el-descriptions title="" :column="1" border>
              <el-descriptions-item>
                <template slot="label">
                  分类
                  <div class="dot"></div>
                </template>
                <el-select
                  v-model="uploadFile.category_id"
                  placeholder="请选择"
                  style="width: 100%;"
                  clearable
                >
                  <el-option
                    v-for="cate in category"
                    :key="cate.id"
                    :label="cate.name"
                    :value="cate.id"
                  ></el-option>
                </el-select>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  标题
                  <div class="dot"></div>
                </template>
                <el-input v-model="uploadFile.name" maxlength="20" show-word-limit clearable
                          placeholder="请输入标题"></el-input>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  描述
                </template>
                <div class="textarea-box" style="height: 130px;">
                  <el-input
                    placeholder="请输入描述"
                    type="textarea" maxlength="300" show-word-limit
                    v-model="uploadFile.summary"
                    row="2"></el-input>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col style="border-left: 1px solid #D9E1EC;" :span="3" @click.native="deleteUploadItem(index)"
                  class="delete-icon-btn h_100 flex justify_center align_center">
            <i class="el-icon-delete" style="font-size: 32px;"></i>
          </el-col>
        </el-row>
      </template>
      <div>
        <m-button v-if="!singleUpload" w="100" h="40" @click="addUploadImageItem">添加</m-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button plain @click="uploadImageCardDialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="submitCard" w="80px" :loading="imageCardUploadLoading">上 传</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑知识卡"
      :visible.sync="editImageKcardDialogVisible"
      class="edit-image-kcard-dialog"
    >
      <div class="creation-box">
        <div class="card-editor">
          <div class="left">
            <div class="flex justify_center ">
              <m-upload
                style="width: 180px;height: 240px;"
                :image-url.sync="editImageKcardViewImage"
                :image-path.sync="editImageKcardForm.image_path"
                accept=".jpg,.jpeg,.png"
              ></m-upload>
            </div>
          </div>
          <div class="right">
            <el-form
              class="form-box"
              :model="editImageKcardForm"
              ref="form"
              label-position="right"
              label-width="60px"
            >
              <el-row>
                <el-form-item label="分类" required>
                  <el-select
                    v-model="editImageKcardForm.category_id"
                    placeholder="请选择"
                    style="width: 450px"
                    @change="getCategories"
                    clearable
                  >
                    <el-option
                      v-for="cate in category"
                      :key="cate.id"
                      :label="cate.name"
                      :value="cate.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="标题" required>
                  <el-input
                    v-model="editImageKcardForm.name"
                    style="width: 450px"
                    clearable
                    placeholder="请输入标题"
                    maxlength="20"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="描述">
                  <el-input
                    v-model="editImageKcardForm.summary"
                    type="textarea"
                    placeholder="请输入描述"
                    style="width: 450px"
                    maxlength="300"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="editImageKcardDialogVisible = false" w="120px">取 消</m-button>
        <m-button @click="editImageKcard" w="120px">保 存</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="生成知识卡"
      :visible.sync="builderDialog"
      class="builder-tips"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div class="flex justify_center align_center" style="font-size: 16px;">
        正在生成知识卡，请等待 <i class="el-icon-loading"></i>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="builderDialog = false" w="80px">关 闭</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CardCarousel from './components/CardCarousel'
import CardTpl from './components/CardTpl'
import CardBuilder from './components/CardBuilder'
import { mapGetters } from 'vuex'

export default {
  name: 'KnowledgeCard',
  components: {
    CardCarousel,
    CardTpl,
    CardBuilder,
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      searchForm: {
        name: '',
        category: '',
      },

      rules: {},
      current: {},
      creationDialogVisible: false,
      creationDialogTitle: '创作知识卡',
      customCreationDialogVisible: false,
      customCreationDialogTitle: '自定义创作',
      uploadImageCardDialogVisible: false,
      uploadImageCardDialogTitle: '上传知识卡',

      builderDialog: false,

      sysBgList: [],
      myBgList: [],
      layoutList: [],
      kcardTplList: [],

      cardForm: {
        category_id: '',
        title: '',
        desc: '',
      },
      cardModel: {
        src: '',
        layout: '',
        title: '',
        desc: '',
      },
      customCardForm: {
        category_id: '',
        title: '',
        desc: '',
      },
      customCardModel: {
        src: '',
        layout: '',
        title: '',
        desc: '',
      },

      uploadFiles: [
        {
          name: '',
          image_path: '',
          imgSrc: '',
          category_id: '',
          summary: '',
          extra: {},
        }
      ],

      singleUpload: true,

      myBgUploadFiles: {
        image_path: '',
        imgSrc: '',
      },

      category: [],
      form: {},
      imageCardUploadLoading: false,
      kcardSubmitLoading: false,

      usedKcardTpl: {},
      usedLayout: {},
      usedBg: {},
      kcardInfo: {},

      editImageKcardDialogVisible: false,
      editImageKcardForm: {
        category_id: '',
        name: '',
        summary: '',
        image: '',
        image_path: '',
      },
      editImageKcardViewImage: '',
    }
  },
  watch: {
    'cardForm': {
      deep: true,
      handler: function (obj) {
        this.cardModel.compareAssign(obj)
      }
    },
    'customCardForm': {
      deep: true,
      handler: function (obj) {
        this.customCardModel.compareAssign(obj)
      }
    },
    creationDialogVisible(n) {
      if (!n) {
        this.kcardInfo = {}
        this.usedKcardTpl = {}
        this.kcardSubmitLoading = false
        const _data = this.$options.data()
        Object.assign(this.$data.cardForm, _data.cardForm)
        Object.assign(this.$data.cardModel, _data.cardModel)
      }
    },
    customCreationDialogVisible(n) {
      if (!n) {
        this.creationDialogVisible = false
        this.kcardInfo = {}
        this.usedLayout = {}
        this.usedBg = {}
        this.kcardSubmitLoading = false
        const _data = this.$options.data()
        Object.assign(this.$data.customCardForm, _data.customCardForm)
        Object.assign(this.$data.customCardModel, _data.customCardModel)
      }
    },
  },
  mounted() {
    this.getKcardList()
    this.getCategoryList()
    this.layoutList = this.$dict.cardLayout.data
  },
  methods: {
    getKcardList() {
      const { table } = this.$refs
      if (table) table.loadStart()
      this.$api.kcard.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: '-updated_at',
        category: this.searchForm.category,
        search: this.searchForm.name
      })
        .then((res) => {
          this.tableData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          // console.log(err)
          this.$message.error(JSON.stringify(err))
        })
    },
    getMyBgList() {
      this.$api.kcardMyBg.getList()
        .then((res) => {
          this.myBgList = res.data.results.map(item => {
            return {
              ...item,
              src: item.image
            }
          })
        })
        .catch((err) => {
          // console.log(err)
          this.$message.error('获取我的常用背景图发生错误：' + JSON.stringify(err))
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
          // console.log(err)
          this.$message.error(JSON.stringify(err))
        })
    },
    getCategoryList() {
      this.$api.kcardCategories.getList()
        .then((res) => {
          this.category = res.data.results
        })
        .catch((err) => {
          console.log(err)
          this.$message.error(JSON.stringify(err))
        })
    },
    getKcardTplList() {
      this.$api.kcardTpl.getList({
        page: this.kcardTplPage,
        page_size: this.kcardTplPageSize,
        ordering: 'id',
      })
        .then((res) => {
          let list = []
          res.data.results.forEach((item) => {
            if (item.extra && item.extra.status === 1) {
              list.push({
                ...item,
                src: item.image,
                layout: item.extra.layout,
              })
            }
          })
          this.kcardTplList = list
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    toLibrary() {
      this.$router.push({
        name: 'CardTplLibrary'
      })
    },
    toSetDishPage() {
      this.$router.push({
        name: 'SetDish',
        params: {
          type: 'create',
        },
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除知识卡【${row.name}】吗？`, '删除知识卡', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then((res) => {
          this.$api.kcard.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getKcardList()
            })
            .catch((err) => {
              this.$message.error('删除知识卡发生错误：' + JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },
    editCard(row) {
      if (row?.extra?.type === 'template' ?? false) {
        this.creationDialogVisible = true
      } else {
        this.uploadImageCardDialogVisible = true
        this.uploadImageCardDialogTitle = '编辑知识卡'
      }
    },
    checkImageCard() {
      for (let i = 0; i < this.uploadFiles.length; i++) {
        const item = this.uploadFiles[i]
        if (item.image_path === '') {
          this.$message.error('存在未选择知识卡的项，请检查无误后再上传')
          return false
        }
        if (item.name === '' || item.category_id === '') {
          this.$message.error('存在空的标题或分类，请填写完毕后再点击上传')
          return false
        }
      }
      return true
    },
    postMultiImageCard() {
      const params = this.uploadFiles.map(item => {
        return {
          name: item.name,
          image_path: item.image_path,
          category_id: item.category_id,
          summary: item.summary,
          extra: {
            custom: false
          },
          creator_id: this.userInfo.id
        }
      })
      return this.$api.kcard.bulkCreate(params)
    },
    postImageCard(card) {
      return this.$api.kcard.create({
        name: card.name,
        image_path: card.image_path,
        category_id: card.category_id,
        summary: card.summary,
        extra: {
          custom: false
        },
        creator_id: this.userInfo.id
      })
    },
    submitCard() {
      const pass = this.checkImageCard()
      if (pass) {
        this.imageCardUploadLoading = true
        if (this.singleUpload) {
          this.postImageCard(this.uploadFiles[0])
            .then((res) => {
              this.$message.success('上传知识卡成功')
              this.getKcardList()
              this.imageCardUploadLoading = false
              this.uploadImageCardDialogVisible = false
            })
            .catch((err) => {
              this.$message.error('上传知识卡发生错误：' + JSON.stringify(err))
              this.imageCardUploadLoading = false
            })
        } else {
          this.postMultiImageCard()
            .then((res) => {
              this.$message.success('批量上传知识卡成功')
              this.getKcardList()
              this.imageCardUploadLoading = false
              this.uploadImageCardDialogVisible = false
            })
            .catch((err) => {
              this.$message.error('批量上传知识卡发生错误：' + JSON.stringify(err))
              this.imageCardUploadLoading = false
            })
        }
      }
    },
    tplCardUse(data) {
      this.usedKcardTpl = data
      if (data.src) {
        this.cardModel.src = data.src
      }
      if (data.layout) {
        this.cardModel.layout = data.layout
      }
    },
    layoutCardUse(data) {
      this.usedLayout = data
      if (data.src) {
        this.customCardModel.src = data.src
      }
      if (data.layout) {
        this.customCardModel.layout = data.layout
      }
    },
    bgCardUse(data) {
      this.usedBg = data
      if (data.src) {
        this.customCardModel.src = data.src
      }
    },
    uploadImageCard() {
      this.uploadImageCardDialogVisible = true
      this.uploadImageCardDialogTitle = '上传知识卡'
      this.singleUpload = true
      this.imageCardUploadLoading = false

      this.uploadFiles = [
        {
          name: '',
          image_path: '',
          imgSrc: '',
          category_id: '',
          summary: '',
          extra: {},
          creator_id: this.userInfo.id
        }
      ]

    },
    addUploadImageItem() {
      this.uploadFiles.push({
        name: '',
        image_path: '',
        imgSrc: '',
        category_id: '',
        summary: '',
        extra: {},
        creator_id: this.userInfo.id
      })
    },
    deleteUploadItem(index) {
      if (this.uploadFiles.length === 1) return
      this.uploadFiles.splice(index, 1)
    },
    toggleUploadMode() {
      this.singleUpload = !this.singleUpload
    },
    singleUploadMode() {
      this.singleUpload = true
      this.uploadFiles.splice(1, this.uploadFiles.length)
    },
    myBgUploadSuccess(image_path) {
      this.$api.kcardMyBg.create({ image_path })
        .then((res) => {
          this.myBgList = res.data.results
          this.$message.success('常用背景图上传成功')
          this.myBgUploadFiles.image_path = ''
          this.myBgUploadFiles.imgSrc = ''
          this.$refs.myBgUpload.handleRemove()
          this.getMyBgList()
        })
        .catch((err) => {
          // console.log(err)
          this.$message.error(JSON.stringify(err))
        })
    },
    creationClick() {
      this.getKcardTplList()
      this.creationDialogTitle = '创作知识卡'
      this.creationDialogVisible = true
    },
    editTplCard(row) {
      this.getKcardTplList()
      this.kcardInfo = row
      this.creationDialogTitle = '编辑知识卡'
      this.creationDialogVisible = true

      this.cardForm.category_id = row.category.id
      this.cardForm.title = row.name
      this.cardForm.desc = row.summary
      this.cardModel.src = row.extra.bg_image
      this.cardModel.layout = row.extra.layout
    },
    customCreationClick() {
      this.customCreationDialogVisible = true
      this.getMyBgList()
      this.getSysBgList()
    },
    editCustomCard(row) {
      this.getMyBgList()
      this.getSysBgList()
      this.kcardInfo = row
      this.customCreationDialogTitle = '编辑知识卡'
      this.customCreationDialogVisible = true

      this.customCardForm.category_id = row.category.id
      this.customCardForm.title = row.name
      this.customCardForm.desc = row.summary
      this.customCardModel.src = row.extra.bg_image
      this.customCardModel.layout = row.extra.layout
    },
    validKcardForm() {
      if (this.cardForm.category_id === '') {
        this.$message.error('请选择分类')
        return false
      }
      if (this.cardForm.title === '') {
        this.$message.error('请输入标题')
        return false
      }
      if (this.cardForm.desc === '') {
        this.$message.error('请输入描述')
        return false
      }
      if (this.cardModel.src === '' && this.cardModel.layout === '') {
        this.$message.error('请选择一个模板')
        return false
      }
      return true
    },
    validCustomKcardForm() {
      if (this.customCardForm.category_id === '') {
        this.$message.error('请选择分类')
        return false
      }
      if (this.customCardForm.title === '') {
        this.$message.error('请输入标题')
        return false
      }
      if (this.customCardForm.desc === '') {
        this.$message.error('请输入描述')
        return false
      }
      if (this.customCardModel.layout === '') {
        this.$message.error('请选择布局')
        return false
      }
      if (this.customCardModel.src === '') {
        this.$message.error('请选择背景图')
        return false
      }
      return true
    },
    kcardBuild(ref) {
      const kcard = this.$refs[ref]
      return new Promise((resolve, reject) => {
        this.builderDialog = true
        kcard.build()
          .then((blob) => {
            resolve(blob)
            // var img = new Image();
            // img.src = dataUrl;
            // document.body.appendChild(img);
            kcard.closePreview()
            this.builderDialog = false
          })
          .catch((error) => {
            this.$message.error('生成知识卡失败')
            kcard.closePreview()
            this.builderDialog = false
            reject(error)
          })
      })
    },
    uploadCOS(blob) {
      const fileList = [{
        name: this.$uuid + '.png',
        raw: blob
      }]
      return new Promise((resolve, reject) => {
        this.$cos.uploadFile(fileList, (progressData, uploadKey) => {
          if (progressData.percent === 1) {
            resolve(uploadKey.path_list[0])
          }
        })
          .then((res) => {
          })
          .catch((err) => {
            console.log(err)
            reject(err)
            // this.$message.error('上传知识卡发生错误失败')
          })
      })
    },
    submitTplKcard() {
      if (!this.validKcardForm()) {
        return
      }
      if (this.creationDialogTitle === '创作知识卡') {
        this.createByTpl()
      } else {
        this.updateByTpl()
      }
    },
    async createByTpl() {
      this.kcardSubmitLoading = true
      const image_path = await this.uploadCOS(await this.kcardBuild('tplCardBuilder'))

      const params = {
        name: this.cardForm.title,
        image_path: image_path,
        category_id: this.cardForm.category_id,
        summary: this.cardForm.desc,
        extra: {
          custom: true,
          use_tpl: true,
          layout: this.usedKcardTpl.layout,
          bg_image: this.usedKcardTpl.image,
          bg_image_path: this.usedKcardTpl.image_path,
        }
      }

      this.$api.kcard.create(params)
        .then((res) => {
          this.getKcardList()
          this.$message.success('创建成功')
          this.kcardSubmitLoading = false
          this.creationDialogVisible = false
        })
        .catch((err) => {
          this.kcardSubmitLoading = false
          this.$message.error('创建知识卡发生错误：' + JSON.stringify(err))
        })
    },
    async updateByTpl() {
      this.kcardSubmitLoading = true
      const image_path = await this.uploadCOS(await this.kcardBuild('tplCardBuilder'))

      const params = {
        name: this.cardForm.title,
        image_path: image_path,
        category_id: this.cardForm.category_id,
        summary: this.cardForm.desc,
        extra: {
          custom: true,
          use_tpl: true,
          layout: (this.usedKcardTpl && this.usedKcardTpl.layout) ? this.usedKcardTpl.layout : this.kcardInfo.extra.layout,
          bg_image: (this.usedKcardTpl && this.usedKcardTpl.image) ? this.usedKcardTpl.image : this.kcardInfo.extra.bg_image,
          bg_image_path: (this.usedKcardTpl && this.usedKcardTpl.image_path) ? this.usedKcardTpl.image_path : this.kcardInfo.extra.bg_image_path,
        }
      }

      this.$api.kcard.update(this.kcardInfo.id, params)
        .then((res) => {
          this.getKcardList()
          this.$message.success('编辑成功')
          this.kcardSubmitLoading = false
          this.creationDialogVisible = false
        })
        .catch((err) => {
          this.kcardSubmitLoading = false
          this.$message.error('编辑知识卡发生错误：' + JSON.stringify(err))
        })
    },
    submitCustomCard() {
      if (!this.validCustomKcardForm()) {
        return
      }
      if (this.customCreationDialogTitle === '自定义创作') {
        this.createByCustom()
      } else {
        this.updateByCustom()
      }
    },
    async createByCustom() {
      this.kcardSubmitLoading = true
      const image_path = await this.uploadCOS(await this.kcardBuild('customCardBuilder'))

      const params = {
        name: this.customCardForm.title,
        image_path: image_path,
        category_id: this.customCardForm.category_id,
        summary: this.customCardForm.desc,
        extra: {
          custom: true,
          use_tpl: false,
          layout: this.usedLayout.layout,
          bg_image: this.usedBg.image,
          bg_image_path: this.usedBg.image_path,
        }
      }
      this.$api.kcard.create(params)
        .then((res) => {
          this.getKcardList()
          this.$message.success('创建成功')
          this.kcardSubmitLoading = false
          this.customCreationDialogVisible = false
        })
        .catch((err) => {
          this.kcardSubmitLoading = false
          this.$message.error('创建知识卡发生错误：' + JSON.stringify(err))
        })
    },
    async updateByCustom() {
      this.kcardSubmitLoading = true
      const image_path = await this.uploadCOS(await this.kcardBuild('customCardBuilder'))

      const params = {
        name: this.customCardForm.title,
        image_path: image_path,
        category_id: this.customCardForm.category_id,
        summary: this.customCardForm.desc,
        extra: {
          custom: true,
          use_tpl: false,
          layout: (this.usedLayout && this.usedLayout.layout) ? this.usedLayout.layout : this.kcardInfo.extra.layout,
          bg_image: (this.usedBg && this.usedBg.image) ? this.usedBg.image : this.kcardInfo.extra.bg_image,
          bg_image_path: (this.usedBg && this.usedBg.image_path) ? this.usedBg.image_path : this.kcardInfo.extra.bg_image_path,
        }
      }
      this.$api.kcard.update(this.kcardInfo.id, params)
        .then((res) => {
          this.getKcardList()
          this.$message.success('编辑成功')
          this.kcardSubmitLoading = false
          this.customCreationDialogVisible = false
        })
        .catch((err) => {
          this.kcardSubmitLoading = false
          this.$message.error('编辑知识卡发生错误：' + JSON.stringify(err))
        })
    },
    editImageKcardClick(row) {
      this.editImageKcardForm = row
      this.editImageKcardViewImage = row.image
      this.editImageKcardForm.category_id = row.category.id
      this.editImageKcardDialogVisible = true
    },
    editImageKcard() {
      if (this.editImageKcardForm.name === '') {
        return this.$message.error('请输入标题')
      }
      if (this.editImageKcardForm.name === '') {
        return this.$message.error('请输入标题')
      }
      if (this.editImageKcardForm.image_path === '') {
        return this.$message.error('请上传图片')
      }
      this.$api.kcard.update(this.editImageKcardForm.id, {
        name: this.editImageKcardForm.name,
        image_path: this.editImageKcardForm.image_path,
        category_id: this.editImageKcardForm.category_id,
        summary: this.editImageKcardForm.summary,
        extra: {
          custom: false
        },
        creator_id: this.userInfo.id
      })
        .then((res) => {
          this.$message.success('保存成功')
          this.getKcardList()
          this.editImageKcardDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
    },
    getCategories() {
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
  }, // methods end
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  }
}
</script>

<style scoped lang="less">
.panel {
}

.m-table {
  height: calc(100% - 110px);
}

.search-bar {

  .el-form-item {
    margin: 0;

    .el-select {
      width: 100%;
    }

    :deep(.el-input__inner) {
      width: 100%;
      cursor: default !important;
      font-size: 14px;
      height: 40px !important;
    }
  }
}

.creation-dialog {
  :deep(.el-dialog) {
    width: 1020px;
    height: 840px;
    margin-top: 60px !important;
  }
}

.creation-box {
  width: 100%;

  .card-editor {
    height: 300px;
    margin-bottom: 20px;

    .left {
      width: 220px;
      height: 100%;

      .card-box {
        width: 180px;
        height: 240px;
        margin: 0 auto;
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

.sec-title {
  position: relative;
  font-size: 14px;
  font-weight: 600;
  color: #5A6D86 !important;
}

.custom-creation-dialog {
  :deep(.el-dialog) {
    width: 1020px;
    height: 870px;
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
}

.upload-kcard-dialog {
  :deep(.el-dialog) {
    width: 1020px;
    height: 720px;
    //margin-top: 5vh !important;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
    }
  }

  .img-card-row {
    width: 100%;
    height: 240px;
    border: 1px solid #D9E1EC;
    border-radius: 12px;
    margin-bottom: 20px;

    .img-card-upload {
      height: 100%;
      border-right: 1px solid #D9E1EC;

      .upload-box {
        width: 220px;
        height: 150px;
        overflow: hidden;

        :deep(.el-upload-list__item) {
          transition: none !important;
        }

        :deep(.el-upload--picture-card) {
          width: 100%;
          height: 100%;
        }
      }
    }

    .img-card-info {
      height: 100%;

      .el-descriptions {
        height: 100%;
        border-radius: 12px;
        border-top-left-radius: 0;

        :deep(.el-descriptions__body) {
          height: 100%;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border: 0;

          .el-descriptions__table {
            height: 100%;

            tbody:nth-child(1) {
              height: 46px;
            }

            tbody:nth-child(2) {
              height: calc(100% / 3);
            }

            tbody:nth-child(3) {
              height: calc(100% / 3);
            }
          }
        }

        :deep(.el-descriptions-item__cell.el-descriptions-item__label.is-bordered-label) {
          //background-color: #f4f5fa !important;
          background-color: #fff;
          width: 24%;
        }

        :deep(.el-descriptions-item__cell.el-descriptions-item__content) {
          //background-color: #f4f5fa !important;
          padding: 0;

          .el-input__inner {
            border: none !important;
            border-radius: 12px;
            //background-color: #f4f5fa !important;
            background-color: #fff;
          }

          .el-textarea {
            height: 100%;
            padding: 5px 10px 5px 15px;
            box-sizing: border-box;

            .el-textarea__inner {
              height: 100%;
              border: none;
              padding: 0;
              resize: none;
              border-bottom-right-radius: 16px;
            }
          }
        }
      }
    }

    .delete-icon-btn {
      border-left: 1px solid #E9EDF0;
      cursor: pointer;
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

.dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: red;
  position: relative;
  top: -3px;
}

.custom-creation-dialog {
  :deep(.card-carousel-wrapper) {
    justify-content: flex-start;

    .card-carousel {
      justify-content: flex-start;
    }
  }
}

.builder-tips {
  :deep(.el-dialog) {
    height: 300px;
  }
}

.edit-image-kcard-dialog {
  :deep(.el-dialog) {
    width: 800px;
    height: 520px;
  }
}

.textarea-box {
  .el-textarea {
    :deep(.el-input__count) {
      right: 24px;
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>
