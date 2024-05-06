<template>
  <lemon-message-basic
    class="lemon-message-custom" v-on="$listeners" v-bind="$attrs"
  >
    <div slot="custom" v-if="renderDom.type === 'scale'||renderDom.type === 'kcard'||renderDom.type === 'plan'||renderDom.type === 'health'"
         class="custom-card" @click="onClick">
      <div class="mass-head" v-if="massMessage">
				<span>
					{{ $Day(msg.created_at).fromNow() }}
				</span>
        <span :title="showReceiversName(msg.receivers)">
					{{ showReceiversName(msg.receivers) }}
				</span>
      </div>
      <div class="custom-card-content" :class="renderDom.type">
        <img class="bg" :src="require(`@/common/assets/bg/${renderDom.type}_bg.png`)" style="width:70px;height:70px;"/>
        <el-image ref="kcardImage" v-show="false" :src="previewImageSrc" :preview-src-list="[previewImageSrc]"></el-image>
        <div class="custom-card-content-title">{{ renderDom.title }}</div>
        <div class="custom-card-content-description">{{ renderDom.summary }}</div>
      </div>
      <div class="custom-card-bottom">
        <m-button v-if="massMessage" type="default" h="38px" @click.stop="againSend" style="margin-right: auto;">
          再发一条
        </m-button>
        <icon-box :icon-name="renderDom.type" h="14" w="14"></icon-box>
        <span class="type-name">{{ renderDom.name }}</span>
      </div>
    </div>
    <!--  科普知识  -->
    <div slot="custom" v-if="!massMessage && renderDom.type === 'post'" class="waterfall-item" @click="onClick">
      <div class="thumb-wrap" v-if="renderDom.videoCover">
        <el-image :src="renderDom.videoCover" fit="cover"></el-image>
        <div class="video-duration" v-if="renderDom.videoDuration>0">
          <i class="el-icon-caret-right"></i>
          <span style="margin-left:4px;">{{ formatSeconds(renderDom.videoDuration) }}</span>
        </div>
      </div>
      <div class="content">
        <div class="title">{{ renderDom.title }}</div>
        <div class="bottom">
          <div class="name">
            <lemon-avatar :src="renderDom.authorName!=''?'':renderDom.authorAvatar" :size="18"></lemon-avatar>
            <span style="margin-left:5px;">{{ renderDom.authorName }}</span>
          </div>
          <div class="type">
            <icon-box :icon-name="renderDom.videoDuration>0?'video':'article'" h="14" w="14"
                      :title="renderDom.name"></icon-box>
            <span class="type-name">{{ renderDom.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--  科普知识  -->

    <!--  群发时展示的科普知识  -->
    <div slot="custom" v-if="massMessage && renderDom.type === 'post'"
         class="custom-card" @click="onClick"
    >
      <div class="mass-head">
          <span>
            {{ $Day(msg.created_at).fromNow() }}
          </span>
        <span :title="showReceiversName(msg.receivers)">
            {{ showReceiversName(msg.receivers) }}
          </span>
      </div>
      <div class="custom-card-content post-card">
        <div class="custom-card-content-title">{{ renderDom.title }}</div>
      </div>
      <div class="custom-card-bottom">
        <m-button v-if="massMessage" type="default" h="38px" @click.stop="againSend" style="margin-right: auto;">
          再发一条
        </m-button>
        <icon-box :icon-name="renderDom.videoDuration>0?'video':'article'" h="14" w="14"
                  :title="renderDom.name"></icon-box>
        <span class="type-name">{{ renderDom.videoDuration>0?'科普视频':'科普文章' }}</span>
      </div>
    </div>
    <!--  科普知识  -->

    <!-- 显示群发时的图片 -->
    <div slot="custom" v-if="massMessage && renderDom.type === 'image'"
         class="custom-card" @click="onClick"
    >
      <div class="mass-head">
          <span>
            {{ $Day(msg.created_at).fromNow() }}
          </span>
        <span :title="showReceiversName(msg.receivers)">
            {{ showReceiversName(msg.receivers) }}
          </span>
      </div>
      <div class="custom-card-content image-card">
        <!-- <image class="bg" :src="`${cdn}/static/images/notification/${renderDom.name}_bg.png`" mode="aspectFill" style="width:70px;height:70px;"></image> -->
        <div class="custom-card-content-title">{{ '图片' }}</div>
        <div class="custom-card-content-description">{{ renderDom.summary }}</div>
      </div>
      <div class="custom-card-bottom">
        <m-button v-if="massMessage" type="default" h="38px" @click.stop="againSend" style="margin-right: auto;">
          再发一条
        </m-button>
        <i class="lemon-icon-image"></i>
        <span class="type-name">{{ renderDom.name }}</span>
      </div>
    </div>
    <!-- 显示群发时的文本 -->
    <div slot="custom" v-if="massMessage && $attrs.message.massType == 'text'"
         class="custom-card" @click="onClick"
    >
      <div class="mass-head">
          <span>
            {{ $Day(msg.created_at).fromNow() }}
          </span>
        <span :title="showReceiversName(msg.receivers)">
            {{ showReceiversName(msg.receivers) }}
          </span>
      </div>
      <div class="custom-card-content text-card">
        <div class="custom-card-content-description">{{ msg.text_message }}</div>
      </div>
      <div class="custom-card-bottom">
        <m-button v-if="massMessage" type="default" h="38px" @click.stop="againSend" style="margin-right: auto;">
          再发一条
        </m-button>
        <span class="type-name">{{ '文字' }}</span>
      </div>
    </div>
    <div slot="custom" v-if="!massMessage && renderDom.type === 'image'"
         class="lemon-message-image" @click="onClick"
    >
      <el-image
        :src="renderDom.imageUrl"
        style="width: auto; height: 100px;"
        fit="cover"
        :preview-src-list="[renderDom.imageUrl]"
      ></el-image>
    </div>
  </lemon-message-basic>
</template>
<script>
export default {
  name: "lemonMessageCustom",
  inheritAttrs: false,
  inject: ["IMUI"],
  data() {
    return {
      renderDom: {},
      massMessage: false, // 是否为群发消息
      msg: {},
      previewImageSrc: '',
    }
  },
  mounted() {
    // console.log(this.$attrs.message.tim)
    this.renderDom = this.parseCustom(this.$attrs.message.tim)
    this.massMessage = this.$attrs.message.massMessage
    this.msg = this.$attrs.message.msg
  },
  methods: {
    parseCustom(message) {
      // // 约定自定义消息的 data 字段作为区分，不解析的不进行展示
      if (this.isJSON(message.payload.data)) {
        const extension = JSON.parse(message.payload.data);
        let type = ''
        let name = ''
        switch (extension.category) {
          case 1:
            type = 'image'
            name = '图片'
            break
          case 2://量表
            type = 'scale'
            name = '量表'
            break;
          case 3://方案
            type = 'plan'
            name = '方案'
            break;
          case 4://知识卡
            type = 'kcard'
            name = '知识卡'
            break;
          case 5://科普
            type = 'post'
            name = '科普'
            break;
          case 6://科普
            type = 'health'
            name = '健康评估'
            break;
          default:
            type = 'text'
            break;
        }
        const renderDom = {
          type: type,
          id: extension.id,
          name: name,
          title: extension.title || '',
          imageUrl: extension.url || '',
          summary: extension.summary || '',
          videoDuration: extension.videoDuration, // 视频时长(秒)
          videoCover: extension.videoCover, // 视频封面
          authorAvatar: extension.authorAvatar, // 科普作者头像
          authorName: extension.authorName, // 科普作者
        }
        return renderDom
      } else {
        return {
          type: 'notSupport',
          text: '[自定义消息]'
        }

      }
    },
    onClick() {
      if (this.massMessage) {
        return
      }
      let cardItem = this.renderDom

      switch (cardItem.type) {
        case 'scale'://量表
          this.$router.push({
            path: '/scale_manage/scale-detail',
            query: { formId: cardItem.id }
          })
          break;
        case 'plan'://方案
          this.$api.ppIntervs.getDetail(cardItem.id).then(res=>{
              let ppInfo = res.data
              let params = {
                type:'edit',  //固定传edit
                ppid:ppInfo.project_patient.id,  //project_patient的id
                intervsId:cardItem.id, //方案id
                projectId:ppInfo.project_patient.project.id,  //患者项目id
                stage:ppInfo.stage,  //患者项目阶段
                userId:ppInfo.project_patient.patient_id  //患者id
            }
            this.$router.push({
              name: 'PatientSetSolution',
              params: params
            })
          }).catch(err=>{
            console.error(err)
            this.$message.error('无法打开此方案')
          })
          break;
        case 'kcard'://知识卡
          this.$api.kcard.getDetail(cardItem.id).then(res => {
            this.previewImageSrc = res.data.image
            this.$refs.kcardImage.showViewer = true
          })
          break;
        case 'post'://科普
          if (cardItem.videoDuration > 0) {
            this.$router.push({
              name: 'SetVideo',
              params: {
                type: 'video',
                id: cardItem.id
              }
            })
          } else {
            this.$router.push({
              name: 'SetArticle',
              params: {
                type: 'article',
                id: cardItem.id
              }
            })
          }
          break;
        default:
          break;
      }
    },
    // 简单判断是否是JSON字符串
    isJSON(str) {
      if (typeof str == 'string') {
        try {
          JSON.parse(str);
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
    },
    formatSeconds(endTime) {
      let secondTime = parseInt(endTime)//将传入的秒的值转化为Number
      let min = 0// 初始化分
      let h = 0// 初始化小时
      let result = ''
      if (secondTime >= 60) {//如果秒数大于等于60，将秒数转换成整数
        min = parseInt(secondTime / 60)//获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60)//获取秒数，秒数取佘，得到整数秒数
        if (min >= 60) {//如果分钟大于等于60，将分钟转换成小时
          h = parseInt(min / 60)//获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      if (h > 0)
        result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
      else
        result = `${min.toString().padStart(2, '0')}:${secondTime.toString().padStart(2, '0')}`
      return result
    },
    _emitClick(e, key) {
      this.IMUI.$emit("message-click", e, key, this.message, this.IMUI);
    },
    showReceiversName(arr) {
      if (!arr || arr.length === 0) {
        return ''
      }
      const names = arr.map(item => item.name)
      let text = ''
      let last = arr.length - 1
      if (names.length > 3) {
        names.slice(0, 3).forEach((item, index) => {
          if (index === last) {
            text += item
          } else {
            text += item + '、'
          }
        })
        return `${text}等${names.length}人`
      } else {
        names.forEach((item, index) => {
          if (index === last) {
            text += item
          } else {
            text += item + '、'
          }
        })
        return `${text}共${names.length}人`
      }
    },
    // 再发一条
    againSend() {
      this.IMUI.$emit("message-click", this.msg)
    },
  }
};
</script>
<style lang="less" scoped>
.custom-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  width: 300px;

  &:active, &:focus {
    filter: brightness(0.8);
  }

  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 8%);
}

.custom-card-content {
  min-height: 53px;
  padding: 10px;
  position: relative;

  .bg {
    position: absolute;
    top: 13px;
    right: 10px;
  }
}

.custom-card-content-title {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  line-height: 26px;
}

.custom-card-content-description {
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  min-height: 30px;
  white-space: pre-wrap;
}

.custom-card-bottom {
  height: 32px;
  background: #fff;
  font-size: 14px;
  text-align: right;
  padding: 8px;
  color: #666;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.type-name {
  margin-left: 5px;
}

.tooltip-btns {
  display: flex;
  align-items: center;
}

.scale {
  background-image: linear-gradient(to right, #305CF6, #20B9F8);
}

.kcard {
  background-image: linear-gradient(to right, #30D09E, #24C5B6);
}


.health {
  background-image: linear-gradient(to right, #30D09E, #24C5B6);
}

.plan {
  background-image: linear-gradient(to right, #F67738, #FF6E88);
}

.image-card {
  background-image: linear-gradient(to right, #c0c5c8, #e2ebf0);
}

.text-card {
  background-image: linear-gradient(to right, #99756f, #c5aba5);
}

.post-card {
  background-image: linear-gradient(to right, #ffaa70, #f3d165);
}

.waterfall-item {
  width: 300px;
  background-color: #fff;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 8%);

  &:active, &:focus {
    filter: brightness(0.8);
  }

  .thumb-wrap {
    position: relative;

    image {
      display: block;
      width: 100%;
      // 默认设置一个图片的大约值
      height: 175px;
    }

    .el-image {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .video-duration {
      display: flex;
      color: #fff;
      position: absolute;
      bottom: 10px;
      right: 6px;
      font-size: 12px;
      padding: 2px 4px;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      align-items: center;
    }
  }

  .title {
    color: #333;
  }

  .content {
    // margin-top: 16rpx;
    padding: 8px;

    .title {
      font-size: 18px;
      color: #666;
      line-height: 26px;
    }

    .bottom {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
      display: flex;

      .view-times {
        color: #666;
        float: right;
        margin-right: 6px;
        font-size: 12px;
        display: flex;
      }

      .name {
        display: flex;
        font-size: 12px;
        color: #666;
      }

      .type {
        margin-left: auto;
        color: #666;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
    }
  }
}

.custom-message {
  display: flex;
  padding: 5px 12px;
  background-color: #fff;
  border-radius: 2px 10px 10px 10px;
  border: 1px solid #D9D9D9;
}

.my-custom {
  border-radius: 10px 2px 10px 10px;
  border: 1px solid rgba(0, 110, 255, 0.30);
}

.custom-content-title {
  width: 140px;
  line-height: 17px;
  font-size: 12px;
  color: #000000;
  letter-spacing: 0;
  margin-bottom: 6px;
}

.custom-content-description {
  width: 140px;
  line-height: 17px;
  font-size: 14px;
  color: #006EFF;
  letter-spacing: 0;
  margin-bottom: 6px;
}

.custom-content-text {
  height: 25px;
  line-height: 25px;
  font-size: 28px;
  letter-spacing: 0;
}

.mass-head {
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  justify-content: space-between;

  span {
    .text-ellipsis();
    min-width: 64px;
  }
}
</style>
<style lang="stylus">
@import '../../styles/utils/index'
+b(lemon-message-custom)
  +b(lemon-message)
    +e(content)
      img
        width 18px
        height 18px
        display inline-block
        background transparent
        position relative
        top -1px
        padding 0 2px
        vertical-align middle
</style>
