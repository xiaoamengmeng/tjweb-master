<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        常见问题
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container flex">
        <div class="category">
          <m-category
            :addAuth="'commonProblem.createCategory'"
            :deleteAuth="'commonProblem.deleteCategory'"
            :data="categories"
            :select.sync="cageSelect"
            @add="addCateClick"
            @minus="minusCateClick"
            @click="cateClick"
          ></m-category>
        </div>
        <div class="content">
            <div style="height: calc(100vh - 165px)">
              <el-form
                class="form-box"
                :model="searchForm"
                ref="form"
                label-position="top"
              >
                <div class="search-bar">
                  <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                          :gutter="20" style="width: 100%; height: 100%">
                    <el-col class="search-bar-col" :span="7">
                      <el-row class="label-t">关键词</el-row>
                      <el-row>
                        <el-form-item prop="stage">
                          <el-input
                            v-model="searchForm.search"
                            placeholder="输入关键词搜索"
                            clearable
                          ></el-input>
                        </el-form-item>
                      </el-row>
                    </el-col>
                    <el-col class="search-bar-col" :span="7">
                      <el-row class="label-t">分类</el-row>
                      <el-row>
                        <el-form-item>
                          <el-select
                            v-model="searchForm.category"
                            placeholder="全部"
                            clearable
                          >
                            <el-option
                              v-for="cate in categories"
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
                        <m-button icon="el-icon-search" h="40px" w="100px" @click.native="page=1;getList()">搜索</m-button>
                        <m-button v-auth="'commonProblem.create'" h="40px" w="100px" @click="addClick">添加</m-button>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
              <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane v-for="(item, index) in categories" :key="index" :label="item.name" :name="item.id + ''"></el-tab-pane>
              </el-tabs> -->
              <m-table
                class="m-table"
                ref="table"
                :data="tableData"
                :total="total"
                :page-sizes="[10, 15, 20]"
                :page-size.sync="pageSize"
                :current-page.sync="page"
                :height="'100%'"
                :get-data-func="getList"
              >
                <!-- <el-table-column
                  v-if="category == '支架' || category == '生活方式'"
                  prop="question"
                  label="类别"
                  min-width="30"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.type }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column
                  prop="category"
                  label="分类"
                  min-width="40"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ getCategoryName(scope.row) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="question"
                  label="问题/相关点"
                  min-width="80"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.question }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="keyword"
                  label="关键词"
                  min-width="80"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.keyword.join('，') }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="answer"
                  label="回答"
                  min-width="120"
                  align="center"
                >
                   <template slot-scope="scope">
                    <span>{{ scope.row.answer }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template v-slot="scope">
                    <div class="flex justify_center">
                      <icon-box v-auth="'commonProblem.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                                title="编辑" @click.native="editClick(scope.row)"></icon-box>
                      <icon-box v-auth="'commonProblem.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                                @click.native="deleteClick(scope.row)"></icon-box>
                    </div>
                  </template>
                </el-table-column>
              </m-table>
            </div>
        </div>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :modal="true"
      class="calc-dialog"
    >
      <el-form
        class="form-box"
        :model="tagForm"
        :rules="tagFormRules"
        ref="tagForm"
        label-width="80"
        label-position="left"
      >
        <el-form-item label="分类" required prop="category">
          <el-select
            v-model="tagForm.category"
            placeholder="请选择分类"
            clearable
            style="width: 340px;"
          >
            <el-option
              v-for="cate in categories"
              :key="cate.id"
              :label="cate.name"
              :value="cate.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题" class="mt_20" prop="question">
          <el-input :rows="3" class="resizeNone" type="textarea" v-model="tagForm.question" placeholder="请输入问题" resize="none" style="width: 340px;"></el-input>
        </el-form-item>
        <el-form-item label="关键词" class="mt_20" prop="keyword">
          <el-input :rows="3" class="resizeNone"  type="textarea" v-model="tagForm.keyword" placeholder="请输入关键词，多个关键词以逗号隔开" resize="none" style="width: 340px;"></el-input>
        </el-form-item>
        <el-form-item label="答案" class="mt_20" prop="answer">
          <el-input :rows="3" class="resizeNone"  type="textarea" v-model="tagForm.answer" placeholder="请输入答案" resize="none" style="width: 340px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="addTag" w="80px">保 存</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      :modal="true"
    >
      <el-form
        class="form-box"
        :model="cateForm"
        :rules="cateFormRule"
        ref="cateForm"
        label-width="60"
        label-position="left"
      >
        <el-form-item label="名称" class="mt_20" prop="name">
          <el-input v-model="cateForm.name" placeholder="请输入分类名称" class="" style="width: 380px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="cateDialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="addCate" w="80px">保 存</m-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: 'CommonProblem',
  data() {
    return {
      viewsMode: '',
      searchForm: {
        search: '',
        category: null
      },
      rules: {},
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      categories: [],
      cageSelect: {},

      cateForm: {
        name: '',
      },
      cateFormRule: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      cateDialogVisible: false,

      tagForm: {
        question: '',
        answer: '',
        category: '',
        keyword: '',
      },
      tagFormRules: {
        category: [
          { required: true, message: '请选择分类', trigger: 'blur' },
        ],
        answer: [
          { required: true, message: '请输入答案', trigger: 'blur' },
        ],
        keyword: [
          { required: true, message: '请输入关键词', trigger: 'blur' },
        ],
        question: [
          { required: true, message: '请输入问题', trigger: 'blur' },
        ],
      },
      dialogVisible: false,
      dialogTitle: '添加常见问题',

      form: {},

    }
  },
  mounted() {
    this.getCategoryList()
    this.getList()
  },
  methods: {
    getCategoryName(row) {
      let category = this.categories.find(ele => ele.id == row.category)
      if (category) return category.name
      return ''
    },
    getCategoryList() {
      this.$api.faqCategory.getList({}).then((res) => {
        this.categories = res.data.results
      }).catch((err) => {
       this.$message.error(JSON.stringify(err))
      })
    },
    handleClick(tab, event) {
      
      // const active = this.categories.find(ele => ele.id == this.activeName)
      // if (this.category != active.label) {
      //   this.page = 1
      // }
      // this.category = active.label
      this.getList()
    },
    getList() {
      this.$nextTick(() => {
        const { table } = this.$refs
        if (table) table.loadStart()
      })
      this.$api.faq.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id',
        category: this.searchForm.category,
        search_all: this.searchForm.search
      })
        .then((res) => {
          this.total = res.data.count
          this.tableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    addClick() {
      this.dialogTitle = '添加常见问题'
      this.dialogVisible = true
      this.tagForm.question = ''
      this.tagForm.answer = ''
      this.tagForm.keyword = ''
      this.tagForm.category = ''
      this.$nextTick(() => {
        this.$refs.tagForm.clearValidate()
      })
    },
    editClick(row) {
      this.dialogTitle = '编辑常见问题'
      this.form = row
      this.tagForm.question = row.question
      this.tagForm.answer = row.answer
      this.tagForm.keyword = row.keyword.join("，")
      this.tagForm.category = row.category
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tagForm.clearValidate()
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除常见问题吗？`, '删除常见问题', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.faq.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getList()
            })
            .catch((err) => {
           this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {
        })
    },

    addCateClick() {
      this.cateDialogVisible = true
      this.$nextTick(() => {
        this.$refs.cateForm.clearValidate()
      })
    },
    minusCateClick() {
      if (Object.keys(this.cageSelect).length === 0) {
        return this.$message.error('请选择一个分类')
      }
      this.$confirm(`确定删除分类【${this.cageSelect.name}】吗？`, '删除分类', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$api.faqCategory.delete(this.cageSelect.id)
          .then((res) => {
            this.$message.success('删除成功')
            this.searchForm.category = ''
            this.page = 1
            this.getList()
            this.getCategoryList()
          })
          .catch((err) => {
         this.$message.error(JSON.stringify(err))
          })
      }).catch(() => {
      })
    },
    cateClick(cate) {
      this.page = 1
      this.searchForm.category = cate.id
      this.getList()
    },
    addCate() {
      this.$refs.cateForm.validate((valid) => {
        if (valid) {
          this.$api.faqCategory.create({
            ...this.cateForm,
          }).then(res => {
            this.$message.success('新增成功')
            this.getCategoryList()
            this.cateDialogVisible = false
          })
        } else {
          return false
        }
      })
    },
    addTag() {
      this.$refs.tagForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添加常见问题') {
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
      let params = {
        ...this.tagForm,
        keyword_id: this.tagForm.keyword.split('，')
      }
      this.$api.faq.create(params).then(res => {
        this.dialogVisible = false
        this.getList()
        this.$message.success('新增成功')
      })
    },

    update() {
      let params = {
        ...this.tagForm,
        keyword_id: this.tagForm.keyword.split('，')
      }
      this.$api.faq.update(this.form.id, params).then(res => {
        this.dialogVisible = false
        this.getList()
        this.$message.success('修改成功')
      }).catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(err.list.map(item => item.detail).join(''))
          } else {
            this.$message.error(err.detail)
          }
        })
    },


  }, // methods end
  computed: {},
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
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
  height: calc(100% - 203px);

  :deep(.el-table__body-wrapper) {
    overflow-x: hidden;
  }

  .el-link {
    color: #00B386;
    text-decoration: none;
  }
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

  .container {
    .category {
      margin-right: 10px;
      max-height: 500px;
      //height: 100%;
    }

    .content {
      flex: 1;
      width: calc(100% - 200px - 10px);
    }
  }

  .calc-dialog {
    :deep(.el-dialog) {
      height: 500px;
    }
    :deep(.el-form-item__label) {
      width: 70px;
    }
  }

  .resizeNone {
     :deep(.el-textarea__inner) { //el_input中的隐藏属性
        //  resize: none;  //主要是这个样式
        border-radius: 12px;
     }
  }

</style>
