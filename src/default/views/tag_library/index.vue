<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_zsk" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>基础设置</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <b>知识库</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        标签库
      </el-breadcrumb-item>
    </el-breadcrumb>

    <m-button v-auth="'nutrTagLibrary.create'" class="common-add-btn" icon="el-icon-plus" @click="addClick">添加</m-button>
    <div class="card">
      <div class="container">
        <el-form
          class="form-box"
          :model="form"
          ref="form"
          label-position="top"
        >
          <div class="search-bar">
            <el-row class="search-bar-row" type="flex" justify="start" align="middle"
                    :gutter="20" style="width: 100%; height: 100%">
              <el-col class="search-bar-col" :span="6">
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
              <el-col class="search-bar-col" :span="5">
                <el-row class="label-t">分类</el-row>
                <el-row>
                  <el-form-item prop="stage">
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
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="标签名称"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="category.name"
            label="分类"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="attribute"
            label="开放范围"
            min-width="120"
          >
            <template v-slot="scope">
              <span v-if="scope.row.attribute == 'Public'">公开</span>
              <span v-if="scope.row.attribute == 'Auto'">自动</span>
              <span v-if="scope.row.attribute == 'Private'">私有</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="created_at"
            label="创建时间"
            min-width="120"
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
              <div v-if="scope.row.attribute == 'Private'" class="flex justify_center">
                <icon-box v-auth="'nutrTagLibrary.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor:pointer;"
                          title="编辑" @click.native="editClick(scope.row)"></icon-box>
                <icon-box v-auth="'nutrTagLibrary.delete'" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor:pointer;" title="删除"
                          @click.native="deleteClick(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-table>
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
        <el-form-item label="名称" required class="mt_20" prop="name">
          <el-input v-model="tagForm.name" clearable placeholder="请输入标签名称" style="width: 380px;"></el-input>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TagLibrary',
  data() {
    return {
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
      tagForm: {
        name: '',
        category_id: '',
      },
      searchFrom: {
        name: null,
        category_id: null
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
    }
  },
  mounted() {
    this.getCategoryList()
    this.getTagList()
  },
  methods: {
    getCategoryList() {
      this.$api.tagCategories.getList({}).then((res) => {
        this.category = res.data.results
      })
        .catch((err) => {
       this.$message.error(JSON.stringify(err))
        })
    },

    getTagList() {
      const { table } = this.$refs
      if (table) table.loadStart()
      this.$api.tag.getList({
        page: this.page,
        page_size: this.pageSize,
        search: this.searchFrom.name,
        category_id: this.searchFrom.category_id,
        private_dpt: this.userInfo.selectedDepartment.id,
        // creator__account__department: this.userInfo.selectedDepartment.id,
        ordering: 'id',
        attribute__in: "Private,Public"
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
      this.tagForm = {}
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
              const { table } = this.$refs
              if(table) table.refresh()
            })
            .catch((err) => {
              if (err.code === 'multiple') {
                this.$message.error(err.list.map(item => item.detail).join(''))
              } else {
                this.$message.error(err.detail)
              }
            })
        })
        .catch(() => {
        })
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
        attribute: "Private"
      }).then(res => {
        this.dialogVisible = false
        this.getTagList()
        this.$message.success('新增成功')
      })
    },

    update() {
      this.$api.tag.update(this.form.id, {
        ...this.tagForm,
        attribute: "Private"
      }).then(res => {
        this.dialogVisible = false
        this.getTagList()
        this.$message.success('修改成功')
      })
    },
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  }
}
</script>

<style scoped lang="less">
.panel {
  //.card {
  //  margin-top: 32px;
  //  height: calc(100% - 32px - 32px);
  //}
}

.m-table {
  height: calc(100% - 90px);
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
</style>
