<template>
  <div>
    <el-select
      v-model="selections"
      placeholder="请选择"
      multiple
      style="width: 420px;"
      @click.native="rolesClick"
      popper-class="roles-select-popper"
      class="main-el-select roles-select"
    >
      <el-option
        v-for="role in roles"
        :key="role.id"
        :label="role.name"
        :value="role.id"
      ></el-option>
    </el-select>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      class="dialog"
      @close="closeDialog"
    >
      <div class="role-list">
        <div
          :key="index"
          v-for="(item, index) in accountInfo.users"
          class="role-item"
        >
          <div class="name" :title="item.role_name">{{ item.role_name }}</div>
          <div class="status">
            <el-tag type="success" v-if="item.is_active" effect="dark">启用中</el-tag>
            <el-tag type="info" v-else effect="dark">已禁用</el-tag>
          </div>
          <div>
            <m-button @click="removeRole(index)" v-if="item.isNewAdd" class="btn remove-btn" type="danger" h="32px"
                      icon="el-icon-delete"></m-button>
            <m-button @click="toggleActive(item)" type="danger" v-if="item.is_active" class="btn" h="32px">禁 用
            </m-button>
            <m-button @click="toggleActive(item)" type="primary" v-else class="btn" h="32px">启 用</m-button>
          </div>
        </div>
        <div class="role-item">
          <el-select
            v-model="addRoleSelect"
            placeholder="请选择"
            style="width: 280px; height: 40px;"
            class="add-role-select"
          >
            <el-option
              v-for="role in addRoleFilter"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            ></el-option>
          </el-select>
          <m-button type="iron" class="btn" h="38px" @click="addRole(addRoleSelect)">添 加</m-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="closeDialog" w="80px">取 消</m-button>
        <m-button @click="save" w="80px">确 定</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('RecipeEditor', true)

export default {
  name: 'RoleEditor',
  props: {
    title: {
      type: String,
      default: '修改角色',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      required: true,
    },
    accountInfo: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      dialogVisible: false,
      localSelections: [],
      addRoleSelect: '',
      usersClone: [],
    }
  },
  watch: {
    'accountInfo.users'(users) {
      this.$emit('input', users.map(item => item.role_id))
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.usersClone = this.$clone(this.accountInfo.users)
    })
  },
  methods: {
    rolesClick() {
      this.dialogVisible = true
    },
    toggleActive(item) {
      item.is_active = !item.is_active
    },
    addRole(addRoleSelect) {
      if (addRoleSelect === '') return this.$message.error('请选择要添加的角色')
      // const hasRoles = this.accountInfo.users.map(item => item.role_id)
      // if(hasRoles.includes('admin')) return this.$message.warning('')

      const role = this.roles.find(item => item.id === addRoleSelect)
      this.accountInfo.users.push({
        account_id: this.accountInfo.id,
        role_id: role.id,
        role_name: role.name,
        is_active: true,
        isNewAdd: true,
      })
      this.addRoleSelect = ''
    },
    removeRole(index) {
      this.accountInfo.users.splice(index, 1)
    },
    closeDialog() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    },
    cancel() {
      this.accountInfo.users = this.usersClone
      this.closeDialog()
    },
    save() {
      this.$emit('save', this.accountInfo.users)
      this.closeDialog()
    },
    showDialog() {
      this.dialogVisible = true
      this.$emit('update:visible', this.dialogVisible)
    },
  }, // methods end
  computed: {
    selections: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    addRoleFilter() {
      if (!this.accountInfo.users) return
      const hasRoles = this.accountInfo.users.map(item => item.role_id)
      if (hasRoles.includes('admin')) {
        return this.roles.filter(role => !hasRoles.includes(role.id) && role.id !== 'ld' && role.id !== 'rd')
      } else if (hasRoles.includes('ld')) {
        return this.roles.filter(role => !hasRoles.includes(role.id) && role.id !== 'admin' && role.id !== 'rd')
      } else if (hasRoles.includes('rd')) {
        return this.roles.filter(role => !hasRoles.includes(role.id) && role.id !== 'ld' && role.id !== 'admin')
      } else {
        return this.roles.filter(role => !hasRoles.includes(role.id))
      }
    },
    // addRoleFilter() {
    //   if (!this.accountInfo.users) return
    //   const hasRoles = this.accountInfo.users.map(item => item.role_id)
    //   return this.roles.filter((item) => {
    //     if (!hasRoles.includes(item.id)) {
    //       return item
    //     }
    //   })
    // },
  }, // computed end
}
</script>

<style scoped lang="less">
.dialog {
  :deep(.el-dialog) {
    width: 600px;
    height: 560px;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
    }
  }
}

.main-el-select {
  cursor: default;

  :deep(.el-input__inner) {
    cursor: default;
  }

  :deep(.el-select__tags) {
    cursor: default;

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

.roles-select {
  :deep(.el-input__suffix) {
    display: none;
  }

  :deep(.el-select__tags) {
    cursor: default;

    .el-tag__close {
      display: none;
    }
  }
}

.role-list {
  .role-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 12px;
    border: 1px solid #dadce0;
    position: relative;
    cursor: default;

    .name {
      margin-left: 10px;
      width: 130px;
      .text-ellipsis();
    }

    .status {
      position: absolute;
      left: 150px;
    }

    .btn {
      margin-right: 10px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .remove-btn {
      margin: 0;
    }

    .add-role-select {
      margin-left: 10px;

      :deep(.el-input__inner) {
        height: 38px;
      }
    }
  }
}
</style>
<style>
.roles-select-popper {
  display: none;
}
</style>
