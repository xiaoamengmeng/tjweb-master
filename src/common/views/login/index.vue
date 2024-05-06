<template>
  <div class="login-wrapper">
    <div class="login-background">
      <div class="login-container">

<div
  class="login-form"
  :class="{'reset-pwd-form-box': resetPwdFlag}"
>

  <template v-if="resetPwdFlag">
    <div class="login-title">重置密码</div>
  </template>
  <template v-else>
    <div class="login-title">康定营养管理系统</div>
  </template>

  <div
    class="form-input"
    @click="focusInput('phone')"
    :class="{active: phoneActive}"
  >
    <div class="input-title">
      <icon-box icon-name="shoujihao" w="8" h="12" box-w="8"></icon-box>
      <span>用户名称</span>
    </div>
    <el-input
      v-if="resetPwdFlag"
      ref="phone"
      placeholder="请输入用户名称"
      clearable
      size="mini"
      v-model="phone"
      @focus="phoneActive = true"
      @blur="phoneActive = false"
      autocomplete="autocomplete"
    >
    </el-input>
    <el-autocomplete
      v-else
      ref="phone"
      placeholder="请输入用户名称"
      :fetch-suggestions="fetchUserList"
      clearable
      size="mini"
      v-model="phone"
      @focus="phoneActive = true"
      @blur="phoneActive = false"
      @select="userItemSelect"
    >
      <template v-slot="{ item }">
        <div class="user-item">
          {{ item.username }}
          <i class="el-icon-close" @click="removeUserItem($event, item.username)"></i>
        </div>

      </template>
    </el-autocomplete>
  </div>

  <div
    class="form-input"
    @click="focusInput('password')"
    :class="{active: passwordActive}"
    v-if="loginType === passwordLogin && !resetPwdFlag"
  >
    <div class="input-title">
      <icon-box icon-name="safety_small_b" w="10" h="11" box-w="10"></icon-box>
      <span>密码</span>
    </div>
    <el-input
      ref="password"
      type="password"
      show-password
      placeholder="请输入登录密码"
      clearable
      size="mini"
      v-model="password"
      @focus="passwordActive = true"
      @blur="passwordActive = false"
    >
    </el-input>
  </div>

  <div
    class="form-input"
    @click="focusInput('authCode')"
    :class="{active: authCodeActive}"
    v-if="loginType === verifyLogin || resetPwdFlag"
  >
    <div class="input-title">
      <icon-box icon-name="safety_small_b" w="10" h="11" box-w="10"></icon-box>
      <span>验证码</span>
    </div>
    <el-input
      ref="authCode"
      placeholder="请输入验证码"
      clearable
      size="mini"
      style="width: 300px;"
      v-model="authCode"
      @blur="authCodeActive = false"
      @focus="authCodeActive = true"
      @keydown.enter.native="login"
    >
    </el-input>
    <m-button v-show="timeTrue" h="auto" class="get-code" @click="send">发送验证码</m-button>
    <m-button v-show="!timeTrue" h="auto" class="get-code disable">{{ time }}秒后重发</m-button>
  </div>

  <div
    class="form-input"
    @click="focusInput('newPassword')"
    :class="{active: newPasswordActive}"
    v-if="resetPwdFlag"
  >
    <div class="input-title">
      <icon-box icon-name="safety_small_a" w="10" h="11" box-w="10"></icon-box>
      <span class="primary-color-text">新密码</span>
    </div>
    <el-input
      ref="newPassword"
      placeholder="请输入新密码"
      show-password
      type="password"
      clearable
      size="mini"
      v-model="newPassword"
      @focus="newPasswordActive = true"
      @blur="newPasswordActive = false"
    >
    </el-input>
  </div>

  <div
    class="form-input"
    @click="focusInput('confirmPassword')"
    :class="{active: confirmPasswordActive}"
    v-if="resetPwdFlag"
  >
    <div class="input-title">
      <icon-box icon-name="safety_small_a" w="10" h="11" box-w="10"></icon-box>
      <span class="primary-color-text">再次输入</span>
    </div>
    <el-input
      ref="confirmPassword"
      placeholder="请再次输入新密码"
      clearable
      size="mini"
      show-password
      type="password"
      v-model="confirmPassword"
      @focus="confirmPasswordActive = true"
      @blur="confirmPasswordActive = false"
    >
    </el-input>
  </div>

  <div
    v-if="loginType === passwordLogin && !resetPwdFlag"
    class="flex justify_between"
    style="top: -5px;"
  >
  </div>

  <m-button class="form-btn" v-if="resetPwdFlag" @click="resetPassword" w="100%">重置密码</m-button>
  <m-button class="form-btn" v-if="!resetPwdFlag" :loading="loading" @click="login" w="100%">登录</m-button>
  <div class="mb_10"></div>

  <template v-if="resetPwdFlag">
    <m-button class="form-btn" @click="showPasswordLogin" w="100%" plain>想起密码，返回登录</m-button>
  </template>
  <template v-else>
    <m-button class="form-btn" v-if="loginType === verifyLogin" @click="showPasswordLogin" w="100%" plain>
      账号密码登录
    </m-button>
  </template>

  <div v-show="showErrorText" :class="['form-err', errorTextClassName]"><i
    class="el-icon-warning"></i>{{ errorText }}
  </div>
</div>

<div class="footer-info">
  <span><a href="https://beian.miit.gov.cn" target="_blank">{{ $config.ICP }}</a></span>
</div>
</div>
    </div>
   

    <el-dialog 
      title="选择机构"
      :visible.sync="dialogVisible"
      :modal="true"
      class="calc-dialog"
      @close="close"
    >
      
      <el-form
        class="form-box"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="60"
        label-position="left"
      >
        <el-form-item label=" 请选择登录机构与部门 " prop="organization" class="mt_20">
          <el-cascader v-model="form.organization" separator="" :props="props" :options="organizations" value="id" label="name" style="width: 320px"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dialogVisible = false" w="80px">取 消</m-button>
        <m-button @click="clickOk" style="margin-left: 20px" w="80px">确 定</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import LocalStore from '@/common/utils/LocalStore'

const loginStore = new LocalStore('login')

export default {
  name: 'Login',
  data() {
    let that = this
    return {
      phone: '',
      authCode: '',
      password: '',
      newPassword: '',
      confirmPassword: '',

      phoneActive: false,
      authCodeActive: false,
      passwordActive: false,
      newPasswordActive: false,
      confirmPasswordActive: false,

      remember: false, // 记住密码
      errorText: '',
      timeTrue: true,
      time: 0,
      loginType: 0,
      resetPwdFlag: false,

      users: [],

      loading: false,
      showErrorText: false,
      errorTextClassName: '',

      dialogVisible: false,

      form: {
        organization: '',
      },

      props: {
        lazy: true,
        lazyLoad (node, resolve) {
            that.getDepartments(node.value, resolve)
        }
      },

      rules: {
        organization: [
          { required: true, message: '请选择登录机构与部门', trigger: 'change' }
        ],
      },

      organizations: [],
      departments: [],

      userInfo: {},  // 暂存一下userid
    }
  },
  watch: {
    errorText(n) {
      this.showErrorText = this.errorText !== ''
    },
    // 'form.organization'(n) {
    //   this.form.department = ''
    //   if (n) {
    //     this.getDepartments()
    //   } else {
    //     this.departments = []
    //   }
    // }
  },
  mounted() {
    this.loading = false
    this.loginType = this.$enum.LOGIN_TYPE.PASSWORD
    this.remember = loginStore.get('remember') || false
    this.users = loginStore.get('users') || []
    this.complementAccounts()
    this.setUnreadCount(0)
  },
  methods: {
    ...mapActions({
      setToken: 'user/setToken',
      setUserInfo: 'user/setUserInfo',
      resetCommonState: 'common/resetState',
      setUnreadCount: 'im/setUnreadCount'
    }),
    close() {
      this.organizations = []
      this.departments = []
      this.form.organization = ''
    },
    fetchUserList(str, cb) {
      if (this.resetPwdFlag) {
        cb([])
        return
      }
      if (this.loginType === this.passwordLogin || this.loginType === this.verifyLogin) {
        cb(this.users)
      } else {
        cb([])
      }
    },
    userItemSelect(item) {
      this.phone = item.username
      this.password = this.decode(item.password)
    },
    removeUserItem(event, username) {
      event && event.stopPropagation()
      const index = this.users.findIndex(u => u.username === username)
      if (index !== -1) this.users.splice(index, 1)
      loginStore.set('users', this.users)
    },
    send() {
      if (!this.checkPhone()) {
        return
      }
      this.countdown()
      if (this.resetPwdFlag) {
        this.$api.user.getPwdCode({
          phone_number: this.phone
        })
          .then(res => {
            this.$message.success(res.data.message)
          })
      } else {
        this.$api.user.getCode({
          username: this.phone
        })
          .then(res => {
            this.$message.success(res.data.message)
          })
      }
    },
    countdown() {
      this.timeTrue = false
      this.time = 60 - 1
      const timer = setInterval(() => {
        this.time--
        if (this.time <= 0) {
          clearInterval(timer)
          this.timeTrue = true
        }
      }, 1000)
    },
    changeClass() {
      this.$nextTick(() => {
        this.errorTextClassName = ''
      })
      setTimeout(() => {
        this.errorTextClassName = 'shake'
      }, 0)
    },
    login() {
      this.changeClass()
      // 账号密码登录
      if (this.loginType === this.passwordLogin) {
        if (this.checkPhone() && this.checkPassword()) {
          this.errorText = ''
          this.loading = true
          this.$api.user.pwdLogin({
            username: this.phone,
            password: this.password
          })
            .then(({ data }) => {
              this.loginSuccess(data)
              this.loading = false
            })
            .catch((err) => {
              this.loading = false
            })
        }
      } else {
        // 手机验证码登录
        if (this.checkPhone() && this.checkAuthCode()) {
          this.errorText = ''
          this.loading = true
          this.$api.user.login({
            username: this.phone,
            otp: this.authCode
          })
            .then(({ data }) => {
              this.loginSuccess(data)
            })
            .catch((err) => {
              this.$message.error(err.detail)
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },
    async loginSuccess(accountInfo) {

      /**
       * 流程：
       * 1. 登录账号，根据环境（营养师还是管理后台）确定登录的用户
       * 2. 保存toke，调用 /api/users/me 获取用户的详细信息、如权限列表、im登录的临时密钥
       * 3. 判断是否需要登录im、保存权限后再进入首页
       */

        // 将要进行登录的角色，一个账号下有多个角色（user）
      let user = {}

      const rd = accountInfo.users.find(item => item.role.id === this.$enum.ROLE.RD)
      const ld = accountInfo.users.find(item => item.role.id === this.$enum.ROLE.LD)
      const admin = accountInfo.users.find(item => item.role.id === this.$enum.ROLE.ADMIN)
      const dr = accountInfo.users.find(item => item.role.id === this.$enum.ROLE.DR)
      const da = accountInfo.users.find(item => item.role.id === this.$enum.ROLE.DA)

      // // 其他角色想登录调试使用下面注释的代码
      // const test = accountInfo.users.find(item => item.role.id === 'test')
      // if (test) {
      //   this.setToken(test.token)
      //   this.resetCommonState()
      //   this.handleRemember()
      //   const userInfo = await this.getMeInfo()
      //   this.setUserInfo(userInfo)
      //   this.$router.push('/home')
      //   return
      // }

      // 管理后台登录，目前管理后台可以由管理员、营养师登录
      if (this.isAdmin) {
        if (admin) {
          user = admin
        } else if (ld) {
          user = ld
        } else if (rd) {
          user = rd
        } else if (dr) {
          user = dr
        } else if (da) {
          user = da
        } else {
          return this.$message.error('只有管理员用户才可以登录')
        }

      } else {
        // 营养师平台登录
        if (admin) {
          user = admin
        } else if (ld) {
          user = ld
        } else if (rd) {
          user = rd
        } else if (dr) {
          user = dr
        } else if (da) {
          user = da
        } else {
          return this.$message.error('只有营养师用户才可以登录')
        }
      }

      this.setToken(user.token)
      this.resetCommonState()
      this.handleRemember()

      const userInfo = await this.getMeInfo()
      if (!userInfo) {
        this.$message.error('获取身份信息发生错误，无法登录')
        return
      }

      // 拦截是否可以登录
      // 账户不能登录
      if (!userInfo.is_active) {
        this.$message.error('账号为禁用状态，暂无法登录，请联系系统管理员。')
        return
      }

      // 机构不能登录
      if (!userInfo.department.org_is_active) {
        this.$message.error('账号所属机构为禁用状态，暂无法登录，请联系系统管理员。')
        return
      }

      // 部门不能登录
      if (!userInfo.department.is_active) {
        this.$message.error('账号所属部门为禁用状态，暂无法登录，请联系系统管理员。')
        return
      }

      // 拦截是否认证 医生和医生助理
      if (user == dr) {
        if ("approved" != userInfo.doctor_verify_status) {
          this.$message.error('您的账号还没有通过认证，暂无法登录。')
          return
        }
      }

      // 营养师端，请求机构接口
      if (!this.isAdmin) {

        this.userInfo = userInfo
        let data_permissions_id = this.userInfo.data_permissions.id
        // 所有机构
        // if (data_permissions_id == 'all') {
        //   this.getOrganizations()
        // // 账号所属部门
        // } else if (data_permissions_id == 'org') {
        //   this.dialogVisible = true
        //   this.organizations = [{
        //     id: this.userInfo.department.org_id,
        //     name: this.userInfo.department.org_name,
        //     label: this.userInfo.department.org_name,
        //     value: this.userInfo.department.org_id,
        //   }]
        // // 所属部门
        // } else {
          this.userInfo.selectedOrganization = {
            id: this.userInfo.department.org_id,
            name: this.userInfo.department.org_name,
            label: this.userInfo.department.org_name,
            value: this.userInfo.department.org_id,
          }
          this.userInfo.selectedDepartment = {
            id: this.userInfo.department.id,
            name: this.userInfo.department.name,
            label: this.userInfo.department.name,
            value: this.userInfo.department.id,
          }
          this.setUserInfo(this.userInfo)
          // 进入首页
          this.$router.push('/home')
        // }

      } else {
        this.setUserInfo(userInfo)
        // 进入首页
        this.$router.push('/home')
      }
    },
    getOrganizations() {
      this.$api.organizationManage.getList({
        page: 1,
        page_size: 9999,
        ordering: 'id',
      })
        .then((res) => {
          this.dialogVisible = true
          this.organizations = res.data.results.map(element => {
            return {
              ...element,
              label: element.name,
              value: element.id
            }
          });
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getDepartments(organization, resolve) {
      this.$api.departmentManage.getList({
        page: 1,
        page_size: 9999,
        ordering: 'id',
        organization: organization
      })
        .then((res) => {
          this.departments = res.data.results.map(element => {
            return {
              ...element,
              label: element.name,
              value: element.id,
              leaf: 'leaf'
            }
          })
          resolve(this.departments)
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    clickOk() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.organization.length == 2) {
            const organization = this.organizations.find(ele => ele.id == this.form.organization[0])
            const department = this.departments.find(ele => ele.id == this.form.organization[1])
            if (organization) {
              this.userInfo.selectedOrganization = organization
            }
            if (department) {
              this.userInfo.selectedDepartment = department
            }
            this.setUserInfo(this.userInfo)
            // 进入首页
            this.$router.push('/home')
          } else {
            this.$message.error('请选择登录机构与部门')
          }
        } else {
          return false
        }
      })
    },
    loginTim(userID, userSig) {
      const user = {
        userID: userID,
        userSig: userSig,
      }
      this.$tim.login(user)
        .then(({ data }) => {
          console.log('tim：登录成功')
        })
        .catch((err) => {
          this.$message.error('身份信息有误，登录聊天频道失败')
        })
    },
    getMeInfo() {
      return new Promise((resolve, reject) => {
        this.$api.user.info()
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            resolve(null)
          })
      })
    },
    handleRemember() {
      const usersCache = loginStore.get('users')
      if (this.loginType === this.passwordLogin && this.remember) {
        const encode = this.encode(this.password)
        if (usersCache && usersCache.length !== 0) {
          // 更新密码
          const index = usersCache.findIndex(item => item.username === this.phone)
          if (index !== -1) {
            usersCache[index].password = encode
            loginStore.set('users', usersCache)
          } else {
            loginStore.set('users', [{ username: this.phone, password: encode }, ...usersCache])
          }
        } else {
          // 新增用户密码
          loginStore.set('users', [{ username: this.phone, password: encode }])
        }

        if (usersCache) {
          const userIndex = usersCache.findIndex(item => item.username === this.phone)
          if (userIndex !== -1) {
            const user = usersCache[userIndex]
            usersCache.splice(userIndex, 1)
            // 将最新登录的账号放到第一位
            loginStore.set('users', [user, ...usersCache])
          }
        } else {
          loginStore.set('users', [{ username: this.phone, password: encode }])
        }
      }

    },
    complementAccounts() {
      const usersCache = loginStore.get('users')
      if (usersCache && usersCache.length !== 0) {
        const username = usersCache[0].username
        const password = this.decode(usersCache[0].password)
        this.phone = username
        this.password = password
      }
    },
    focusInput(refName) {
      if (this.$refs[refName]) this.$refs[refName].focus()
      for (const ref in this.$refs) {
        this[ref + 'Active'] = refName === ref
      }
    },
    checkPhone() {
      if (this.phone === '') {
        this.focusInput('phone')
        this.errorText = '用户名称不能为空'
        return false
      }
      return true
    },
    checkPassword() {
      if (this.password === '') {
        this.focusInput('password')
        this.errorText = '密码不能为空'
        return false
      }
      return true
    },
    checkResetPassword() {
      if (this.newPassword === '') {
        this.focusInput('newPassword')
        this.errorText = '密码不能为空'
        return false
      }
      if (this.confirmPassword === '') {
        this.focusInput('confirmPassword')
        this.errorText = '密码不能为空'
        return false
      }
      if (this.newPassword !== this.confirmPassword) {
        this.focusInput('confirmPassword')
        this.errorText = '两次输入密码不一致，请重新输入'
        return false
      }
      return true
    },
    checkAuthCode() {
      if (this.authCode === '') {
        this.errorText = '请输入验证码'
        this.focusInput('authCode')
        return false
      }
      if (!this.$valid.authCode(this.authCode)) {
        this.errorText = '验证码格式不正确，请重新输入'
        return false
      }
      return true
    },
    rememberChange(val) {
      loginStore.set('remember', val)
    },
    resetPassword() {
      if (this.checkAuthCode() && this.checkPhone() && this.checkResetPassword()) {
        this.$api.user.resetPassword({
          phone_number: this.phone,
          new_password: this.confirmPassword,
          otp: this.authCode
        })
          .then(({ data }) => {
            this.$message.success(data.message)
            this.password = ''
            this.removeUserItem(null, this.phone)
            this.showPasswordLogin()
          })
          .catch((err) => {
            this.$message.error(err.detail)
          })
      }
    },
    showResetPassword() {
      this.resetPwdFlag = true
      this.timeTrue = true
      this.errorText = ''
      this.authCode = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    showPasswordLogin() {
      this.resetPwdFlag = false
      this.loginType = this.passwordLogin
    },
    showVerifyLogin() {
      this.resetPwdFlag = false
      this.loginType = this.verifyLogin
    },
    encode(string) {
      const secret = this.binaryBtoa(this.binaryBtoa(navigator.userAgent))
      return this.binaryBtoa(this.binaryBtoa(string)) + secret
    },
    decode(string) {
      try {
        const secret = this.binaryBtoa(this.binaryBtoa(navigator.userAgent))
        const pwd = string.split(secret)[0]
        return this.binaryAtob(this.binaryAtob(pwd))
      } catch (e) {
        return ''
      }
    },
    binaryBtoa(string) {
      const codeUnits = new Uint16Array(string.length)
      for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i)
      }
      const charCodes = new Uint8Array(codeUnits.buffer)
      let result = ''
      for (let i = 0; i < charCodes.byteLength; i++) {
        result += String.fromCharCode(charCodes[i])
      }

      return btoa(result)
    },
    binaryAtob(string) {
      const binary = atob(string)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const charCodes = new Uint16Array(bytes.buffer)
      let result = ''
      for (let i = 0; i < charCodes.length; i++) {
        result += String.fromCharCode(charCodes[i])
      }
      return result
    },
  }, // methods end
  computed: {
    passwordLogin() {
      return this.$enum.LOGIN_TYPE.PASSWORD
    },
    verifyLogin() {
      return this.$enum.LOGIN_TYPE.VERIFY_CODE
    },
    phoneRef() {
      return this.$refs.phone
    },
    passwordRef() {
      return this.$refs.password
    },
    authCodeRef() {
      return this.$refs.authCode
    },
    newPasswordRef() {
      return this.$refs.newPassword
    },
    confirmPasswordRef() {
      return this.$refs.confirmPassword
    },
    isAdmin() {
      return this.$router.currentRoute.meta.isAdmin
    },
    userID() {
      return this.userInfo.im_profile.im_user_id
    },
    userSig() {
      return this.userInfo.im_profile.user_sign
    },
  },
}
</script>

<style scoped lang="less">
.login-wrapper {
  height: 100%;
  background: #FFFFFF;
  display: flex;
  align-items: center;

  .login-background{
      width: 100%;
      height: 180px;
      background-color: #1abc9c;

  .login-container {
    width: 1440px;
    margin: 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    background: #ffffff;
    left: 420px;

    .logo {
      position: absolute;
      margin-top: 20px;
      margin-left: 20px;
      height: 42px;
      display: flex;
      align-items: center;

      img {
        width: 35px;
        height: 42px;
        user-select: none;
        -webkit-user-drag: none;
      }

      .logo-title {
        margin-left: 14px;
        font-weight: bold;
        color: #fff;
        font-size: 18px;
      }
    }

    .system-title {
      position: absolute;
      left: 94px;
      top: 20%;
      width: 357px;
      height: 153px;

      img {
        width: 490px;
        height: 136px;
        user-select: none;
        -webkit-user-drag: none;
      }
    }

    .illustration {
      position: absolute;
      left: 72px;
      bottom: -24px;
      width: 620px;
      height: 623px;

      img {
        width: 658px;
        height: 696px;
        user-select: none;
        -webkit-user-drag: none;
      }
    }

    .login-form {
      box-sizing: border-box;
      position: absolute;
      width: 554px;
      height: 580px;
      background: #FFFFFF;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.04);
      border: 1px solid #E9EDF0;
      // right: 500px;
      padding: 101px 86px 0 86px;

      .login-title {
        margin-top: 9px;
        margin-bottom: 24px;
        height: 30px;
        line-height: 30px;
        font-size: 22px;
        font-weight: 600;
        color: #2F2F3F;
      }
    }
  }
  }
  


  .form-input {
    position: relative;
    width: 412px;
    height: 91px;
    background: #FFFFFF;
    margin-bottom: 10px;
    border-radius: 6px;
    border: 1px solid #E9EDF0;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.0400);

    &:focus {
      border: 1px solid @primaryColor;
    }

    .input-title {
      height: 20px;
      line-height: 20px;
      margin-top: 20px;
      font-size: 12px;
      color: #5A6D86;

      :deep(.icon-container) {
        justify-content: left;
        margin-left: 20px;
        margin-right: 5px;
      }
    }

    .el-input, .el-autocomplete {
      margin-top: 10px;

      :deep(.el-input__inner) {
        border: none;
        height: 24px;
        line-height: 24px;


      }
    }

    :deep(.el-input__suffix) {
      .el-input__suffix-inner {
        .el-input__icon {
          line-height: 18px !important;
        }
      }
    }

    .el-autocomplete {
      width: 100%;
    }

    .get-code {
      width: 92px;
      position: absolute;
      right: 20px;
      bottom: 13px;
      height: 30px !important;
      line-height: 30px !important;
      padding: 0 10px;
      border-radius: 6px !important;
      font-size: 14px;
    }
  }
}


.login-btn {
  width: 100%;
  margin-top: 37px;
}

.active {
  border-color: @primaryColor;
}

.el-button + .el-button {
  margin-left: 0;
}

.form-err {
  position: relative;
  top: 20px;
  color: red;
  font-size: 14px;
  line-height: 1;
  padding-top: 4px;
  text-align: right;
}

.m0 {
  margin: 0;
}

.disable {
  background-color: #c8c9cc !important;

  &:hover, &:focus {
    background-color: #c8c9cc !important;
  }
}

.reset-pwd-form-box {
  height: 771px !important;
  padding-top: 81px !important;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shake {
  animation-name: shake;
  animation-duration: 0.5s;
}

@keyframes shake {
  10% {
    transform: translateY(1.5px);
  }
  20% {
    transform: translateY(-1.5px);
  }
  30% {
    transform: translateY(1.5px);
  }
  40% {
    transform: translateY(-1.5px);
  }
  50% {
    transform: translateY(1.5px);
  }
  60% {
    transform: translateY(-1.5px);
  }
  70% {
    transform: translateY(1.5px);
  }
  80% {
    transform: translateY(-1.5px);
  }
  90% {
    transform: translateY(1.5px);
  }
  100% {
    transform: translateY(0);
  }
}

.footer-info {
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;
  color: #fff;
  line-height: 0;

  a {
    color: #fff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.form-btn {
  height: 46px !important;
  line-height: 46px !important;
  padding: 0;
  font-size: 18px;
}

.mb_10 {
  margin-bottom: 10px;
}

.fontsize_14 {
  font-size: 14px;
}

.calc-dialog {
  :deep(.el-dialog) {
    width: 520px;
    height: 330px;

    .el-dialog__body {
      .el-transfer {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
