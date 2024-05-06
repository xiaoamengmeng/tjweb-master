<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>内容管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item> 患者常见问题 </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container flex">
        <div class="category">
          <m-category :addAuth="'commonProblem.111'" :deleteAuth="'commonProblem.222'" :data="categories" :select.sync="cageSelect" @add="addCateClick" @minus="minusCateClick" @click="cateClick"></m-category>
        </div>
        <div class="content">
          <div style="height: calc(100vh - 165px)">
            <el-form class="form-box" :model="searchForm" ref="form" label-position="top">
              <div class="search-bar">
                <el-row class="search-bar-row" type="flex" justify="start" align="middle" :gutter="20" style="width: 100%; height: 100%">
                  <el-col class="search-bar-col" :span="7">
                    <el-row class="label-t">关键词</el-row>
                    <el-row>
                      <el-form-item prop="stage">
                        <el-input v-model="searchForm.search" placeholder="输入关键词搜索" clearable></el-input>
                      </el-form-item>
                    </el-row>
                  </el-col>
                  <el-col class="search-bar-col" :span="7">
                    <el-row class="label-t">分类</el-row>
                    <el-row>
                      <el-form-item>
                        <el-select v-model="searchForm.category" placeholder="全部" clearable>
                          <el-option v-for="cate in categories" :key="cate.id" :label="cate.name" :value="cate.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-row>
                  </el-col>
                  <el-col class="search-bar-col" :span="10">
                    <el-row class="label-t">&nbsp;</el-row>
                    <el-row>
                      <m-button
                        icon="el-icon-search"
                        h="40px"
                        w="100px"
                        @click.native="
                          page = 1
                          getList()
                        "
                        >搜索</m-button
                      >
                      <m-button v-auth="'patientFaq.create'" h="40px" w="100px" @click="addClick">添加</m-button>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane v-for="(item, index) in categories" :key="index" :label="item.name" :name="item.id + ''"></el-tab-pane>
              </el-tabs> -->
            <m-table class="m-table" ref="table" :data="tableData" :total="total" :page-sizes="[10, 15, 20]" :page-size.sync="pageSize" :current-page.sync="page" :height="'100%'" :get-data-func="getList">
              <el-table-column prop="category" label="分类" width="60" align="center">
                <template slot-scope="scope">
                  <span>{{ getCategoryName(scope.row) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="question" label="问题" min-width="150" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.question }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="answer" label="回答" min-width="300" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.answer }}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="permission" label="发布范围" width="80">
                <template v-slot="scope">
                  <span v-if="scope.row.permission == 'All'">公共</span>
                  <span v-else>
                    {{ dptStr(scope.row.dpt_scope) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="tags" label="患者标签" width="80">
                <template v-slot="scope">
                  <span v-if="scope.row.tags.length == 0">所有</span>
                  <span v-else>
                    {{ tagStr(scope.row.tags) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="120px">
                <template v-slot="scope">
                  <div class="flex justify_center">
                    <icon-box v-auth="'patientFaq.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="editClick(scope.row)"></icon-box>
                    <icon-box v-auth="'patientFaq.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deleteClick(scope.row)"></icon-box>
                  </div>
                </template>
              </el-table-column>
            </m-table>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :modal="true" class="calc-dialog">
      <el-form class="form-box" :model="tagForm" :rules="tagFormRules" ref="tagForm" label-width="80" label-position="left">
        <el-form-item label="分类" required prop="category">
          <el-select v-model="tagForm.category" placeholder="请选择分类" clearable style="width: 440px">
            <el-option v-for="cate in categories" :key="cate.id" :label="cate.name" :value="cate.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题" class="mt_20" prop="question">
          <el-input :rows="3" class="resizeNone" type="textarea" v-model="tagForm.question" placeholder="请输入问题" resize="none" style="width: 440px"></el-input>
        </el-form-item>
        <el-form-item label="发布范围" class="mt_20" style="margin-bottom: 0" prop="permission">
          <el-radio-group v-model="tagForm.permission">
            <el-radio :label="'All'">公共</el-radio>
            <el-radio :label="'PART'">部分机构部门</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="tagForm.permission == 'PART'" label=" ">
          <el-cascader style="width: 440px" filterable v-model="tagForm.dpt_scope_id" :options="dptCategory" :props="tagCategoryProps" ref="tagCascader" :disabled="canSelected"> </el-cascader>
        </el-form-item>
        <el-form-item label="患者标签" class="mt_20" style="margin-bottom: 0" prop="patient_tag">
          <el-radio-group v-model="tagForm.patient_tag">
            <el-radio :label="'All'">所有</el-radio>
            <el-radio :label="'Part'">部分标签用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="tagForm.patient_tag == 'Part'" label=" ">
          <el-cascader style="width: 440px" filterable :show-all-levels="false" v-model="tagForm.tags_id" :options="tagCategory" :props="tagCategoryProps" ref="tagCascader"> </el-cascader>
        </el-form-item>
        <el-form-item label="答案" class="mt_20" prop="answer">
          <el-input :rows="5" class="resizeNone" type="textarea" v-model="tagForm.answer" placeholder="请输入答案" resize="none" style="width: 440px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="addTag" w="80px">保 存</m-button>
      </span>
    </el-dialog>

    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" :modal="true">
      <el-form class="form-box" :model="cateForm" :rules="cateFormRule" ref="cateForm" label-width="60" label-position="left">
        <el-form-item label="名称" class="mt_20" prop="name">
          <el-input v-model="cateForm.name" placeholder="请输入分类名称" class="" style="width: 380px"></el-input>
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
import { mapGetters } from 'vuex'
export default {
  name: 'CommonProblem',
  data() {
    return {
      viewsMode: '',
      searchForm: {
        search: '',
        category: null,
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
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      cateDialogVisible: false,

      tagForm: {
        question: '',
        answer: '',
        category: '',
        keyword: '',
        permission: '',
        patient_tag: '',
        tags_id: [],
        dpt_scope_id: [],
      },
      tagFormRules: {
        category: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
        permission: [{ required: true, message: '请选择发布范围', trigger: 'change' }],
        patient_tag: [{ required: true, message: '请选择患者标签', trigger: 'change' }],
        question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
      },
      dialogVisible: false,
      dialogTitle: '添加常见问题',

      form: {},
      tagCategory: [],
      tagCategoryProps: {
        multiple: true,
      },
      dptCategory: [],
    }
  },
  watch: {
    'tagForm.patient_tag'(visible) {
      if (visible == 'All') {
        this.form.tags_id = []
      }
    },
    'tagForm.permission'(visible) {
      if (visible == 'All') {
        this.form.dpt_scope_id = []
      } else {
        this.setDptId()
      }
    },
  },
  mounted() {
    this.getCategoryList()
    this.getList()
  },
  methods: {
    tagStr(tagIds) {
      return tagIds.map((ele) => ele.name).join('，')
    },
    dptStr(dpt_scope) {
      return dpt_scope.map((ele) => ele.organization.name + '-' + ele.name).join('，')
    },
    setDptId() {
      if (this.userInfo.department.org_id == 1 && this.userInfo.selectedOrganization.id == 1) {
        if (this.form.dpt_scope) {
          this.tagForm.dpt_scope_id = this.form.dpt_scope.map((ele) => {
            return [ele.organization.id, ele.id]
          })
        } else {
          this.tagForm.dpt_scope_id = []
        }
      } else if (this.userInfo.department.org_id == 1 && this.userInfo.selectedOrganization.id != 1) {
        this.tagForm.dpt_scope_id = [[this.userInfo.selectedOrganization.id, this.userInfo.selectedDepartment.id]]
      } else {
        this.tagForm.dpt_scope_id = [[this.userInfo.department.org_id, this.userInfo.department.id]]
      }
    },
    getTagCategoryList() {
      this.$api.tagCategories
        .getList({
          page: 1,
          page_size: 99999,
        })
        .then((res) => {
          this.tagCategory = res.data.results.map((ele, index) => {
            return {
              ...ele,
              value: ele.id,
              label: ele.name,
              children: [],
            }
          })
          this.tagCategory.unshift({
            id: -1,
            value: -1,
            label: '自动标签',
            children: [],
          })
          this.$api.tag
            .getList({
              ordering: 'id',
              page: 1,
              page_size: 99999,
              attribute__in: 'Private, Public, Auto',
            })
            .then((res) => {
              res.data.results.forEach((ele) => {
                if (ele.attribute == 'Auto') {
                  const idx = this.tagCategory.find((ite) => ite.id == -1)
                  if (idx) {
                    idx.children.push({
                      ...ele,
                      value: ele.id,
                      label: ele.name,
                      leaf: 'leaf',
                    })
                  }
                } else {
                  const idx = this.tagCategory.find((ite) => ite.id == ele.category.id)
                  if (idx) {
                    idx.children.push({
                      ...ele,
                      value: ele.id,
                      label: ele.name,
                      leaf: 'leaf',
                    })
                  }
                }
              })
              this.getOrganizations()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    getOrganizations() {
      this.$api.organizationManage
        .getList({
          page: 1,
          page_size: 99999,
        })
        .then((res) => {
          this.dptCategory = res.data.results.map((ele, index) => {
            return {
              ...ele,
              value: ele.id,
              label: ele.name,
              children: [],
            }
          })
          this.$api.departmentManage
            .getList({
              page: 1,
              page_size: 99999,
            })
            .then((res) => {
              res.data.results.forEach((ele) => {
                const idx = this.dptCategory.find((ite) => ite.id == ele.organization.id)
                if (idx) {
                  idx.children.push({
                    ...ele,
                    value: ele.id,
                    label: ele.name,
                    leaf: 'leaf',
                  })
                }
              })
              //   this.initForm()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getCategoryName(row) {
      let category = this.categories.find((ele) => ele.id == row.category)
      if (category) return category.name
      return ''
    },
    getCategoryList() {
      this.$api.patientFaqCategory
        .getList({
          page: 1,
          page_size: 9999,
        })
        .then((res) => {
          this.categories = res.data.results
        })
        .catch((err) => {
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
      this.$api.patientFaq
        .getList({
          page: this.page,
          page_size: this.pageSize,
          ordering: '-id',
          category: this.searchForm.category,
          search_all: this.searchForm.search,
          department: this.userInfo.selectedDepartment.id,
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
      this.getTagCategoryList()
      this.dialogTitle = '添加常见问题'
      this.dialogVisible = true
      this.tagForm.question = ''
      this.tagForm.answer = ''
      this.tagForm.category = ''
      this.tagForm.permission = ''
      this.tagForm.patient_tag = ''
      this.tagForm.tags_id = []
      this.tagForm.dpt_scope_id = []
      this.$nextTick(() => {
        this.$refs.tagForm.clearValidate()
      })
    },
    editClick(row) {
      this.dialogTitle = '编辑常见问题'
      this.form = row
      this.tagForm.question = row.question
      this.tagForm.answer = row.answer
      this.tagForm.category = row.category
      this.tagForm.question = row.question

      if (row.tags.length == 0) {
        this.tagForm.patient_tag = 'All'
        this.tagForm.tags_id = []
      } else {
        this.tagForm.patient_tag = 'Part'
        row.tags.forEach((el) => {
          if (el.attribute == 'Auto') {
            this.tagForm.tags_id.push([-1, el.id])
          } else {
            for (let i = 0; i < this.tagCategory.length; i++) {
              const element = this.tagCategory[i]
              for (let j = 0; j < element.children.length; j++) {
                const elemen = element.children[j]
                if (el.id == elemen.id) {
                  this.tagForm.tags_id.push([element.id, el.id])
                }
              }
            }
          }
        })
      }

      this.setDptId()

      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tagForm.clearValidate()
      })
    },
    deleteClick(row) {
      this.$confirm(`确定删除常见问题吗？`, '删除常见问题', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.$api.patientFaq
            .delete(row.id)
            .then((res) => {
              this.$message.success('删除成功')
              this.getList()
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {})
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
        type: 'error',
      })
        .then(() => {
          this.$api.faqCategory
            .delete(this.cageSelect.id)
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
        })
        .catch(() => {})
    },
    cateClick(cate) {
      this.page = 1
      this.searchForm.category = cate.id
      this.getList()
    },
    addCate() {
      this.$refs.cateForm.validate((valid) => {
        if (valid) {
          this.$api.faqCategory
            .create({
              ...this.cateForm,
            })
            .then((res) => {
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
        question: this.tagForm.question,
        answer: this.tagForm.answer,
        category: this.tagForm.category,
        permission: this.tagForm.permission,
        tags_id: this.tagForm.tags_id.map((ele) => ele[1]),
        dpt_scope_id: this.tagForm.dpt_scope_id.map((ele) => ele[1]),
        department: this.userInfo.selectedDepartment.id,
      }
      this.$api.patientFaq
        .create(params)
        .then((res) => {
          this.dialogVisible = false
          this.getList()
          this.$message.success('新增成功')
        })
        .catch((err) => {
          if (err.detail === '发布内容存在违规词汇，请编辑后重新发送。') {
            this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
              confirmButtonText: '好的',
              showCancelButton: false,
              type: 'error',
            })
          } else if (err.code === 'multiple') {
            this.$message.error(err.list.map((item) => item.detail).join(''))
          } else {
            this.$message.error(err.detail)
          }
        })
    },

    update() {
      let params = {
        question: this.tagForm.question,
        answer: this.tagForm.answer,
        category: this.tagForm.category,
        permission: this.tagForm.permission,
        tags_id: this.tagForm.tags_id.map((ele) => ele[1]),
        dpt_scope_id: this.tagForm.dpt_scope_id.map((ele) => ele[1]),
        department: this.userInfo.selectedDepartment.id,
      }
      this.$api.patientFaq
        .update(this.form.id, params)
        .then((res) => {
          this.dialogVisible = false
          this.getList()
          this.$message.success('修改成功')
        })
        .catch((err) => {
          if (err.detail === '发布内容存在违规词汇，请编辑后重新发送。') {
            this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
              confirmButtonText: '好的',
              showCancelButton: false,
              type: 'error',
            })
          } else if (err.code === 'multiple') {
            this.$message.error(err.list.map((item) => item.detail).join(''))
          } else {
            this.$message.error(err.detail)
          }
        })
    },
  }, // methods end
  computed: {
    ...mapGetters(['userInfo']),
    canSelected() {
      // 糖吉账户 并且选择了糖吉机构
      return !(this.userInfo.department.org_id == 1 && this.userInfo.selectedOrganization.id == 1)
    },
  },
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
  background-color: #f4f5fa;
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
    background-color: #f4f5fa;

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
    color: #00b386;
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
    width: 600px;
    height: 600px;
    .el-dialog__body {
      height: 450px;
      overflow: scroll;
    }
  }
  :deep(.el-form-item__label) {
    width: 80px;
  }
}

.resizeNone {
  :deep(.el-textarea__inner) {
    //el_input中的隐藏属性
    //  resize: none;  //主要是这个样式
    border-radius: 12px;
  }
}
:deep(.el-tag) {
  color: #333;
}
</style>
