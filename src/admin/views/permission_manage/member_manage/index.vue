<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{name: 'PermissionManage'}">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>权限管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>成员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container">
          <m-button class="common-add-btn" icon="el-icon-plus" @click="toSetPage()">添加成员</m-button>
          <div class="info-top">
            <div>
                <p>权限组名称</p>
                <p>{{ permission.name }}</p>
            </div>
          </div>
          <m-table
            class="m-table"
            ref="table"
            :data="tableData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            :height="'calc(100vh - 320px)'"
            :get-data-func="getDataFunc"
            >
            <el-table-column
                show-overflow-tooltip
                prop="name"
                label="姓名"
                min-width="100"
            >
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="username"
                label="账户"
                min-width="100"
            >
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="users"
                label="人员类型"
                min-width="100"
            >
              <template v-slot="scope">
                <span v-if="scope.row.users && scope.row.users[0]">{{ scope.row.users[0].role_name }}</span>
              </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="id"
                label="所属机构"
                min-width="100"
            >
              <template v-slot="scope">
                <span v-if="scope.row.users && scope.row.users.length > 0">{{ scope.row.users[0].department.org_name }}</span>
                <!-- <span v-if="scope.row.department">{{ scope.row.department.org_name }}</span> -->
              </template>
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="id"
                label="所属部门"
                min-width="100"
            >
              <template v-slot="scope">
                <span v-if="scope.row.users && scope.row.users.length > 0">{{ scope.row.users[0].department.name }}</span>
                <!-- <span v-if="scope.row.department">{{ scope.row.department.name }}</span> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
                <template v-slot="scope">
                <div class="flex justify_center">
                    <el-link @click.native="deleteClick(scope.row)">删除</el-link>
                </div>
                </template>
            </el-table-column>
          </m-table>
      </div>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
const localSession = new LocalStore('memberManage', true)

export default {
  name: 'MemberManage',
  components: {
  },
  watch: {

  },
  computed: {

  },
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      permission: {

      }
    }
  },
  mounted() {
    this.initForm()
    this.getDataFunc()
  },
  methods: {
    getDataFunc() {
      this.$refs.table.loadStart()
      this.$api.accounts.getList({
        page: this.page,
        page_size: this.pageSize,
        permission_group: this.permission.id,
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
    initForm() {
      const params = this.$route.params
      let data = params
      if (Object.keys(params).length === 0) {
        const cache = localSession.get('cache')
        if (!cache) return
        data = cache
      } else {
        localSession.set('cache', params)
      }
      this.permission = data
    },
    save() {

    },
    toSetPage() {
      this.$router.push({
        name: 'AddMember',
        params: {
          ...this.permission,
        },
      })
    },
    leavePage() {
      this.$router.go(-1)
    },
    deleteClick(row) {
      this.$confirm(`确定移除账号吗？`, '移除账号', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$api.accounts.patch(row.id, {
          group_id: ''
        })
          .then(res => {
            this.$message.success('移除成功')
            this.getDataFunc()
          })
          .catch((err) => {
            if (err.code === 'protected_error') {
              this.$message.error('移除失败，账号受到保护，无法移除')
            } else {
              this.$message.error(JSON.stringify(err))
            }
          })
      })
    },
  }, // methods end
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

.info-top {
    display: flex;
    flex-direction: row;
    align-items: center;

    div {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 30px;

    p {
        font-size: 14px;
    }
    }

    div p:first-child {
    font-weight: 700;
    }

    div p:last-child {
    margin-left: 10px;
    }
}

</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
