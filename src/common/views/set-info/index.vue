<template>
  <div class="panel scroll">
    <div class="card">
      <div class="card-title">
        <i
          v-if="oldPhoneVerifyView || newPhoneVerifyView"
          class="back-btn el-icon-back"
          @click="resetForm"
        ></i>
        {{ title }}
      </div>
      <el-form
        class="form-box"
        :model="form"
        ref="form"
        label-position="right"
        label-width="180px"
      >
        <template v-if="!oldPhoneVerifyView && !newPhoneVerifyView">
          <el-row>
            <el-form-item label="账号" required>
              <el-input v-model="form.username" placeholder="请输入注册账号（仅支持手机号）" clearable
                        style="width: 310px;" readonly></el-input>
              <m-button class="ml_10" @click="changePhoneClick">修改手机号</m-button>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="姓名" required>
              <el-input v-model="form.name" placeholder="请输入姓名" clearable
                        style="width: 430px;"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="头像（个人照片）" prop="image_path" required>
              <m-upload
                class="upload-box"
                :image-url.sync="form.avatar_url"
                :image-path.sync="form.avatar_path"
                accept=".jpg,.jpeg,.png,.gif"
                hide-tips
                use-crop
              ></m-upload>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <m-button @click="save">保存</m-button>
              <m-button plain @click="leavePage">返回</m-button>
            </el-form-item>
          </el-row>
        </template>
        <template v-if="oldPhoneVerifyView && !newPhoneVerifyView">
          <el-row>
            <p>
              您正在修改账号，请先完成身份验证。验证码已发送至原手机号：
            </p>
            <p>
              {{ this.form.username }}，有效期10分钟
            </p>
          </el-row>
          <el-row class="mb_20">
            <el-input v-model="oldPhoneVerifyCode" placeholder="请输入验证码" clearable
                      style="width: 245px;"></el-input>
            <m-button class="ml_10" w="155px" h="40px" v-show="!oldPhoneTimeShow" @click="getOldPhoneVerifyCode">
              重新获取
            </m-button>
            <m-button class="ml_10 disable" w="155px" h="40px" v-show="oldPhoneTimeShow">
              {{ oldPhoneTime }}秒后可重新获取
            </m-button>
          </el-row>
          <el-row>
            <m-button w="410px" @click="verifyOldPhone">下一步</m-button>
          </el-row>
        </template>
        <template v-if="!oldPhoneVerifyView && newPhoneVerifyView">
          <el-row>
            <el-input v-model="newPhone" placeholder="请输入新手机号" clearable
                      style="width: 410px;"></el-input>
          </el-row>
          <el-row class="mt_20 mb_20">
            <el-input v-model="newPhoneVerifyCode" placeholder="请输入验证码" clearable
                      style="width: 245px;"></el-input>
            <m-button class="ml_10" w="155px" h="40px" v-show="!newPhoneTimeShow" @click="getNewPhoneVerifyCode">
              获取验证码
            </m-button>
            <m-button class="ml_10 disable" w="155px" h="40px" v-show="newPhoneTimeShow">
              {{ newPhoneTime }}秒后可重新获取
            </m-button>
          </el-row>
          <el-row>
            <m-button w="410px" @click="verifyNewPhone">下一步</m-button>
          </el-row>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script>
import LocalStore from '@/common/utils/LocalStore'
import { mapActions, mapGetters } from 'vuex'

const localSession = new LocalStore('SetInfo', true)

export default {
  name: 'SetInfo',
  data() {
    return {
      form: {
        name: '',
        username: '',
        avatar_url: '',
        avatar_path: '',
      },
      imgSrc: '',
      oldPhoneVerifyView: false,
      newPhoneVerifyView: false,
      oldPhoneVerifyCode: '',
      oldPhoneSecret: 'a',
      newPhoneVerifyCode: '',
      newPhone: '',

      oldPhoneTime: 0,
      oldPhoneTimeShow: true,
      newPhoneTime: 0,
      newPhoneTimeShow: false,
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    ...mapActions({
      setUserInfo: 'user/setUserInfo',
    }),
    initForm() {
      this.form.name = this.userInfo.name
      this.form.username = this.userInfo.account.username
      this.form.avatar_url = this.userInfo.avatar_url
      this.form.avatar_path = this.userInfo.avatar_path
    },
    resetForm() {
      this.oldPhoneVerifyView = false
      this.newPhoneVerifyView = false
      this.oldPhoneVerifyCode = ''
      this.oldPhoneSecret = ''
      this.newPhoneVerifyCode = ''

      this.oldPhoneTime = 0
      this.oldPhoneTimeShow = true

      this.newPhoneTime = 0
      this.newPhoneTimeShow = true
    },
    save() {
      if (this.form.name === '') {
        return this.$message.error('请输入姓名')
      }
      if (!this.$valid.phone(this.form.username)) {
        return this.$message.error('请输入正确的11位手机号码')
      }
      if (this.form.avatar_path === '' && this.form.avatar_url === '') {
        return this.$message.error('请上传头像')
      }

      const params = {
        account: {
          id: this.userInfo.account.id,
          name: this.form.name,
          username: this.form.username,
        },
        name: this.form.name
      }
      if (this.form.avatar_path) params.avatar_path = this.form.avatar_path

      this.$api.user.patchMe(params)
        .then((res) => {
          this.setUserInfo(res.data)
          this.$message.success('修改信息成功')
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
    },
    changePhoneClick() {
      if (this.form.username === '') {
        return this.$message.error('手机号不能为空')
      }
      if (!this.$valid.phone(this.form.username)) {
        return this.$message.error('请输入正确的11位手机号码')
      }
      this.oldPhoneVerifyView = true
      this.oldPhoneTime = 60
      this.newPhoneVerifyView = false
      this.getOldPhoneVerifyCode()
    },
    oldPhoneTimeCountdown() {
      this.oldPhoneTimeShow = true
      this.oldPhoneTime = 60 - 1
      const timer = setInterval(() => {
        this.oldPhoneTime--
        if (this.oldPhoneTime <= 0) {
          clearInterval(timer)
          this.oldPhoneTimeShow = false
        }
      }, 1000)
    },
    newPhoneTimeCountdown() {
      this.newPhoneTimeShow = true
      this.newPhoneTime = 60 - 1
      const timer = setInterval(() => {
        this.newPhoneTime--
        if (this.newPhoneTime <= 0) {
          clearInterval(timer)
          this.newPhoneTimeShow = false
        }
      }, 1000)
    },
    getOldPhoneVerifyCode() {
      this.oldPhoneVerifyCode = ''
      this.$api.accounts.requestChangePhone()
        .then((res) => {
          this.oldPhoneTimeCountdown()
        })
        .catch((err) => {
          this.oldPhoneTimeShow = false
          this.$message.error(err.detail)
        })
    },
    verifyOldPhone() {
      if (this.oldPhoneVerifyCode === '') {
        return this.$message.error('请输入验证码')
      }
      this.$api.accounts.verifyChangePhone(this.oldPhoneVerifyCode)
        .then((res) => {
          this.oldPhoneSecret = res.data.secret
          this.oldPhoneVerifyView = false
          this.newPhoneVerifyView = true
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
    },
    getNewPhoneVerifyCode() {
      if (this.oldPhoneSecret === '') {
        return this.$message.error('请进行原手机号验证')
      }
      if (this.newPhone === '') {
        return this.$message.error('请输入手机号')
      }
      if (!this.$valid.phone(this.newPhone)) {
        return this.$message.error('请输入正确的11位手机号码')
      }
      if (this.newPhone === this.form.username) {
        return this.$message.error('新手机号与原账号一致，请更换其他手机号')
      }
      this.$api.accounts.getNewPhoneVerifyCode(this.newPhone, this.oldPhoneSecret)
        .then((res) => {
          this.newPhoneTimeCountdown()
        })
        .catch((err) => {
          this.newPhoneTimeShow = false
          this.$message.error(err.detail)
        })
    },
    verifyNewPhone() {
      if (this.newPhoneVerifyCode === '') {
        return this.$message.error('请输入验证码')
      }
      this.$api.accounts.changePhoneNumber(this.newPhoneVerifyCode)
        .then((res) => {
          this.$api.user.info()
            .then((res) => {
              this.setUserInfo(res.data)
              this.initForm()
            })
          this.resetForm()
          this.$message.success('修改手机号成功')
        })
        .catch((err) => {
          this.$message.error(err.detail)
        })
    },
    leavePage() {
      this.$router.go(-1)
    }
  }, // methods end
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    title() {
      if (!this.oldPhoneVerifyView && !this.newPhoneVerifyView) {
        return '修改个人信息'
      } else if (this.oldPhoneVerifyView && !this.newPhoneVerifyView) {
        return '原手机号验证'
      } else if (!this.oldPhoneVerifyView && this.newPhoneVerifyView) {
        return '新手机号验证'
      }
    },
  },
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

      :deep(.el-input__inner[readonly]) {
        background-color: #f1f1f1 !important;
        cursor: no-drop;
      }
    }

    //.el-select {
    //  width: 100%;
    //}
  }
}

.upload-box {
  height: 150px;
  width: 150px;
  overflow: hidden;

  :deep(.el-upload-list__item) {
    transition: none !important;
  }

  :deep(.el-upload--picture-card) {
  }
}

.back-btn {
  cursor: pointer;

  &:hover {
    color: @primaryColor;
  }
}

.disable {
  background-color: #c8c9cc !important;

  &:hover, &:focus {
    background-color: #c8c9cc !important;
  }
}
</style>
