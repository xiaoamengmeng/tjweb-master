<template>
  <div class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-w="20" box-h="90"></icon-box>
        <b>用户管理</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        角色权限
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="card">
      <div class="container flex">
        <div class="category">
          <m-category
            :data="roles"
            :select.sync="rolesSelect"
            @add="addClick"
            @minus="minusClick"
            @click="selectRole"
            title="角色"
          ></m-category>
        </div>

        <div class="content">
          <m-button w="80px" @click="save">保 存</m-button>
          <m-button type="iron" @click="selectAll" w="80px">全 选</m-button>
          <m-button type="danger" @click="clear" w="80px">清 空</m-button>
          <m-button class="right" @click="toAdminPage">系统后台</m-button>
          <ul class="group-root">
            <li class="group-item" :key="index" v-for="(group, index) in permissions">
              <div class="group-text">
                <el-checkbox @change="groupChange(group)" v-model="group.checked">{{ group.name }}</el-checkbox>
              </div>
              <ul class="module-root">
                <li class="module-item" :key="idx" v-for="(module, idx) in group.modules">
                  <div class="module-text">
                    <el-checkbox @change="moduleChange(module)" v-model="module.checked">{{
                        module.name
                      }}
                    </el-checkbox>
                  </div>
                  <ul class="permission-root">
                    <li class="permission-item" :key="inde" v-for="(permission, inde) in module.permissions">
                      <template v-if="permission.is_enabled">
                        <div class="permission-text">
                          <el-checkbox @change="permissionChange(permission)" v-model="permission.checked">
                            {{ permission.name }}
                          </el-checkbox>
                        </div>
                      </template>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>

        </div>
      </div>
    </div>

    <el-dialog
      title="添加角色"
      :visible.sync="rolesDialogVisible"
      :modal="true"
    >
      <el-form
        class="form-box"
        :model="rolesForm"
        ref="rolesForm"
        :rules="rules"
        label-width="55px"

      >
        <el-form-item label="id" prop="id" class="mt_20">
          <el-input v-model="rolesForm.id" placeholder="请输入角色名称id" class="" style="width: 380px;"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" class="mt_20">
          <el-input v-model="rolesForm.name" placeholder="请输入角色名称" class="" style="width: 380px;"></el-input>
        </el-form-item>
        <el-form-item label="序号" prop="order" class="mt_20">
          <el-input v-model="rolesForm.order" placeholder="请输入序号" class="" style="width: 380px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
		    <m-button type="default" @click="rolesDialogVisible = false" w="80px">取 消</m-button>
		    <m-button @click="addRoles" w="80px">保 存</m-button>
		  </span>
    </el-dialog>

  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('Permission', true)

export default {
  name: 'Permission',
  data() {
    return {
      roles: [],
      rolesSelect: {},
      rolesDialogVisible: false,
      rolesForm: {
        name: '',
        id: '',
        is_display: true,
        is_editable: true,
        order: ''
      },
      rules: {
        name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        id: [{ required: true, message: '请填写角色id', trigger: 'blur' }],
        order: [{ required: true, message: '请填写序号', trigger: 'blur' }],
      },
      permissions: [],
      rolePermissions: []
    }
  },
  mounted() {
    this.getRoles()
    this.getAllPermissions()
  },
  methods: {
    getRoles() {
      this.$api.roles.getList()
        .then((res) => {
          this.roles = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getAllPermissions() {
      this.$api.roles.getPermissionsList()
        .then((res) => {
          const results = res.data.results
          this.traversalPermissions(results)
          this.permissions = results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    traversalPermissions(data) {
      data.forEach(item => {
        if (item.modules && item.modules.length > 0) {
          item.myid = 'group_' + item.id
          item.checked = false
          this.traversalPermissions(item.modules)
        }
        if (item.permissions && item.permissions.length > 0) {
          item.myid = 'module_' + item.id
          item.checked = false
          this.traversalPermissions(item.permissions)
        }
        if (item.codename) {
          item.checked = false
          item.myid = 'permissions_' + item.id
        }
      })
    },
    getUserPermissions() {
      this.$api.roles.getUserPermissions(this.rolesSelect.id, {
        role_id: this.rolesSelect.id,
        page: 1,
        page_size: 9999,
      })
        .then((res) => {
          const results = res.data.results
          this.rolePermissions = results
          this.setPermissions(results)
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    setChecked(data, id) {
      data.forEach(item => {
        if (item.id === id) {
          item.checked = true
          if (item.modules) {
            this.groupChange(item)
          } else if (item.permissions) {
            this.moduleChange(item)
          }
        }

        if (item.modules && item.modules.length > 0) {
          this.setChecked(item.modules, id)
        }

        if (item.permissions && item.permissions.length > 0) {
          this.setChecked(item.permissions, id)
        }
        if (item.codename) {
          if (item.id === id) {
            item.checked = true
          }
        }
      })
    },
    setPermissions(data) {
      data.forEach(item => {
        if (item.group) {
          this.setChecked(this.permissions, item.group)
        } else if (item.module) {
          this.setChecked(this.permissions, item.module)
        } else if (item.permission) {
          this.setChecked(this.permissions, item.permission)
        }
      })
    },
    getCheckedList(data, result) {
      data.forEach(group => {
        if (group.modules && group.modules.length > 0) {
          group.modules.forEach(module => {
            if (module && module.permissions.length > 0) {
              module.permissions.forEach(permission => {
                if (permission.checked) {
                  result.push({
                    permission: permission.id
                  })
                }
              })
            }
          })
        }
      })
    },
    selectRole(role) {
      if (Object.keys(role).length === 0) {
        return
      }
      this.clear()
      this.getUserPermissions()
    },
    moduleChange(targetModule) {
      targetModule.permissions.forEach(item => item.checked = targetModule.checked)
      let groupTmp = {}
      let moduleTmp = {}
      if (targetModule.checked) {
        this.permissions.forEach(group => {
          groupTmp = group
          if (group.modules && group.modules.length > 0) {
            group.modules.forEach(module => {
              moduleTmp = module
              if (module.myid === targetModule.myid) {
                if (!groupTmp.modules.some(item => item.checked === false)) {
                  groupTmp.checked = true
                }
              }
            })
          }
        })
      } else {
        this.permissions.forEach(group => {
          groupTmp = group
          if (group.modules && group.modules.length > 0) {
            group.modules.forEach(module => {
              moduleTmp = module
              if (module.myid === targetModule.myid) {
                groupTmp.checked = false
              }
            })
          }
        })
      }
    },
    permissionChange(targetPermission) {
      let groupTmp = {}
      let moduleTmp = {}
      if (targetPermission.checked) {
        this.permissions.forEach(group => {
          groupTmp = group
          if (group.modules && group.modules.length > 0) {
            group.modules.forEach(module => {
              moduleTmp = module
              if (module && module.permissions.length > 0) {
                module.permissions.forEach(permission => {
                  if (permission.myid === targetPermission.myid) {
                    console.log(groupTmp)
                    console.log(moduleTmp)
                    if (!moduleTmp.permissions.some(item => item.checked === false)) {
                      moduleTmp.checked = true
                    }
                    if (!groupTmp.modules.some(item => item.checked === false)) {
                      groupTmp.checked = true
                    }
                  }
                })
              }
            })
          }
        })
      } else {
        this.permissions.forEach(group => {
          groupTmp = group
          if (group.modules && group.modules.length > 0) {
            group.modules.forEach(module => {
              moduleTmp = module
              if (module && module.permissions.length > 0) {
                module.permissions.forEach(permission => {
                  if (permission.myid === targetPermission.myid) {
                    groupTmp.checked = false
                    moduleTmp.checked = false
                  }
                })
              }
            })
          }
        })
      }
    },
    groupChange(group) {
      group.modules.forEach(item => {
        item.checked = group.checked
        this.moduleChange(item)
      })
    },
    selectAll() {
      this.permissions.forEach(item => {
        item.checked = true
        this.groupChange(item)
      })
    },
    clear() {
      this.permissions.forEach(item => {
        item.checked = false
        this.groupChange(item)
      })
    },
    save() {
      if (Object.keys(this.rolesSelect).length === 0) {
        return this.$message.error('请先选择一个角色')
      }
      const params = this.buildPostParams()
      this.$api.roles.upUserPermissions(this.rolesSelect.id, params)
        .then((res) => {
          this.$message.success('保存权限成功')
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    buildPostParams() {
      const result = []
      this.permissions.forEach(group => {
        if (group.checked) {
          result.push({ group: group.id })
          return
        }
        if (group.modules && group.modules.length > 0) {
          group.modules.forEach(module => {
            if (module.checked) {
              result.push({ module: module.id })
              return
            }
            if (module && module.permissions.length > 0) {
              module.permissions.forEach(permission => {
                if (permission.checked) {
                  result.push({
                    permission: permission.id
                  })
                }
              })
            }
          })
        }
      })
      return result
    },
    addClick() {
      this.$nextTick(() => {
        const { rolesForm } = this.$refs
        if (rolesForm) rolesForm.clearValidate()
        this.rolesDialogVisible = true
      })
    },
    addRoles() {
      this.$refs['rolesForm'].validate((valid) => {
        if (valid) {
          this.$api.roles.create(this.rolesForm)
            .then((res) => {
              this.$message.success('新增成功')
              this.getRoles()
              this.rolesDialogVisible = false
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        } else {
          return false
        }
      })
    },
    minusClick() {
      if (Object.keys(this.rolesSelect).length === 0) {
        return this.$message.error('请选择角色')
      }
      this.$confirm(`确定删除角色【${this.rolesSelect.name}】吗？`, '删除角色', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$api.roles.delete(this.rolesSelect.id)
          .then((res) => {
            this.$message.success('删除成功')
            this.getRoles()
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })
      }).catch(() => {
      })
    },
    toAdminPage() {
      window.open(this.$config.SERVERS_URL + '/ZrTZDPiXR4Bo4RZh8tzEGmIsQG6irGDM/')
    },
  }, // methods end
  computed: {},
}
</script>

<style scoped lang="less">
.panel {
  .card {
    margin-top: 0 !important;
    min-height: calc(100% - 90px - 96px) !important;

    .container {
      margin: 0;
      min-height: calc(100% - 90px - 96px) !important;

      .content {
        flex: 1;
        width: calc(100% - 200px - 10px);
        min-height: 500px;
      }

      .category {
        margin-right: 10px;
        max-height: 500px;
      }
    }
  }
}

.form-box {
  // width: 800px;
  .el-form-item {
    width: 100%;

    .el-input {
      width: 100%;
    }
  }
}


.group-root {
  list-style-type: none;
  padding: 0;

  .group-text {
    padding-left: 10px;
    margin-top: 30px;
    display: block;
    line-height: 32px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #1E242C;
  }
}

.module-root {
  list-style-type: none;
  padding: 0;

  .module-item {
    display: flex;
    line-height: 40px;
    border-bottom: 1px solid #000;

    .module-text {
      padding-left: 40px;
      display: block;
      width: 40%;
    }
  }
}

.permission-root {
  list-style-type: none;
  padding: 0;
  text-align: left;
  width: 60%;

  .permission-item {
    display: inline-block;
    margin: 0 15px;
  }
}

</style>
