<template>
  <div>
    <el-dialog
      title="群发消息"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      class="mass-message-dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-row :gutter="10">
        <el-col :span="10">
          <user-checkbox-group v-model="selectedMembers" class="scroll-wrap">
            <div class="member-wrap">
              <div class="team-wrap">
                <div class="wrap-header">
                  <div class="wrap-title">团队成员</div>
                  <el-checkbox @change="handleTeamSelectAll" v-model="teamSelectAll">全选</el-checkbox>
                </div>
                <div class="input-box">
                  <el-input
                    placeholder="请输入团队成员姓名搜索"
                    v-model="teamKeyword" clearable
                  ></el-input>
                </div>
                <div class="member-list" v-loading="teamMemberLoading">
                  <user-card
                    v-for="(member,index) in calcTeamMembers"
                    showCheckbox
                    :label="member"
                    :userInfo="member"
                    :key="index + 'teamItem'"
                    show-leader
                  ></user-card>
                </div>
              </div>
            </div>
            <div class="user-wrap mt_20">
              <div class="team-wrap">
                <div class="wrap-header">
                  <div class="wrap-title">患者</div>
                  <el-checkbox @change="handleUserSelectAll" v-model="userSelectAll">全选</el-checkbox>
                </div>
                <div class="input-box">
                  <el-input placeholder="请输入患者姓名搜索" v-model="userKeyword" clearable></el-input>
                </div>
                <div class="member-list" v-loading="userMemberLoading">
                  <user-card
                    v-for="(member,index) in calcUserMembers"
                    showCheckbox
                    :label="member"
                    :userInfo="member"
                    :key="index + 'userItem'"
                  ></user-card>
                </div>
              </div>
            </div>
          </user-checkbox-group>
        </el-col>
        <el-col :span="14">
          <div class="selected-wrap user-wrap">
            <div class="patient-wrap">
              <div class="wrap-header mb_10">
                <div class="wrap-title">已选择</div>
                （{{ selectedMembers.length }} / {{ memberCount }}）
                <m-button
                  style="padding: 9px 12px!important; float: right; margin-left: auto; margin-right: 10px;"
                  h="32px"
                  plain
                  @click="handleClearAll"
                >
                  清空
                </m-button>
              </div>
              <div class="select-list">
                <user-card v-for="(member,index) in selectedMembers" showRemove :label="member" :userInfo="member"
                           :key="index" @remove="onRemove">
                </user-card>
              </div>
            </div>
          </div>
          <div class="chat-wrap">
            <lemon-imui
              simple
              :user="user"
              ref="simpleIMUI"
              :contextmenu="contextmenu"
              @pull-messages="handlePullMessages"
              @message-click="handleMessageClick"
              @send="handleSend"
              width="100%"
              avatar-cricle
            >
              <template slot="cover">
                <div>
                  <div class="cover">
                    <i class="lemon-icon-message"></i>
                    <template v-if="historyGroupMessageLoading">
                      <p><b>消息群发</b> IM</p>
                    </template>
                    <template v-else>
                      <p><b>正在加载群发记录...</b></p>
                    </template>
                  </div>
                </div>
              </template>
            </lemon-imui>
          </div>
        </el-col>
      </el-row>
      <!--        <div style="display: inline-block; width: 200px;">-->
      <!--          群名称：-->
      <!--          <el-input v-model="groupName"></el-input>-->
      <!--        </div>-->
      <span slot="footer" class="dialog-footer">
        <m-button type="iron" @click="closeDialog" w="128px">关 闭</m-button>
      </span>
    </el-dialog>


    <el-image-viewer
      v-if="imageViewerVisible"
      :on-close="closeImageViewer"
      :url-list="[this.imageUrl]"
    ></el-image-viewer>
    <el-dialog
      title="发送量表"
      :visible.sync="sendScaleVisible"
      :modal="true"
      width="600px"
      class="send-card-dialog"
    >
      <m-view-table
        ref="sendScaleTable"
        :data="sendScaleData"
        :total="sendScaleTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="sendScalePageSize"
        :current-page.sync="sendScalePage"
        @selection-change="handleSendCustomSelectionChange"
        height="350"
        :get-data-func="getSendScale"
      >
        <el-table-column
          type="selection"
        >
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="类型"
          min-width="160"
        >
          <template><span>量表</span></template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称"
          min-width="160"
        >
        </el-table-column>
      </m-view-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="sendScaleVisible = false" w="128px">取 消</m-button>
        <m-button type="primary" @click="sendCustomHandler(2)" w="128px">发 送</m-button>
      </span>
    </el-dialog>
    <el-dialog
      title="发送方案"
      :visible.sync="sendPlanVisible"
      :modal="true"
      width="650px"
      class="send-card-dialog"
    >
      <m-view-table
        ref="sendPlanTable"
        :data="sendPlanData"
        :total="sendPlanTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="sendPlanPageSize"
        :current-page.sync="sendPlanPage"
        @selection-change="handleSendCustomSelectionChange"
        height="350"
        :get-data-func="getSendPlan"
      >
        <el-table-column
          type="selection"
          width="45"
        >
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="类型"
          width="80"
        >
          <template><span>干预方案</span></template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称"
          min-width="160"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="stage"
          label="场景"
        >
        </el-table-column>
      </m-view-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="sendPlanVisible = false" w="128px">取 消</m-button>
        <m-button type="primary" @click="sendCustomHandler(3)" w="128px">发 送</m-button>
      </span>
    </el-dialog>
    <el-dialog
      title="发送知识卡"
      :visible.sync="sendKCardVisible"
      :modal="true"
      width="700px"
      class="send-card-dialog"
    >
      <m-view-table
        ref="sendKCardTable"
        :data="sendKCardData"
        :total="sendKCardTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="sendKCardPageSize"
        :current-page.sync="sendKCardPage"
        @selection-change="handleSendCustomSelectionChange"
        height="350"
        :get-data-func="getSendKCard"
      >
        <el-table-column
          type="selection"
          width="45"
        >
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="类型"
          width="80"
        >
          <template><span>知识卡</span></template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="名称"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="预览图"
          min-width="80"
          align="center"
        >
          <template v-slot="scope">
            <el-image
              :src="scope.row.image"
              style="width: auto; height: 60px;"
              fit="cover"
              :preview-src-list="[scope.row.image]"
            ></el-image>
          </template>
        </el-table-column>
      </m-view-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="sendKCardVisible = false" w="128px">取 消</m-button>
        <m-button type="primary" @click="sendCustomHandler(4)" w="128px">发 送</m-button>
      </span>
    </el-dialog>
    <el-dialog
      title="发送科普"
      :visible.sync="sendArticleVisible"
      :modal="true"
      width="700px"
      class="send-card-dialog"
    >
      <m-view-table
        ref="sendArticleTable"
        :data="sendArticleData"
        :total="sendArticleTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="sendArticlePageSize"
        :current-page.sync="sendArticlePage"
        @selection-change="handleSendCustomSelectionChange"
        height="350"
        :get-data-func="getSendArticle"
      >
        <el-table-column
          type="selection"
          width="45"
        >
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="content_type"
          label="类型"
          min-width="80"
        >
          <template v-slot="scope">
            <span v-if="scope.row.content_type=='video'">视频</span>
            <span v-else>文章</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="title"
          label="标题"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="author_name"
          label="作者"
        >
        </el-table-column>
      </m-view-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="sendArticleVisible = false" w="128px">取 消</m-button>
        <m-button type="primary" @click="sendCustomHandler(5)" w="128px">发 送</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userCard from './userCard.vue'
import userCheckboxGroup from './userCheckboxGroup.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'MassMessage',
  props: {
    visible: false,
  },
  components: {
    userCard,
    userCheckboxGroup
  },
  inject: ['lemon'],
  data() {
    return {
      groupName: '群聊',
      dialogVisible: false,
      selectedMembers: [],
      members: [],
      teamKeyword: '',
      userKeyword: '',
      teamSelectAll: false,
      userSelectAll: false,
      teamMemberLoading: true,
      userMemberLoading: true,
      teamMemberMe: {},
      user: {
        id: '',
        displayName: '',
        avatar: '',
        userId: '',
      },

      sendCustomSelection: [],
      sendScaleVisible: false,
      sendScaleData: [],
      sendScaleTotal: 0,
      sendScalePageSize: 10,
      sendScalePage: 1,

      sendPlanVisible: false,
      sendPlanData: [],
      sendPlanTotal: 0,
      sendPlanPageSize: 10,
      sendPlanPage: 1,

      sendArticleVisible: false,
      sendArticleData: [],
      sendArticleTotal: 0,
      sendArticlePageSize: 10,
      sendArticlePage: 1,

      sendKCardVisible: false,
      sendKCardData: [],
      sendKCardTotal: 0,
      sendKCardPageSize: 10,
      sendKCardPage: 1,

      imageViewerVisible: false,
      imageUrl: '',

      historyGroupMessageLoading: true,
      contact: {
        id: '',
        displayName: '群发记录',
        avatar: "",
        type: '',
        index: 'T',
        unread: 0,
        lastSendTime: '',
        lastContent: '',
      },
    }
  },
  watch: {
    visible(n) {
      this.dialogVisible = n
      if (n) {
        this.initData()
        this.$nextTick(() => {
          this.initChat()
        })
      } else {
        if (this.chat.currentContactId) {
          this.chat.currentContactId = null
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    initData() {
      this.teamSelectAll = false
      this.userSelectAll = false
      this.user = {
        id: this.userInfo.im_profile.im_user_id,
        userId: this.userInfo.id,
        displayName: this.userInfo.name,
        avatar: this.userInfo.avatar_url,
      }
      this.selectedMembers = []
      this.members = []
      this.dialogVisible = true
      this.teamMemberLoading = true
      this.userMemberLoading = true
      this.historyGroupMessageLoading = true
      this.getTeamsMember()
      this.getUserMember()
      this.$nextTick(() => {
        document.querySelector('.mass-message-dialog .el-dialog__body').scrollTop = 0
      })
    },
    async initChat() {
      this.historyGroupMessageLoading = true
      await this.getMassMessageHistory()
      this.historyGroupMessageLoading = false

      const imUserId = this.user.id
      this.contact.id = imUserId
      const { simpleIMUI } = this.$refs
      simpleIMUI.initContacts([this.contact])
      simpleIMUI.clearMessages(this.contact.id)
      simpleIMUI.initEditorTools(this.imuiTools)
      simpleIMUI.changeContact(imUserId)
    },
    async handlePullMessages(contact, next, instance) {
      const messages = []

      const list = await this.getMassMessageHistory()
      if (!list) {
        next(messages, true)
      }

      console.log(list)

      list.forEach(msg => {
        messages.push(this.messageBuilder(msg))
      })

      next(messages, true)

      this.$nextTick(() => {
        this.chat.messageViewToBottom()
      })
    },
    // 获取群发历史记录
    getMassMessageHistory() {
      return new Promise((resolve, reject) => {
        this.$api.groupSending.getList({
          page: 1,
          page_size: 9999
        })
          .then((res) => {
            resolve(res.data.results)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    handleMessageClick(msg) {
      this.handleClearAll()
      if(!msg || !msg.receivers) return

      msg.receivers.forEach(user => {
        this.selectedMembers.push({
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
          im_user_id: user.im_user_id,
          role_name: user.role_name === '用户' ? '患者' : user.role_name,
        })
      })
    },
    handleSend(message, next, file) {
      switch (message.type) {
        case 'text':
          this.sendText(message, next, file)
          break
        case 'image':
          this.sendImage(message, next, file)
          break
        case 'file':
          this.sendFile(message, next, file)
          break
      }
    },
    async sendText(message, next, file) {

      this.chat.removeMessage(message.id)
      const result = await this.sendMassMessage({
        text_message: message.content,
        extra: {
          data: null
        }
      })

      if (!result) {
        next({ status: 'failed' })
        return
      }

      message.recordId = result.id
      this.chat.appendMessage(this.messageBuilder(result), true)


      // 创建tim文本消息实例
      const textMessageList = this.receiversImId.map(imid => {
        return this.$tim.createTextMessage({
          to: imid,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            text: message.content
          },
        })
      })

      message.timMessages = []
      for (const textMessage of textMessageList) {
        const imResponse = await this.$tim.sendMessage(textMessage)
        if (imResponse) {
          message.timMessages.push(imResponse.data.message)
        }
      }
      next()
    },
    sendImage(message, next, file) {
      this.chat.removeMessage(message.id)

      const fileList = [{
        name: file.name,
        raw: file,
        size: file.size,
      }]
      this.$cos.uploadFile(fileList, (progressData, uploadKey) => {
        this.percentage = progressData.percent * 100
        if (progressData.percent === 1) {
          // 上传成功
        }
      })
        .then((res) => {
          const imageUrl = 'https://' + res.data.Location
          this.sendCustomSelection = [{ url: imageUrl }]
          this.sendCustomHandler(1, message, next)
        })
        .catch((err) => {
          next({ status: 'failed' })
        })
    },
    sendFile(message, next, file) {
    },
    sendMassMessage(data) {
      data.sender_id = this.user.userId
      data.receivers_id = this.receiversId
      return new Promise((resolve, reject) => {
        this.$api.groupSending.create(data)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            resolve(null)
          })
      })
    },
    closeDialog() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    },
    onRemove(member) {
      let index = -1
      index = this.selectedMembers.findIndex(item => item.id === member.id)
      if (index !== -1) {
        this.selectedMembers.splice(index, 1)
      }
    },
    getTeamsMember() {
      this.$api.team.getList({
        member: this.userInfo.id
      })
        .then((res) => {
          let members = []
          const teamList = res.data.results
          teamList.forEach((team) => {
            // 用于显示团队名称
            members.push({
              id: this.$uuid,
              isNotMember: true,
              teamName: team.name,
              avatar_url: team.avatar,
            })
            const leaderId = team?.leader?.id
            team.members.forEach(member => {
              if (member.id === leaderId) {
                member.isLeader = true
              }
              if (member.id === this.user.userId) {
                this.teamMemberMe = member
                member.lock = true
              }
              members.push(member)
            })
          })
          this.members = [...this.members, ...members]
          // 不能选中自己
          // this.selectedMembers.push(this.teamMemberMe)
          this.teamMemberLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.teamMemberLoading = false
          this.$message.error(JSON.stringify(err))
        })
    },
    getUserMember() {
      this.$api.myProjectPatient.getList()
        .then((res) => {
          let members = []
          const userList = res.data.results
          userList.forEach((user) => {
            members.push({
              id: user.patient.user_id,
              name: user.patient.name,
              avatar_url: user.patient.avatar_url,
              stage: user.stage,
              isUser: true,
              im_user_id: user.patient.im_user_id,
            })
          })
          this.members = [...this.members, ...members]
          this.userMemberLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.userMemberLoading = false
          this.$message.error(JSON.stringify(err))
        })
    },
    handleTeamSelectAll(checked) {
      const selectUser = this.selectedMembers.filter(item => item.isUser)
      if (checked) {
        // 多个团队之间存在有相同的成员，去重
        const teamUser = this.unique(this.members.filter(item => !item.isUser && !item.isNotMember && !item.lock), 'id')
        this.selectedMembers = [...teamUser, ...selectUser]
      } else {
        this.selectedMembers = [...selectUser]
      }
    },
    handleUserSelectAll(checked) {
      const selectTeamUser = this.selectedMembers.filter(item => !item.isUser && !item.isNotMember)
      if (checked) {
        this.selectedMembers = [...selectTeamUser, ...this.calcUserMembers]
      } else {
        this.selectedMembers = [...selectTeamUser]
      }
    },
    unique(arr, uniId) {
      const res = new Map()
      return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1))
    },
    handleClearAll() {
      this.teamSelectAll = false
      this.userSelectAll = false
      this.selectedMembers = []
    },
    showImageViewer(url) {
      this.imageUrl = url
      this.imageViewerVisible = true
    },
    closeImageViewer() {
      this.imageViewerVisible = false
    },
    handleSendCustomSelectionChange(val) {
      this.sendCustomSelection = val
    },
    getSendScale() {
      this.$refs.sendScaleTable.loadStart()
      this.$api.scale.getList({
        status: 'published',
        page: this.sendScalePage,
        page_size: this.sendScalePageSize,
        ordering: 'id'
      })
        .then((res) => {
          this.sendScaleTotal = res.data.count
          this.sendScaleData = res.data.results
        })
    },
    getSendPlan() {
      this.$refs.sendPlanTable.loadStart()
      this.$api.ppIntervs.getList({
        page: this.sendPlanPage,
        page_size: this.sendPlanPageSize,
        ordering: 'id'
      })
        .then((res) => {
          this.sendPlanTotal = res.data.count
          this.sendPlanData = res.data.results
        })
    },
    getSendKCard() {
      this.$refs.sendKCardTable.loadStart()
      this.$api.kcard.getList({
        page: this.sendKCardPage,
        page_size: this.sendKCardPageSize,
        ordering: 'id'
      })
        .then((res) => {
          this.sendKCardTotal = res.data.count
          this.sendKCardData = res.data.results
        })
    },
    getSendArticle() {
      this.$refs.sendArticleTable.loadStart()
      this.$api.content.getPublicList({
        page: this.sendArticlePage,
        page_size: this.sendArticlePageSize,
        ordering: 'id'
      })
        .then((res) => {
          this.sendArticleTotal = res.data.count
          this.sendArticleData = res.data.results
        })
    },
    async sendCustomHandler(type, message, next) {
      for (const item of this.sendCustomSelection) {
        let payload = {
          'category': type, // 1-图片 2-量表 3-方案 4-知识卡 5-科普文章/视频
          'id': item.id, // 量表/方案/知识卡/科普 id
          'url': null, // 图片/视频图片地址
          'title': item.name, // 科普视频/文章、知识卡片、量表、方案标题/名称
          'summary': '', // 知识卡片、量表简介
          'videoDuration': 0, // 视频时长(秒)
          'videoCover': '', // 视频封面
          'authorAvatar': '', // 科普作者头像
          'authorName': '', // 科普作者
        }
        if (type == 1) {
          payload.url = item.url
        } else if (type == 2) {
          payload.summary = item.config.instructions
        } else if (type == 4) {
          payload.summary = item.summary
        } else if (type == 5) {
          payload.title = item.title
          payload.authorAvatar = item.creator.avatar_url
          payload.authorName = item.author_name
          if (item.content_type == 'video') {
            payload.videoDuration = item.video.duration
            payload.videoCover = item.video.cover_url
          }
        }

        const message = await this.sendMassMessage({
          text_message: '',
          extra: {
            data: JSON.stringify(payload)
          }
        })

        this.chat.appendMessage(this.messageBuilder(message), true)

        const customMessageList = this.receiversImId.map(imid => {
          return this.$tim.createCustomMessage({
            to: imid,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
              data: JSON.stringify(payload)
            },
          })
        })

        message.timMessages = []
        for (const customMessage of customMessageList) {
          const imResponse = await this.$tim.sendMessage(customMessage)
          if (imResponse) {
            message.timMessages.push(imResponse.data.message)
          }
        }
        if (next) {
          next()
        }

        this.sendScaleVisible = false
        this.sendPlanVisible = false
        this.sendKCardVisible = false
        this.sendArticleVisible = false
        this.focusEditor()
      }
    },
    focusEditor() {
      const editorInput = this.chat.$el.querySelector('.lemon-editor__input')
      editorInput.focus()
    },
    // 将接口返回的群发历史消息包装为imui可识别的消息
    messageBuilder(item) {
      const msgId = item.id
      const toId = this.contact.id
      const time = this.$Day(item.created_at).unix() * 1000
      const content = item.text_message
      const formUser = {
        id: item.sender.im_user_id,
        displayName: item.sender.name || '未命名',
        avatar: item.sender.avatar_url
      }

      const unknown = {
        msg: item,
        massMessage: true, // 标记为群发消息
        id: msgId,
        status: 'success',
        type: 'text',
        sendTime: time,
        content: '[未知的消息类型]',
        toContactId: toId,
        fromUser: formUser
      }

      // 文本类型消息
      if (content !== '') {
        return {
          msg: item,
          massMessage: true,
          tim: { payload: `data: null` },
          massType: 'text',
          id: msgId,
          status: 'success',
          type: 'custom', // 文本消息也要使用自定义消息来解析
          sendTime: time,
          content: content,
          toContactId: toId,
          fromUser: formUser
        }
      }

      const extra = item.extra
      // 自定义消息
      if (extra && extra.data !== '') {
        return {
          msg: item,
          massMessage: true,
          tim: { payload: extra },
          id: msgId,
          status: 'success',
          type: 'custom',
          sendTime: time,
          content: '[自定义消息]',
          toContactId: toId,
          fromUser: formUser
        }
      } else {
        return unknown
      }
    },
    revokeMessage(e, instance, hide) {
      const { message } = instance
      // 删除历史记录
      this.$api.groupSending.delete(message.recordId)
        .then(() => {
          const data = {
            id: message.id,
            type: 'event',
            //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
            content: (
              <div>
                <span>
                  你撤回了一条消息{' '}
                  <span
                    v-show={message.type === 'text'}
                    style='color:#409EFF;cursor:pointer'
                    content={message.content}
                    onClick={e => {
                      this.chat.setEditorValue(
                        e.target.getAttribute('content')
                      )
                    }}
                  >
                    重新编辑
                  </span>
                </span>
              </div>
            ),
            toContactId: this.contact.id,
            sendTime: new Date().getTime()
          }
          hide()
          this.chat.updateMessage(data)
          if (message.timMessages) {
            message.timMessages.forEach(msg => {
              this.$tim.revokeMessage(msg)
                .then(res => {
                  // 更新背后的im会话
                  this.lemon.initContacts()
                })
                .catch(error => {
                })
            })
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })

    },
  }, // methods end
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    calcTeamMembers() {
      if (this.teamKeyword !== '') {
        const teamUser = this.unique(this.members.filter(item => !item.isUser && !item.isNotMember), 'id')
        return teamUser.filter(item => item.name.indexOf(this.teamKeyword) !== -1)
      } else {
        return this.members.filter(item => !item.isUser)
      }
    },
    calcUserMembers() {
      if (this.userKeyword !== '') {
        return this.members
          .filter(item => item.isUser)
          .filter(item => item.name.indexOf(this.userKeyword) !== -1)
      } else {
        return this.members.filter(item => item.isUser)
      }
    },
    memberCount() {
      return this.unique(this.members.filter(item => !item.isNotMember), 'id').length
    },
    chat() {
      const { simpleIMUI } = this.$refs
      if (simpleIMUI) {
        return simpleIMUI
      }
    },
    imuiTools() {
      return [
        {
          name: 'emoji',
        },
        // {
        //   name: 'uploadFile',
        //   title: "发送文件",
        // },
        {
          name: 'uploadImage',
        },
        {
          name: 'article',
          title: '发送文章',
          click: () => {
            this.sendArticleVisible = true
            this.sendCustomSelection = []
            this.$nextTick(() => {
              this.getSendArticle()
            })
          },
          render: () => {
            return <i class="el-icon-tickets" style="font-size: 22px;"></i>;
          },
        },
        {
          name: 'solution',
          title: '发送方案',
          click: () => {
            this.sendPlanVisible = true
            this.sendCustomSelection = []
            this.$nextTick(() => {
              this.getSendPlan()
            })
          },
          render: () => {
            return <i class="el-icon-news" style="font-size: 22px;"></i>;
          },
        },
        {
          name: 'scale',
          title: '发送量表',
          click: () => {
            this.sendScaleVisible = true
            this.sendCustomSelection = []
            this.$nextTick(() => {
              this.getSendScale()
            })
          },
          render: () => {
            return <i class="el-icon-edit" style="font-size: 22px;"></i>;
          },
        },
        {
          name: 'kcard',
          title: '发送知识卡',
          click: () => {
            this.sendKCardVisible = true
            this.sendCustomSelection = []
            this.$nextTick(() => {
              this.getSendKCard()
            })
          },
          render: () => {
            return <i class="el-icon-postcard" style="font-size: 22px;"></i>;
          },
        },
      ]
    },
    contextmenu() {
      return [
        {
          click: (e, instance, hide) => {
            this.revokeMessage(e, instance, hide)
          },
          visible: instance => {
            console.log('1056: ', instance)
            return (
              instance.message.fromUser.id === this.user.id &&
              instance.message.recordId &&
              instance.message.timMessages &&
              new Date().getTime() - instance.message.sendTime < 120000
            );
          },
          text: '撤回消息'
        },
        {
          visible: instance => {
            return instance.message.type === 'image'
          },
          text: '下载图片',
          click: (e, instance, hide) => {
            const { message } = instance
            const customData = message.tim.cloudCustomData
            let fileName = ''
            if (customData !== '') {
              fileName = customData
            } else {
              let ext = ''
              switch (message.tim.payload.imageFormat) {
                case 1:
                  ext = '.jpg'
                  break
                case 2:
                  ext = '.jpg'
                  break
                case 3:
                  ext = '.jpg'
                  break
                case 4:
                  ext = '.jpg'
                  break
                default:
                  ext = ''
              }
              // 图片格式 JPG = 1，GIF = 2，PNG = 3，BMP = 4，其他 = 255。
              fileName = message.sendTime + ext
            }
            this.$download(message.tim.payload?.imageInfoArray?.[0].imageUrl, fileName)
            hide()
          }
        },
        {
          visible: instance => {
            return instance.message.type === 'file'
          },
          text: '下载文件',
          click: (e, instance, hide) => {
            const { message } = instance
            console.log(message)
            this.$download(message.tim.payload.fileUrl, message.fileName)
            hide()
          }
        }
      ]
    },
    receiversId() {
      return this.selectedMembers.map(item => item.id)
    },
    receiversImId() {
      return this.selectedMembers.map(item => item.im_user_id)
    },
  }, // computed end
}
</script>

<style scoped lang="less">
.mass-message-dialog {
  :deep(.el-dialog) {
    margin-top: 40px !important;
    margin-bottom: 40px !important;
    width: 980px;
    height: 1200px;

    .el-dialog__body {
      //height: calc(100% - 68px - 98px);
      //overflow: auto;
      color: #5A6D86 !important;

      .el-row {
        height: 100%;

        .el-col {
          height: 100%;

          .scroll-wrap {
            height: 100%;
          }
        }
      }
    }
  }
}

.mass-message-dialog {
  :deep(.el-dialog__footer) {
    display: flex;
    justify-content: flex-start !important;
  }

  .wrap-header {
    display: flex;
    align-items: center;
    background-color: #efefef;
    //background-color: #5c617e;
    padding: 10px 0;
    padding-left: 10px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    .wrap-title {
      //color: #fff;
      color: #566085;
      font-size: 16px;
      margin-right: 10px;
      font-weight: bold;
    }
  }

  .team-wrap {
    border: 1px solid #eee;
    border-radius: 6px;
  }

  .input-box {
    background-color: #efefef;
    //background-color: #5c617e;
    padding: 10px;
    padding-top: 0;
  }


  .member-wrap {
    .member-list {
      padding-top: 10px;
      height: 320px;
      overflow: hidden auto;
      //background-color: #efefef;
    }
  }

  .user-wrap {
    .member-list {
      padding-top: 10px;
      height: 474px;
      overflow: hidden auto;
      //background-color: #efefef;
    }

    .scroll-wrap {
      //height: calc(100vh - 165px);
      padding-right: 15px;
      overflow: hidden auto;
    }

    .checkbox-wrap {
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }


  .selected-wrap {
    border: 1px solid #eee;
    border-radius: 6px;

    .select-list {
      height: 360px;
      overflow: hidden auto;
    }
  }
}

.send-card-dialog {
  :deep(.el-dialog) {
    width: 680px;
    height: 550px;
  }
}


.chat-wrap {
  :deep(.lemon-menu .lemon-avatar img), :deep(.lemon-message .lemon-avatar img) {
    background-color: #fff;
  }

  //:deep(.lemon-container__displayname) {
  //  color: #566085;
  //  font-size: 16px;
  //  margin-right: 10px;
  //  font-weight: bold;
  //}
  :deep(::-webkit-scrollbar) {
    width: 6px; /*对垂直流动条有效*/
    height: 6px; /*对水平流动条有效*/
    cursor: pointer;
    background-color: transparent;
    position: absolute;
  }

  // 定义滚动条的轨道颜色、内阴影及圆角
  :deep(::-webkit-scrollbar-track) {
    background-color: transparent;
  }

  // 定义滑块颜色、内阴影及圆角
  :deep(::-webkit-scrollbar-thumb) {
    background-color: #aaaaaa;

    &:hover {
      background-color: #aaaaaa;
    }
  }

  .cover {
    text-align: center;
    user-select: none;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);

    i {
      font-size: 84px;
      color: #e6e6e6;
    }

    p {
      font-size: 18px;
      color: #ddd;
      line-height: 50px;
    }
  }

  width: 100%;
  //height: 610px;
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 6px;
}


</style>
