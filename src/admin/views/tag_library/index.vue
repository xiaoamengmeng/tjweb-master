<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        标签管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">

        <div>
          <el-radio-group @change="viewsModeChange" class="radio-group" v-model="viewsMode">
            <el-radio-button label="手工标签"></el-radio-button>
            <el-radio-button label="自动标签"></el-radio-button>
          </el-radio-group>
        </div>

        <template v-if="viewsMode === '手工标签'">
          <div class="template-content">
            <div class="category">
              <m-category
                :addAuth="'tagLibrary.createCategory'"
                :deleteAuth="'tagLibrary.deleteCategory'"
                :data="category"
                :select.sync="cageSelect"
                @add="addCateClick"
                @minus="minusCateClick"
                @click="cateClick"
              ></m-category>
            </div>
            <div class="content">
              <el-form
                class="form-box"
                :model="searchFrom"
                ref="form"
                label-position="top"
              >
                <div class="search-bar">
                  <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                          :gutter="20" style="width: 100%; height: 100%">
                    <el-col class="search-bar-col" :span="7">
                      <el-row class="label-t">标签名称</el-row>
                      <el-row>
                        <el-form-item prop="stage">
                          <el-input
                            v-model="searchFrom.name"
                            placeholder="输入标签名称搜索"
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
                            v-model="searchFrom.category_id"
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
                        <m-button icon="el-icon-search" h="40px" w="100px" @click.native="page=1;getTagList()">搜索</m-button>
                        <m-button v-auth="'tagLibrary.create'" h="40px" w="100px" @click="addClick">添加</m-button>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
              <m-table
                ref="table"
                class="m-table"
                :data="tableData"
                :total="total"
                :page-sizes="[10, 15, 20]"
                :page-size.sync="pageSize"
                :current-page.sync="page"
                :height="'calc(100% - 8px - 15px - 15px)'"
                :get-data-func="getTagList"
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="id"
                  label="标签ID"
                  width="80"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="name"
                  label="标签名称"
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
                  prop="created_at"
                  label="创建时间"
                  min-width="100"
                >
                  <template v-slot="scope">
                    {{ scope.row.created_at | dateFormat }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="creator.name"
                  label="创建人"
                  min-width="80"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="creator.department.org_name"
                  label="所属机构"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="creator.department.name"
                  label="所属部门"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                  <template v-slot="scope">
                    <div class="flex justify_center">
                      <icon-box v-auth="'tagLibrary.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                                title="编辑" @click.native="editClick(scope.row)"></icon-box>
                      <icon-box v-auth="'tagLibrary.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                                @click.native="deleteClick(scope.row)"></icon-box>
                    </div>
                  </template>
                </el-table-column>
              </m-table>
            </div>
          </div>
        </template>
        <template v-if="viewsMode === '自动标签'">
          <div class="template-content">
            <div class="content">
              <el-form
                class="form-box"
                :model="autoForm"
                ref="autoForm"
                label-position="top"
              >
                <div class="search-bar">
                  <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                          :gutter="20" style="width: 100%; height: 100%">
                    <el-col class="search-bar-col" :span="7">
                      <el-row class="label-t">标签名称</el-row>
                      <el-row>
                        <el-form-item prop="stage">
                          <el-input
                            v-model="autoForm.name"
                            placeholder="输入标签名称搜索"
                            clearable
                          ></el-input>
                        </el-form-item>
                      </el-row>
                    </el-col>
                    <el-col class="search-bar-col" :span="10">
                      <el-row class="label-t">&nbsp;</el-row>
                      <el-row>
                        <m-button icon="el-icon-search" h="40px" w="100px" @click.native="page=1;getAutoTagList()">搜索</m-button>
                      </el-row>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
              <m-table
                ref="autoTable"
                class="m-table"
                :data="autoTableData"
                :total="autoTotal"
                :page-sizes="[10, 15, 20]"
                :page-size.sync="autoPageSize"
                :current-page.sync="autoPage"
                :height="'calc(100% - 8px - 15px - 15px)'"
                :get-data-func="getAutoTagList"
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="id"
                  label="标签ID"
                  min-width="60"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="name"
                  label="标签名称"
                  min-width="120"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="created_at"
                  label="创建时间"
                  min-width="120"
                  align="center"
                >
                  <template v-slot="scope">
                    {{ scope.row.created_at | dateFormat }}
                  </template>
                </el-table-column>
              </m-table>
            </div>
          </div>
        </template>
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
        label-width="60"
        label-position="left"
      >
        <el-form-item label="名称" class="mt_20" prop="name">
          <el-input v-model="tagForm.name" placeholder="请输入标签名称" class="" style="width: 380px;"></el-input>
        </el-form-item>
        <el-form-item label="分类" required prop="category_id">
          <el-select
            v-model="tagForm.category_id"
            placeholder="全部"
            clearable
            style="width: 380px;"
          >
            <el-option
              v-for="cate in category"
              :key="cate.id"
              :label="cate.name"
              :value="cate.id"
            ></el-option>
          </el-select>
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
  name: 'TagLibrary',
  data() {
    return {
      viewsMode: '',

      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      form: {
        id: '',
        name: '',
        category: {
          id: 'created_at',
          updated_at: '',
          name: ''
        },
        created_at: '',
        updated_at: ''
      },
      cateForm: {
        name: '',
      },
      cateFormRule: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      tagForm: {
        name: '',
        category_id: '',
      },
      searchFrom: {
        name: '',
        category_id: '',
      },
      tagFormRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
        ],
        category_id: [
          { required: true, message: '请选择标签分类', trigger: 'blur' },
        ],
      },
      dialogVisible: false,
      dialogTitle: '添加标签',
      category: [],
      cageSelect: {},
      cateDialogVisible: false,


      autoTableData: [],
      autoTotal: 0,
      autoPageSize: 10,
      autoPage: 1,
      autoForm: {
        name: '',
      },
    }
  },
  mounted() {
    this.getTagList()
    this.getCategoryList()
  },
  created() {
    let index = 0
    if (this.$route.query.views) {
      index = parseInt(this.$route.query.views)
    }
    if (index === 0) {
      this.viewsModeChange('手工标签')
    } else {
      this.viewsModeChange('自动标签')
    }
  },
  methods: {

    viewsModeChange(val) {
      this.viewsMode = val
      if (val === '手工标签') {
        this.$router.push(`${this.$route.path}?views=0`)
        this.getTagList()
      } else {
        this.$router.push(`${this.$route.path}?views=1`)
        this.getAutoTagList()
      }
    },

    getCategoryList() {
      this.$api.tagCategories.getList({}).then((res) => {
        this.category = res.data.results
      })
        .catch((err) => {
       this.$message.error(JSON.stringify(err))
        })
    },
    getAutoTagList() {
      this.$refs.autoTable && this.$refs.autoTable.loadStart()
      this.$api.tag.getList({
        page: this.autoPage,
        page_size: this.autoPageSize,
        search: this.autoForm.name,
        attribute: "Auto"
      }).then((res) => {
        this.autoTotal = res.data.count
        this.autoTableData = res.data.results
      }).catch((err) => {
        this.$message.error(JSON.stringify(err))
      })
    },
    getTagList() {
      this.$refs.table && this.$refs.table.loadStart()
      this.$api.tag.getList({
        page: this.page,
        page_size: this.pageSize,
        search: this.searchFrom.name,
        category_id: this.searchFrom.category_id,
        attribute: "Public"
      }).then((res) => {
        this.total = res.data.count
        this.tableData = res.data.results
      }).catch((err) => {
        this.$message.error(JSON.stringify(err))
      })
    },
    addClick() {
      this.dialogTitle = '添加标签'
      this.dialogVisible = true
      this.tagForm.name = ''
      this.tagForm.category_id = ''
      this.$nextTick(() => {
        this.$refs.tagForm.clearValidate()
      })
    },
    editClick(row) {
      this.dialogTitle = '编辑标签'
      this.tagForm.category_id = row.category.id
      this.form = row
      this.tagForm.name = row.name
      this.dialogVisible = true
    },
    deleteClick(row) {
      this.$confirm(`确定删除标签【${row.name}】吗？`, '删除标签', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          this.$api.tag.delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getTagList()
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
        this.$api.tagCategories.delete(this.cageSelect.id)
          .then((res) => {
            this.$message.success('删除成功')
            this.searchFrom.category_id = ''
            this.page = 1 
            this.getTagList()
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
      this.searchFrom.category_id = cate.id
      this.getTagList()
    },
    addTag() {
      this.$refs.tagForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '添加标签') {
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
      this.$api.tag.create({
        ...this.tagForm,
        attribute: 'Public'
      }).then(res => {
        this.dialogVisible = false
        this.getTagList()
        this.$message.success('新增成功')
      })
    },

    update() {
      this.$api.tag.update(this.form.id, {
        ...this.tagForm,
        attribute: 'Public'
      }).then(res => {
        this.dialogVisible = false
        this.getTagList()
        this.$message.success('修改成功')
      }).catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(err.list.map(item => item.detail).join(''))
          } else {
            this.$message.error(err.detail)
          }
        })
    },

    addCate() {
      this.$refs.cateForm.validate((valid) => {
        if (valid) {
          this.$api.tagCategories.create({
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
  },
}
</script>

<style scoped lang="less">
.panel {
  //.card {
  //  margin-top: 32px;
  //  height: calc(100% - 32px - 32px);
  //}
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

.template-content {
  display: flex; 
  flex-direction: row; 
  height: calc(100vh - 282px); 
  margin-top: 20px;
}

</style>
