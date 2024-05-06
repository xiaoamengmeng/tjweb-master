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
              <el-tag>
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
        <div class="header-role header-download" @click="showDownLoadApp = true">
          <el-tag style="height: 31px">
            <template v-if="userInfo">
              <span class="role-name">下载APP</span>
            </template>
          </el-tag>
        </div>
        <!--        <div class="header-notice">-->
        <!--          <el-tag style="height: 31px;">-->
        <!--            <icon-box icon-name="tongzhi" w="13" h="16" box-w="13" box-h="28"></icon-box>-->
        <!--            <span class="notice-num">32</span>-->
        <!--          </el-tag>-->
        <!--        </div>-->
      </el-header>
      <el-container class="main-body">
        <el-aside class="main-aside">
          <main-aside :menus="menus" :default-openeds="[]"></main-aside>
        </el-aside>
        <el-main class="main-content" id="layout-content">
          <!--<keep-alive>-->
          <router-view />
          <!--</keep-alive>-->
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
  data() {
    return {
      defaultActive: '',
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
    this.$api.user.info().then((res) => {
      this.setUserInfo(res.data)
      this.showMark(res.data.account.phone)
    })
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      setUserInfo: 'user/setUserInfo',
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
          this.logout()
          this.$router.push('/login')
        })
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
  }, // methods end
  computed: {
    ...mapGetters(['userInfo', 'token']),
    userID() {
      return this.userInfo.im_profile.im_user_id
    },
    userSig() {
      return this.userInfo.im_profile.user_sign
    },
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

  .header-download {
    .el-tag {
      border: 1px solid #00a29a;
    }
  }

  .header-user {
    height: @headerHeight;
    line-height: @headerHeight;
    float: right;
  }

  .header-notice {
    height: @headerHeight;
    line-height: @headerHeight;
    float: right;

    .notice-num {
      font-size: 12px;
      margin-left: 5px;
      vertical-align: bottom;
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

.download-dialog {
  :deep(.el-dialog) {
    height: 420px;
  }
}
</style>
