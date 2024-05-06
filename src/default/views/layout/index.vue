<template>
  <div class="layout">
    <el-container class="main-container">
      <el-header class="main-header">
        <div class="header-logo">
          <router-link to="">
            <icon-box icon-name="logo" folder="logo" w="40" h="40" box-w="40" box-h="40"></icon-box>
            <span class="title">{{ $config.SORT_TITLE }}</span>
          </router-link>
        </div>

        <div class="header-user">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-tag style="background-color: #00a29a; color: #fff !important">
                {{ userName }}
              </el-tag>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="changeInfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="header-role">
          <el-tag style="height: 31px">
            <icon-box icon-name="doctor" w="14" h="16" box-h="28" style="margin: 0 5px 0 5px"></icon-box>
            <template v-if="userInfo">
              <span class="role-name">{{ userInfo.role && userInfo.role.name }}</span>
            </template>
            <!--            <icon-box icon-name="qiehuan" w="25" h="25" box-h="31" style="margin-left:5px; float: right!important;"></icon-box>-->
          </el-tag>
        </div>

        <div class="header-user">
          <el-tag style="height: 31px">
            {{ userInfo && userInfo.department ? userInfo.department.org_name : '' }}
          </el-tag>
        </div>

        <div class="header-user" style="position: relative">
          <span class="el-dropdown-link">
            <el-tag>
              {{ selectedDep }}
              <i v-if="canSelected" class="el-icon-arrow-down el-icon--right"></i>
            </el-tag>
          </span>
          <el-form v-if="canSelected" class="form-box" :model="form" ref="form" label-width="0">
            <el-form-item>
              <el-cascader @change="change" @visible-change="blur" v-model="form.organization" separator="" :props="props" :options="organizations"></el-cascader>
            </el-form-item>
          </el-form>
        </div>

        <div class="header-notice">
          <el-tag style="height: 31px" @click="noticeClick">
            <icon-box icon-name="tongzhi" w="13" h="16" box-w="13" box-h="28"></icon-box>
            <el-badge :is-dot="unreadCount > 0" class="notice-num">{{ unreadCount }}</el-badge>
          </el-tag>
        </div>

        <div class="header-role header-download" @click="showDownLoadApp = true">
          <el-tag style="height: 31px">
            <template v-if="userInfo">
              <span class="role-name">下载APP</span>
            </template>
          </el-tag>
        </div>
      </el-header>
      <el-container class="main-body">
        <el-aside class="main-aside">
          <main-aside :menus="menus" :default-openeds="[]"></main-aside>
        </el-aside>
        <el-main class="main-content" id="layout-content">
          <keep-alive include="IM">
            <router-view v-if="isRefresh" />
          </keep-alive>
          <!--          <div class="footer-info">-->
          <!--            <span><a href="https://beian.miit.gov.cn" target="_blank">{{ $config.ICP }}</a></span>-->
          <!--          </div>-->
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="下载APP" :visible.sync="showDownLoadApp" width="30%" class="download-dialog">
      <div style="display: flex; flex-direction: column; align-items: center">
        <img style="width: 60%" src="@/common/assets/icons/download_app.png" />
        <span style="margin-bottom: 20px">扫描二维码下载APP</span>
        <m-button h="40px" w="150px" @click="download()">下载二维码</m-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MainAside from '@/common/components/MainAside'
import menus from './menus'
import WaterMark from '@/common/utils/waterMark'

export default {
  name: 'Layout',
  provide() {
    //注入重新加载组件方法（子页面可以通过inject属性接收）
    return {
      reload: this.reload,
    }
  },
  data() {
    let that = this
    return {
      defaultActive: '',
      organizations: [],
      departments: [],
      form: {
        organization: [],
      },
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.level == 1) {
            that.getDepartments(node.value, resolve)
          }
        },
      },
      isRefresh: true,
      waterMark: null,
      showDownLoadApp: false,
    }
  },
  watch: {
    $route(val) {
      this.defaultActive = val.path
    },
  },
  components: {
    MainAside,
  },
  created() {
    if (!this.userInfo || !this.token) {
      this.$router.push('/login')
    }
  },
  mounted() {
    // im的权限码
    const imCodename = 'im.view_improfile'
    const permissions = this.userInfo?.permissions
    if (!permissions) return
    const imView = permissions.indexOf(imCodename) > -1

    if (imView) {
      const imProfile = this.userInfo.im_profile
      if (imProfile && imProfile.im_user_id && imProfile.user_sign) {
        this.loginTim(imProfile.im_user_id, imProfile.user_sign)
      } else {
        this.$message.error('缺少登录聊天频道的身份信息，在线聊天功能无法使用')
      }
    }
    this.showMark(this.userInfo.account.phone)
    // this.form.organization = [this.userInfo.selectedOrganization.id, this.userInfo.selectedDepartment.id]
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      setUserInfo: 'user/setUserInfo',
      setAsideIndex: 'common/setAsideIndex',
    }),
    download() {
      let url = '/download_app.png'
      let a = document.createElement('a')
      a.download = '吉享健康'
      //在a标签的超文本链接上拼上当前项的url,后面加上这一字符串才能实现下载功能
      //注意:如果不加此字符串,文件可以实现下载,图片只能实现预览功能
      a.href = url + '?response-content-type=application/octet-stream'
      //手动调用一下a标签的点击事件,实现下载
      a.click()
    },
    // 设置水印
    showMark(txt = '') {
      this.waterMark = new WaterMark({
        watermark_txt: txt, // 水印的内容
        watermark_x: 0, // 水印起始位置x轴坐标
        watermark_y: 0, // 水印起始位置Y轴坐标
        watermark_rows: 0, // 水印行数
        watermark_cols: 0, // 水印列数
        watermark_x_space: 50, // 水印x轴间隔
        watermark_y_space: 50, // 水印y轴间隔
        watermark_width: 150, // 水印宽度
        watermark_height: 80, // 水印长度
        watermark_angle: 315, // 水印倾斜度数
        monitor: false,
        watermark_parent_node: 'layout-content',
      })
    },
    async reload() {
      this.isRefresh = false
      await this.$nextTick()
      this.isRefresh = true
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logoutSys()
          break
        case 'changeInfo':
          this.changeInfoClick()
          break
        case 'changePassword':
          this.changePasswordClick()
          break
      }
    },
    logoutSys() {
      this.$api.logInfoManage
        .create({
          module: '登录',
          description: '退出登录',
          action: '退出登录',
        })
        .then((res) => {
          this.$tim
            .logout()
            .then((res) => {
              console.log('tim：退出登录')
            })
            .catch((err) => {
              // im退出登录错误不进行弹窗提示
              if (err.code === 2024) {
                console.log('tim error: 用户未登录')
              } else {
                console.log('tim error: ', err)
              }
            })
          this.logout()
          this.$router.push('/login')
        })
    },
    loginTim(userID, userSig) {
      const user = {
        userID: userID,
        userSig: userSig,
      }
      this.$tim
        .login(user)
        .then(({ data }) => {
          console.log('tim：登录成功')
        })
        .catch((err) => {
          this.$message.error('身份信息有误，登录聊天频道失败')
        })
    },
    noticeClick() {
      this.$router.push({
        name: 'IM',
      })
      this.setAsideIndex('/im')
    },
    changeInfoClick() {
      this.$router.push({
        name: 'SetInfo',
      })
    },
    changePasswordClick() {
      this.$router.push({
        name: 'SetPwd',
      })
    },
    getOrganizations() {
      this.$api.organizationManage
        .getList({
          page: 1,
          page_size: 9999,
          ordering: 'id',
        })
        .then((res) => {
          this.organizations = res.data.results.map((element) => {
            return {
              ...element,
              label: element.name,
              value: element.id,
            }
          })
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getDepartments(organization, resolve) {
      this.$api.departmentManage
        .getList({
          page: 1,
          page_size: 9999,
          ordering: 'id',
          organization: organization,
        })
        .then((res) => {
          this.departments = res.data.results.map((element) => {
            return {
              ...element,
              label: element.name,
              value: element.id,
              leaf: 'leaf',
            }
          })
          resolve(this.departments)
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    blur(event) {
      if (event) {
        this.organizations = []
        this.departments = []
        this.form.organization = []
        let data_permissions_id = this.userInfo.data_permissions.id
        // 所有机构
        if (data_permissions_id == 'all') {
          this.getOrganizations()
          // 账号所属部门
        } else if (data_permissions_id == 'org') {
          this.dialogVisible = true
          this.organizations = [
            {
              id: this.userInfo.department.org_id,
              name: this.userInfo.department.org_name,
              label: this.userInfo.department.org_name,
              value: this.userInfo.department.org_id,
            },
          ]
        }
      } else {
        // console.log(this.form.organization[0]);
        // if (this.form.organization.length == 2) {
        //   const organization = this.organizations.find(ele => ele.id == this.form.organization[0])
        //   const department = this.departments.find(ele => ele.id == this.form.organization[1])
        //   if (organization) {
        //     this.userInfo.selectedOrganization = organization
        //   }
        //   if (department) {
        //     this.userInfo.selectedDepartment = department
        //   }
        //   this.setUserInfo(this.userInfo)
        //   this.$router.push('/home')
        //   this.setAsideIndex('/project')
        //   this.$router.go(0)
        // }
      }
    },
    change(event) {
      if (event.length == 2) {
        const organization = this.organizations.find((ele) => ele.id == event[0])
        const department = this.departments.find((ele) => ele.id == event[1])
        if (organization) {
          this.userInfo.selectedOrganization = organization
        }
        if (department) {
          this.userInfo.selectedDepartment = department
        }
        this.setUserInfo(this.userInfo)
        this.$router.push('/home')
        this.setAsideIndex('/project')
        // this.reload()
        this.$router.go(0)
      }
    },
  }, // methods end
  computed: {
    ...mapGetters(['userInfo', 'token', 'unreadCount']),
    menus() {
      return menus
    },
    userName() {
      if (this.userInfo) {
        if (this.userInfo.account) {
          if (this.userInfo.account.name && this.userInfo.account.name.length > 0) {
            return this.userInfo.account.name
          } else {
            return this.userInfo.account.username
          }
        }
      }
      return '未命名'
    },
    selectedDep() {
      if (this.userInfo) {
        name = ''
        if (this.userInfo.selectedOrganization) {
          name += this.userInfo.selectedOrganization.name
        }
        if (this.userInfo.selectedDepartment) {
          name += this.userInfo.selectedDepartment.name
        }
        return name
      }
      return '未命名'
    },
    canSelected() {
      if (this.userInfo.data_permissions.id == 'all' || this.userInfo.data_permissions.id == 'org') {
        return true
      }
      return false
    },
  },
}
</script>

<style scoped lang="less">
.layout {
  height: 100vh;
}

.main-container {
  height: 100%;
  background-color: @bgColor;
}

.main-header {
  height: @headerHeight;
  background-color: @bgWhite;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.04);
  z-index: 1;
  padding: 0 15px;

  .header-logo {
    float: left;
    height: @headerHeight;
    user-select: none;

    a {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      cursor: default !important;
      text-decoration: none;

      img {
        width: 87px;
        height: 25px;
      }
    }

    .title {
      margin-left: 5px;
      font-size: 18px;
      font-weight: bold;
      color: #5a607f;
      letter-spacing: 4px;
    }
  }

  .header-title {
    display: inline-block;
    color: @primaryColor;
    font-size: 18px;
    font-weight: bold;
    line-height: 50px;
    margin-left: 10px;
    user-select: none;
  }

  .header-role {
    height: @headerHeight;
    line-height: @headerHeight;
    float: right;

    .role-name {
      height: 31px;
      line-height: 31px;
      font-size: 12px;
      display: inline-block;
      vertical-align: bottom;
    }
  }

  .header-user {
    height: @headerHeight;
    line-height: @headerHeight;
    float: right;
  }

  .header-download {
    .el-tag {
      border: 1px solid #00a29a;
    }
  }

  .header-notice {
    height: @headerHeight;
    line-height: @headerHeight;
    float: right;

    .notice-num {
      user-select: none;
      font-size: 12px;
      margin-left: 5px;
      vertical-align: bottom;

      :deep(.el-badge__content.is-fixed.is-dot) {
        right: -2px;
        top: 4px;
      }
    }
  }

  .el-tag {
    box-sizing: border-box;
    height: 31px;
    line-height: 31px;
    background-color: #ffffff;
    color: @textColor;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 14px;
    margin-left: 16px;
    cursor: pointer;
  }
}

.main-body {
}

.main-aside {
  width: @asideWidth;
  height: calc(100vh - 50px);
  overflow-y: auto;
  overflow-x: hidden;

  .el-menu {
    padding-top: 32px;
    padding-bottom: 32px;
    background-color: @bgColor;
  }
}

.main-content {
  padding: 0;
}

.footer-info {
  width: calc(100% - 250px);
  position: absolute;
  bottom: 0;
  font-size: 12px;
  text-align: center;
  a {
    display: block;
    line-height: 32px;
    color: #ccc;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
.form-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.download-dialog {
  :deep(.el-dialog) {
    height: 420px;
  }
}
</style>
