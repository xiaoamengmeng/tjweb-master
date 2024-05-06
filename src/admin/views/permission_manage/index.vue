<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>用户管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        权限管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <m-button v-auth="'permission.create'" class="common-add-btn" icon="el-icon-plus" @click="toSetPage">新建</m-button>
        <m-table
          class="m-table"
          ref="table"
          :data="tableData"
          :total="total"
          :page-sizes="[10, 15, 20]"
          :page-size.sync="pageSize"
          :current-page.sync="page"
          :height="'calc(100%)'"
          :get-data-func="getDataFunc"
        >
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="序号"
            min-width="60"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            align="center"
            label="权限组名称"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="id"
            label="成员"
            align="center"
            min-width="200"
          >
            <template v-slot="scope">
              <span v-if="scope.row.members">{{
                  scope.row.members.join(',')
                }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="200">
            <template v-slot="scope">
              <div class="flex justify_center">
                <el-link v-auth="'permission.setPermission'" @click.native="gotoSet(scope.row)">权限管理</el-link>
                <span class="inline_block mr_10"></span>
                <el-link v-auth="'permission.member'" @click.native="gotoMemberManage(scope.row)">成员管理</el-link>
                <span class="inline_block mr_10"></span>
                <el-link v-auth="'permission.update'" @click.native="changeInfoClick(scope.row)">修改</el-link>
                <span class="inline_block mr_10"></span>
                <el-link v-auth="'permission.delete'" @click.native="deleteClick(scope.row)">删除</el-link>
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
        :model="permissionForm"
        :rules="permissionRules"
        ref="permissionForm"
        label-width="60"
        label-position="left"
      >
        <el-form-item label=" 权限组名称 " prop="name" class="mt_20">
          <el-input v-model="permissionForm.name" type="text" placeholder="请输入权限组名称"
                    class=""
                    style="width: 320px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false" w="80px">取 消</m-button>
        <m-button w="80px" @click="save">保 存</m-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'PermissionManage',
  components: {
    
  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      dialogVisible: false,
      dialogTitle: "添加权限组",
      permissionForm: {
        name: ''
      },
      permissionRules: {
        name: [
          { required: true, message: '请输入权限组名称', trigger: 'change' }
        ],
      },
    }
  },
  mounted() {
    this.getDataFunc()
  },
  methods: {
    getDataFunc() {
      this.$refs.table.loadStart()
      this.$api.permissionManagement.getList({
        page: this.page,
        page_size: this.pageSize,
        ordering: 'id',
      })
        .then((res) => {
          this.$refs.table.loadDone()
          this.tableData = res.data.results
          this.total = res.data.count
        })
        .catch((err) => {
          this.$refs.table.loadDone()
          this.$message.error(JSON.stringify(err))
        })
    },
    save() {
      this.$refs['permissionForm'].validate((valid) => {
        if (valid) {
          if (this.currAccount.id) {
            this.update()
          } else {
            this.create()
          }
        } else {
          return false
        }
      })
    },
    update() {
      const params = { ...this.permissionForm, }
      params.data_permission_id = this.currAccount.data_permission ? this.currAccount.data_permission.id : ''
      this.$api.permissionManagement.update(this.currAccount.id, params)
        .then(res => {
          this.$message.success('修改权限组成功')
          this.getDataFunc()
          this.dialogVisible = false
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map(item => item.detail).join('')))
          } else {
            this.$message.error(JSON.stringify(err.detail))
          }
        })
    },
    create() {
      const params = { ...this.permissionForm, }
      params.data_permission_id = ''
      this.$api.permissionManagement.create(params)
        .then(res => {
          this.$message.success('新增权限组成功')
          this.getDataFunc()
          this.dialogVisible = false
        })
        .catch((err) => {
          if (err.code === 'multiple') {
            this.$message.error(JSON.stringify(err.list.map(item => item.detail).join('')))
          } else {
            this.$message.error(JSON.stringify(err.detail))
          }
        })
    },
    toSetPage() {
        this.dialogVisible = true
        this.permissionForm.name = ''
        this.currAccount = {}
        this.$nextTick(() => {
            const { permissionForm } = this.$refs
            if (permissionForm) permissionForm.clearValidate()
        })
    },
    changeInfoClick(row) {
        this.dialogVisible = true
        this.permissionForm.name = row.name
        this.currAccount = row
        this.$nextTick(() => {
            const { permissionForm } = this.$refs
            if (permissionForm) permissionForm.clearValidate()
        })
    },

    gotoSet(row) {
      this.$router.push({
        name: 'SetPermission',
        params: {
          ...row,
        },
      })
    },

    gotoMemberManage(row) {
      this.$router.push({
        name: 'MemberManage',
        params: {
          ...row,
        },
      })
    },

    deleteClick(row) {
      this.$confirm(`确认删除该权限组吗？`, '删除权限组', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$api.permissionManagement.delete(row.id)
          .then(res => {
            this.$message.success('删除成功')
            this.getDataFunc()
          })
          .catch((err) => {
            if (err.code === 'protected_error') {
              this.$message.error('删除失败，账号受到保护，无法删除')
            } else {
              this.$message.error(JSON.stringify(err))
            }
          })
      })
    },

  }
}
</script>

<style scoped lang="less">
.m-table {
  height: calc(100% - 50px);
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

.form-box {
  .el-select {
    :deep(.el-select__tags) {
      .el-tag {
        box-sizing: border-box;
        background-color: #e9e9eb;
        color: #909399;

        .el-tag__close.el-icon-close::before {
          background: transparent;
          color: #fff;
        }
      }
    }
  }
}
</style>
