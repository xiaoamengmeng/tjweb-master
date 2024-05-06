<template>
  <div class="panel scroll">
    <div class="card">
      <div class="card-title">
        修改密码
      </div>
      <el-form
        class="form-box"
        :model="form"
        ref="form"
        label-position="right"
        label-width="180px"
      >
        <el-row>
          <el-form-item label="旧密码" required>
            <el-input type="password" show-password v-model="form.old_password" placeholder="请输入旧密码" clearable
                      style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码" required>
            <el-input type="password" show-password v-model="form.new_password" placeholder="请输入新密码" clearable
                      style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="确认密码" required>
            <el-input type="password" show-password v-model="form.confirm_password" placeholder="请输入确认密码" clearable
                      style="width: 450px;"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item>
          <m-button @click="save">保存</m-button>
          <m-button plain @click="leavePage">返回</m-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'

const localSession = new LocalStore('SetDish', true)

export default {
  name: 'SetDish',
  data() {
    return {
      form: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
    }
  },
  mounted() {

  },
  methods: {
    save() {
      if(this.form.old_password === '') {
        return this.$message.error('请输入旧密码')
      }
      if(this.form.new_password === '') {
        return this.$message.error('请输入新密码')
      }
      if(this.form.confirm_password === '') {
        return this.$message.error('请输入确认密码')
      }
      if(this.form.new_password !== this.form.confirm_password) {
        return this.$message.error('两次输入密码不一致')
      }

      this.$api.accounts.changePasswordByOldPassword({
        old_password: this.form.old_password,
        new_password: this.form.new_password
      })
        .then((res) => {
          Object.assign(this.$data.form, this.$options.data().form)
          this.$message.success('修改密码成功')
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
    },
    leavePage() {
      this.$router.go(-1)
    }
  }, // methods end
  computed: {},
}
</script>

<style scoped lang="less">
.panel {
  .card {
    //height: calc(100vh - 32px - 32px - 48px);
    min-height: calc(100% - 90px - 48px);
  }
}

.form-box {
  width: 800px;

  .el-form-item {
    width: 100%;

    .el-input {
      width: 100%;
    }

    //.el-select {
    //  width: 100%;
    //}
  }
}

.upload-box {
  height: 150px;
  width: 200px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
  }
}
</style>
