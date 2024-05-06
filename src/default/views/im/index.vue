<template>
  <div class="panel">
    <div class="card">
      <lemon-imui
        ref="IMUI"
        class="chat"
        avatar-cricle
        :user="user"
        :hideDrawer="false"
        :contextmenu="contextmenu"
        :contact-contextmenu="contactContextmenu"
        :contactTimeFormat="contactTimeFormat"
        :messageTimeFormat="messageTimeFormat"
        @change-contact="handleChangeContact"
        @change-menu="changeMenu"
        @pull-messages="handlePullMessages"
        @message-click="handleMessageClick"
        @contact-send="handleContactSend"
        @send="handleSend"
        width="100%"
        height="100%"
        v-loading="chatLoading"
      >
        <template slot="cover">
          <div>
            <div class="cover">
              <i class="lemon-icon-message"></i>
              <p><b>即时聊天</b> IM</p>
            </div>
          </div>
        </template>

        <!-- 会话列表顶部插槽 -->
        <template slot="sidebar-message-fixedtop">
          <div class="list-toolbar">
            <el-dropdown @command="handleToolbarCommand">
              <div class="i-box">
                <i class="el-icon-plus"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="createGroup"
                  >创建群聊</el-dropdown-item
                >
                <el-dropdown-item command="massMessage"
                  >群发消息</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <!-- 联系人列表顶部插槽 -->
        <template slot="sidebar-contact-fixedtop">
          <div class="list-toolbar">
            <el-dropdown @command="handleToolbarCommand">
              <div class="i-box">
                <i class="el-icon-plus"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="createGroup"
                  >创建群聊</el-dropdown-item
                >
                <el-dropdown-item command="massMessage"
                  >群发消息</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>

        <template #message-title>
          <template v-if="convType === c2cType && convPatient">
            <div class="message-header">
              <div class="main-title">患者{{ convPatient.patient.name }}</div>
              <div class="project-name">{{ convPatient.project.name }}</div>
              <div class="team-name">{{ convPatient.team.name }}</div>
            </div>
          </template>
          <template v-if="convType === c2cType && !convPatient">
            <div class="message-header">
              <div class="main-title">{{ currentContact.displayName }}</div>
            </div>
          </template>
          <template v-if="convType === groupType">
            <div class="message-header">
              <div class="message-header">
                <div class="main-title">{{ currentContact.displayName }}</div>
                <!--                <div class="project-name">{{ convPatient.project.name }}</div>-->
                <!--                <div class="team-name">{{ convPatient.team.name }}</div>-->
              </div>
            </div>
          </template>
        </template>

        <!-- 聊天展示的抽屉-->
        <template #message-side="groupContact">
          <!--        <template v-if="currentContact && currentContact.tim.type === TIM.TYPES.CONV_C2C" #message-side="groupContact">-->
          <template v-if="convType === c2cType && convPatient">
            <div class="message-side-box">
              <div class="side-title">患者信息</div>
              <div class="side-user-info">
                <div class="avatar">
                  <lemon-avatar
                    v-if="convPatient.patient.avatar_url"
                    :src="convPatient.patient.avatar_url"
                  ></lemon-avatar>
                  <icon-box
                    v-else
                    folder="bg"
                    icon-name="im_default_avatar"
                    w="32"
                    h="32"
                    box-w="32"
                    box-h="32"
                  ></icon-box>
                </div>
                <div>
                  <div class="name">
                    {{ convPatient.patient.name }}
                    <el-link
                      class="link"
                      @click="
                        $router.push(
                          `/patient_detail/${convPatient.id}?views=0`
                        )
                      "
                      style="vertical-align: baseline; font-weight: normal"
                    >
                      查看档案
                    </el-link>
                  </div>
                  <div class="info">
                    {{ convPatient.stage || "未设置" }} 加入项目<span>
                      {{ $Day(convPatient.joined_at).fromNow(true) }}</span
                    >
                  </div>
                </div>
              </div>

              <div class="side-title mt_20">健康备注</div>
              <div class="remark" v-if="convPatient.memos.length > 0">
                <div
                  class="mr_8"
                  v-for="memo in convPatient.memos"
                  :key="memo.id"
                >
                  <span class="memo-content">#{{ memo.content }}</span
                  ><span class="memo-creator"
                    >（by {{ memo.creator.name }}）</span
                  >
                </div>
              </div>
              <div v-else class="remark">暂无</div>

              <div class="side-title">医生信息</div>
              <div class="doctor">
                <template v-if="convPatient.team && convPatient.team.members">
                  <div class="side-user-info" v-if="convPatient.team.leader">
                    <div class="avatar">
                      <lemon-avatar
                        v-if="convPatient.team.leader.avatar_url"
                        :src="convPatient.team.leader.avatar_url"
                      ></lemon-avatar>
                      <icon-box
                        v-else
                        folder="bg"
                        icon-name="im_default_avatar"
                        w="32"
                        h="32"
                        box-w="32"
                        box-h="32"
                      ></icon-box>
                    </div>
                    <div class="name">{{ convPatient.team.leader.name }}</div>
                    <el-tag
                      class="role"
                      v-if="convPatient.team.leader.role_id === $enum.ROLE.DR"
                      type="success"
                      effect="dark"
                      size="mini"
                    >
                      {{ leaderRoleName }}
                    </el-tag>
                    <el-tag
                      class="role"
                      v-else-if="
                        convPatient.team.leader.role_id === $enum.ROLE.LD
                      "
                      color="#6b8cce"
                      effect="dark"
                      size="mini"
                    >
                      {{ leaderRoleName }}
                    </el-tag>
                    <el-tag
                      class="role"
                      v-else-if="
                        convPatient.team.leader.role_id === $enum.ROLE.RD
                      "
                      type="warning"
                      effect="dark"
                      size="mini"
                    >
                      {{ leaderRoleName }}
                    </el-tag>
                    <el-tag v-else type="info" effect="dark" size="mini"
                      >{{ leaderRoleName }}
                    </el-tag>
                    <el-tag
                      class="role"
                      color="#f56c6c"
                      type="danger"
                      effect="dark"
                      size="mini"
                      >团队长
                    </el-tag>
                  </div>
                  <div
                    class="side-user-info"
                    v-for="doctor in convPatient.team.members.filter(
                      (item) => item.id !== convPatient.team?.leader?.id
                    )"
                    :key="doctor.id"
                  >
                    <div class="avatar">
                      <lemon-avatar
                        v-if="doctor.avatar_url"
                        :src="doctor.avatar_url"
                      ></lemon-avatar>
                      <icon-box
                        v-else
                        folder="bg"
                        icon-name="im_default_avatar"
                        w="32"
                        h="32"
                        box-w="32"
                        box-h="32"
                      ></icon-box>
                    </div>
                    <div class="name">{{ doctor.name }}</div>
                    <el-tag
                      class="role"
                      v-if="doctor.role_id === $enum.ROLE.DR"
                      type="success"
                      effect="dark"
                      size="mini"
                    >
                      {{ doctor.role_name }}
                    </el-tag>
                    <el-tag
                      class="role"
                      v-else-if="doctor.role_id === $enum.ROLE.LD"
                      color="#6b8cce"
                      effect="dark"
                      size="mini"
                    >
                      {{ doctor.role_name }}
                    </el-tag>
                    <el-tag
                      class="role"
                      v-else-if="doctor.role_id === $enum.ROLE.RD"
                      type="warning"
                      effect="dark"
                      size="mini"
                    >
                      {{ doctor.role_name }}
                    </el-tag>
                    <el-tag v-else type="info" effect="dark" size="mini">{{
                      doctor.role_name
                    }}</el-tag>
                  </div>
                </template>
              </div>
              <div style="margin-top: 40px">
                <el-checkbox v-model="checked" @change="AIRecover"
                  >AI回复</el-checkbox
                >
              </div>
            </div>
          </template>
          <template v-if="convType === groupType && convPatients.length !== 0">
            <div class="message-side-box conv-group">
              <el-carousel
                trigger="click"
                :autoplay="false"
                indicator-position="none"
                class="carousel"
                :class="{ 'hide-carousel-arrow': convPatients.length === 1 }"
              >
                <el-carousel-item
                  v-for="convPatient in convPatients"
                  :key="convPatient.id"
                >
                  <div class="side-title">患者信息</div>
                  <div class="side-user-info">
                    <div class="avatar">
                      <lemon-avatar
                        v-if="convPatient.patient.avatar_url"
                        :src="convPatient.patient.avatar_url"
                      ></lemon-avatar>
                      <icon-box
                        v-else
                        folder="bg"
                        icon-name="im_default_avatar"
                        w="32"
                        h="32"
                        box-w="32"
                        box-h="32"
                      ></icon-box>
                    </div>
                    <div>
                      <div class="name">
                        {{ convPatient.patient.name }}
                        <el-link
                          class="link"
                          @click="
                            $router.push(
                              `/patient_detail/${convPatient.id}?views=0`
                            )
                          "
                          style="vertical-align: baseline; font-weight: normal"
                        >
                          查看档案>
                        </el-link>
                      </div>
                      <div class="info">
                        {{ convPatient.stage || "未设置" }} 加入项目<span>
                          {{ $Day(convPatient.joined_at).fromNow(true) }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <div class="side-title mt_20">服务备注</div>
                  <div
                    v-if="convPatient.memos && convPatient.memos.length > 0"
                    class="memo-list mb_10"
                  >
                    <div
                      class="memo-item"
                      v-for="memo in convPatient.memos"
                      :key="memo.id"
                    >
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="memo.content"
                        placement="left-start"
                        :open-delay="1000"
                      >
                        <div class="content">{{ memo.content }}</div>
                      </el-tooltip>
                      <div class="creator">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="`${memo.creator.role_name}-${memo.creator.name}`"
                          placement="left-start"
                          :open-delay="1000"
                        >
                          <div class="name">
                            来自{{ memo.creator.role_name }}-{{
                              memo.creator.name
                            }}
                          </div>
                        </el-tooltip>
                        <div class="time">
                          {{ memo.created_at | dateFormat }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="remark">暂无</div>

                  <div class="side-title">医生信息</div>
                  <div class="doctor">
                    <template
                      v-if="convPatient.team && convPatient.team.members"
                    >
                      <div
                        class="side-user-info"
                        v-if="convPatient.team.leader"
                      >
                        <div class="avatar">
                          <lemon-avatar
                            v-if="convPatient.team.leader.avatar_url"
                            :src="convPatient.team.leader.avatar_url"
                          ></lemon-avatar>
                          <icon-box
                            v-else
                            folder="bg"
                            icon-name="im_default_avatar"
                            w="32"
                            h="32"
                            box-w="32"
                            box-h="32"
                          ></icon-box>
                        </div>
                        <div class="name">
                          {{ convPatient.team.leader.name }}
                        </div>
                        <el-tag
                          class="role"
                          v-if="
                            convPatient.team.leader.role_id === $enum.ROLE.DR
                          "
                          type="success"
                          effect="dark"
                          size="mini"
                        >
                          {{ leaderRoleName }}
                        </el-tag>
                        <el-tag
                          class="role"
                          v-else-if="
                            convPatient.team.leader.role_id === $enum.ROLE.LD
                          "
                          color="#6b8cce"
                          effect="dark"
                          size="mini"
                        >
                          {{ leaderRoleName }}
                        </el-tag>
                        <el-tag
                          class="role"
                          v-else-if="
                            convPatient.team.leader.role_id === $enum.ROLE.RD
                          "
                          type="warning"
                          effect="dark"
                          size="mini"
                        >
                          {{ leaderRoleName }}
                        </el-tag>
                        <el-tag v-else type="info" effect="dark" size="mini"
                          >{{ leaderRoleName }}
                        </el-tag>
                        <el-tag
                          class="role"
                          color="#f56c6c"
                          type="danger"
                          effect="dark"
                          size="mini"
                          >团队长
                        </el-tag>
                      </div>
                      <div
                        class="side-user-info"
                        v-for="doctor in convPatient.team.members.filter(
                          (item) => item.id !== convPatient.team?.leader?.id
                        )"
                        :key="doctor.id"
                      >
                        <div class="avatar">
                          <lemon-avatar
                            v-if="doctor.avatar_url"
                            :src="doctor.avatar_url"
                          ></lemon-avatar>
                          <icon-box
                            v-else
                            folder="bg"
                            icon-name="im_default_avatar"
                            w="32"
                            h="32"
                            box-w="32"
                            box-h="32"
                          ></icon-box>
                        </div>
                        <div class="name">{{ doctor.name }}</div>
                        <el-tag
                          class="role"
                          v-if="doctor.role_id === $enum.ROLE.DR"
                          type="success"
                          effect="dark"
                          size="mini"
                        >
                          {{ doctor.role_name }}
                        </el-tag>
                        <el-tag
                          class="role"
                          v-else-if="doctor.role_id === $enum.ROLE.LD"
                          color="#6b8cce"
                          effect="dark"
                          size="mini"
                        >
                          {{ doctor.role_name }}
                        </el-tag>
                        <el-tag
                          class="role"
                          v-else-if="doctor.role_id === $enum.ROLE.RD"
                          type="warning"
                          effect="dark"
                          size="mini"
                        >
                          {{ doctor.role_name }}
                        </el-tag>
                        <el-tag v-else type="info" effect="dark" size="mini">{{
                          doctor.role_name
                        }}</el-tag>
                      </div>
                    </template>
                  </div>
                  <div v-if="isOwner" style="margin-top: 40px">
                    <el-checkbox v-model="checked" @change="AIRecover"
                      >AI回复</el-checkbox
                    >
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </template>
        </template>
      </lemon-imui>

      <!-- 创建群聊 -->
      <el-dialog
        title="创建群聊"
        :visible.sync="createGroupVisible"
        :modal="true"
        class="create-group-dialog"
      >
        <template #title>
          <div slot="title" class="el-dialog__title">
            创建群聊
            <el-input
              style="
                position: relative;
                top: -2px;
                width: 258px;
                margin-left: 30px;
              "
              v-model="groupName"
              placeholder="请输入群聊名称"
              clearable
            ></el-input>
          </div>
        </template>
        <el-row :gutter="10">
          <el-col :span="11">
            <user-checkbox-group v-model="selectedMembers" class="scroll-wrap">
              <div class="member-wrap">
                <div class="team-wrap">
                  <div class="wrap-header">
                    <div class="wrap-title">团队成员</div>
                    <el-checkbox
                      @change="handleTeamSelectAll"
                      v-model="teamSelectAll"
                      >全选</el-checkbox
                    >
                  </div>
                  <div class="input-box">
                    <el-input
                      placeholder="请输入团队成员姓名搜索"
                      v-model="teamKeyword"
                      clearable
                    ></el-input>
                  </div>
                  <div class="member-list" v-loading="teamMemberLoading">
                    <user-card
                      v-for="(member, index) in calcTeamMembers"
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
                    <el-checkbox
                      @change="handleUserSelectAll"
                      v-model="userSelectAll"
                      >全选</el-checkbox
                    >
                  </div>
                  <div class="input-box">
                    <el-input
                      placeholder="请输入患者姓名搜索"
                      v-model="userKeyword"
                      clearable
                    ></el-input>
                  </div>
                  <div class="member-list" v-loading="userMemberLoading">
                    <user-card
                      v-for="(member, index) in calcUserMembers"
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
          <el-col :span="13">
            <div class="selected-wrap user-wrap">
              <div class="patient-wrap">
                <div class="wrap-header mb_10">
                  <div class="wrap-title">已选择</div>
                  （{{ selectedMembers.length }} / {{ memberCount }}）
                  <m-button
                    style="
                      padding: 9px 12px !important;
                      float: right;
                      margin-left: auto;
                      margin-right: 10px;
                    "
                    h="32px"
                    plain
                    @click="handleClearAll(false)"
                  >
                    清空
                  </m-button>
                </div>
                <user-card
                  v-for="(member, index) in selectedMembers"
                  showRemove
                  :label="member"
                  :userInfo="member"
                  :key="index"
                  @remove="onRemove"
                >
                </user-card>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--        <div style="display: inline-block; width: 200px;">-->
        <!--          群名称：-->
        <!--          <el-input v-model="groupName"></el-input>-->
        <!--        </div>-->
        <span slot="footer" class="dialog-footer">
          <m-button type="default" @click="createGroupVisible = false" w="128px"
            >取 消</m-button
          >
          <m-button @click="createGroup" w="128px">确 定</m-button>
        </span>
      </el-dialog>
    </div>

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
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="id" label="ID" min-width="80"> </el-table-column>
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
        <m-button type="default" @click="sendScaleVisible = false" w="128px"
          >取 消</m-button
        >
        <m-button type="primary" @click="sendCustomHandler(2)" w="128px"
          >发 送</m-button
        >
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
        <el-table-column type="selection" width="45"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
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
        <el-table-column show-overflow-tooltip prop="stage" label="场景">
        </el-table-column>
      </m-view-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="sendPlanVisible = false" w="128px"
          >取 消</m-button
        >
        <m-button type="primary" @click="sendCustomHandler(3)" w="128px"
          >发 送</m-button
        >
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
        <el-table-column type="selection" width="45"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
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
              style="width: auto; height: 60px"
              fit="cover"
              :preview-src-list="[scope.row.image]"
            ></el-image>
          </template>
        </el-table-column>
      </m-view-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="sendKCardVisible = false" w="128px"
          >取 消</m-button
        >
        <m-button type="primary" @click="sendCustomHandler(4)" w="128px"
          >发 送</m-button
        >
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
        <el-table-column type="selection" width="45"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="content_type"
          label="类型"
          min-width="80"
        >
          <template v-slot="scope">
            <span v-if="scope.row.content_type == 'video'">视频</span>
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
        <el-table-column show-overflow-tooltip prop="author_name" label="作者">
        </el-table-column>
      </m-view-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="sendArticleVisible = false" w="128px"
          >取 消</m-button
        >
        <m-button type="primary" @click="sendCustomHandler(5)" w="128px"
          >发 送</m-button
        >
      </span>
    </el-dialog>
    <mass-message :visible.sync="massMessageVisible"></mass-message>
    <el-dialog
      title="请选择常见问题答复"
      :visible.sync="sendQuestionVisible"
      :modal="true"
      width="1000px"
      top="5vh"
      class="question-dialog"
    >
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in problemType"
            :key="index"
            :label="item.name"
            :name="item.id + ''"
          ></el-tab-pane>
        </el-tabs>
        <div>
          <m-table
            class="m-table"
            ref="table"
            :data="tableData"
            :total="total"
            :page-sizes="[10, 15, 20]"
            :page-size.sync="pageSize"
            :current-page.sync="page"
            height="calc(90vh - 230px)"
            :get-data-func="getList"
            highlight-current-row
            @current-change="currentChange"
          >
            <el-table-column width="55">
              <template slot-scope="scope">
                <el-checkbox :value="scope.row == currentRow"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="question"
              label="问题/相关点"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.question }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="keyword"
              label="关键词"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.keyword.join("，") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="answer"
              label="回答"
              min-width="120"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.answer }}</span>
              </template>
            </el-table-column>
          </m-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button
          :disabled="!currentRow"
          type="primary"
          @click="sendAnswer"
          w="128px"
          >发 送</m-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="发送推送消息"
      :visible.sync="sendTemplateMsgVisible"
      :modal="true"
      width="500px"
      class="send-card-dialog"
    >
      <el-form
        class="form-box"
        :inline="true"
        label-position="left"
        :model="templateForm"
        :rules="ruleTemplateForm"
        ref="templateFormRef"
      >
        <el-form-item label="请选择消息模板" prop="id">
          <el-select
            style="width: 300px"
            placeholder="请选择消息模板"
            v-model="templateForm.id"
            @change="changeTemplate"
          >
            <el-option
              :label="option.title"
              :value="option.id"
              v-for="option in templageMsgList"
              :key="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请输入消息内容" prop="content">
          <el-input
            :rows="8"
            style="width: 300px"
            maxlength="20"
            show-word-limit
            v-model="templateForm.content"
            type="textarea"
            placeholder="请输入消息内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button
          type="default"
          @click="sendTemplateMsgVisible = false"
          w="128px"
          >取 消</m-button
        >
        <m-button type="primary" @click="sendTemplateMsg" w="128px"
          >发 送</m-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import emojiData from "./emojiData";
import userCard from "./components/userCard.vue";
import userCheckboxGroup from "./components/userCheckboxGroup.vue";
import createGroup from "./mixins/createGroup";
import MassMessage from "./components/MassMessage";
import LemonAvatar from "@/default/lemon-imui/components/avatar";
import TIM from "tim-js-sdk/tim-js-friendship";
import messageBuilder from "./messageBuilder";

export default {
  name: "IM",
  components: {
    LemonAvatar,
    userCard,
    userCheckboxGroup,
    MassMessage,
  },
  mixins: [createGroup],
  provide() {
    return {
      lemon: this,
    };
  },
  data() {
    return {
      key: "",
      user: {
        id: "",
        displayName: "",
        avatar: "",
      },
      imData: {},
      loginLoading: true,
      nextReqMessageID: "",

      groupMemberList: [],
      groupProfile: {},
      currentContact: {},
      menuActiveName: "messages",

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
      imageUrl: "",

      chatLoading: false,
      // 我的患者
      // myPatients: [],

      // 单聊患者信息
      convPatientInfo: null,
      // 群聊患者信息
      convPatientsInfo: [],

      massMessageVisible: false,

      sendMessageContact: {},

      sendQuestionVisible: false,
      activeName: "0",
      problemType: [],

      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,
      currentRow: null,

      checked: false,
      isOwner: false,

      templageMsgList: [],
      sendTemplateMsgVisible: false,
      templateForm: {
        id: null,
        content: "",
      },
      ruleTemplateForm: {
        id: [{ required: true, message: "请选择模版", trigger: "change" }],
      },
    };
  },
  watch: {
    groupList(n) {
      this.initContacts();
    },
    convList(n) {
      this.initContacts();
    },
    friendList(n) {
      this.initContacts();
    },
    timReady(ready) {
      if (ready) {
        this.getFriendList();
      }
    },
    receiveList(timMessage) {
      this.receiveMessageHandle(timMessage[0]);
    },
    userInfo() {
      this.user = {
        id: this.userInfo.im_profile.im_user_id,
        userId: this.userInfo.id,
        displayName: this.userInfo.name,
        avatar: this.userInfo.avatar_url,
      };
    },
    page() {
      this.currentRow = null;
    },
  },
  activated() {
    this.createGroupVisible = false;
    this.massMessageVisible = false;
    // this.getMyPatient()
    this.createPrivateChat();
  },
  deactivated() {
    const { IMUI } = this.$refs;
    if (IMUI.currentContactId) {
      IMUI.currentContactId = null;
    }
  },
  async mounted() {
    this.user = {
      id: this.userInfo.im_profile.im_user_id,
      userId: this.userInfo.id,
      displayName: this.userInfo.name,
      avatar: this.userInfo.avatar_url,
    };
    this.initMenus();
    this.initContacts();
    this.initEditorTools();
    this.initEmoji();
    this.getTemplateMsgList();
  },
  methods: {
    ...mapActions({
      setConvList: "im/setConvList",
      setGroupList: "im/setGroupList",
      setAsideIndex: "common/setAsideIndex",
    }),
    changeTemplate(e) {
      console.log(e, this.templageMsgList);
      try {
        let current = this.templageMsgList.filter((v) => v.id == e)[0];
        console.log(current);
        for (let index = 0; index < current.params.length; index++) {
          const isEdit = current.is_edit[index];
          if (isEdit && current.values) {
            this.templateForm.content = current.values[index];
            break;
          } else {
            this.templateForm.content = "";
          }
        }
      } catch (error) {}
    },

    sendTemplateMsg() {
      this.$refs["templateFormRef"].validate((valid) => {
        if (valid) {
          let template = this.templageMsgList.filter(
            (v) => v.id == this.templateForm.id
          )[0];
          let message = template.title;
          let values = {};
          let now = this.$Day().format("YYYY-MM-DD HH:mm:ss");
          for (let index = 0; index < template.params.length; index++) {
            const param = template.params[index];
            const isEdit = template.is_edit[index];
            if (isEdit) {
              values[template.keys[index]] = this.templateForm.content;
              message += `\n${param}：${this.templateForm.content}`;
            } else {
              if (param == "提醒人") {
                console.log(this.userInfo);
                values[template.keys[index]] = this.userInfo.account.name;
                message += `\n${param}：${this.userInfo.account.name}`;
              } else if (param == "提醒时间") {
                values[template.keys[index]] = now;
                message += `\n${param}：${now}`;
              } else if (param == "通知类型") {
                values[template.keys[index]] = template.values[index];
                message += `\n${param}：${template.values[index]}`;
              }
            }
          }
          var user_id = "";
          // 群聊
          if (this.convType === this.groupType) {
            user_id = this.convPatients[0].patient.user_id;
            // 单聊
          } else if (this.convType === this.c2cType) {
            user_id = this.convPatient.patient.user_id;
          }
          if (user_id.length == 0) {
            return;
          }
          this.$api.templateMessage
            .sendMsg({
              id: this.templateForm.id,
              patient_id: user_id,
              values: values,
            })
            .then((res) => {
              let sendMsg = { content: message };
              this.sendText(sendMsg, () => {
                const { IMUI } = this.$refs;
                let msg = this.messageBuilder(sendMsg.tim);
                if (!msg) return;
                msg.toContactId = sendMsg.tim.conversationID;
                IMUI.appendMessage(msg, true);
                this.$message.success("发送成功");
                this.$refs["templateFormRef"].resetFields();
                this.sendTemplateMsgVisible = false;
              });
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        } else {
        }
      });
    },
    getTemplateMsgList() {
      // this.chatLoading = true
      this.$api.templateMessage
        .getList({
          page: 1,
          page_size: 100,
        })
        .then((res) => {
          this.templageMsgList = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },

    AIRecover(value) {
      if (this.currentContact) {
        // this.$tim.tim.getConversationList().then(imResponse => {
        //   console.log('====================================');
        //   console.log(imResponse);
        //   console.log('====================================');
        // })

        // this.$api.aiReply.getList()
        //   .then(res => {
        //     console.log('====================================');
        //     console.log(res);
        //     console.log('====================================');
        //   }).catch(err => {
        //     console.log('====================================');
        //     console.log(err);
        //     console.log('====================================');
        //   })

        var im_session = this.currentContact.tim.conversationID;
        // 单聊要做处理
        if (this.convType === this.c2cType) {
          im_session += this.userInfo.im_profile.im_user_id;
        }

        this.$api.aiReply
          .update(encodeURIComponent(im_session), {
            is_auto: value,
            im_session: im_session,
            sender_id: this.user.userId,
          })
          .then((res) => {
            // 设置成功
            this.setEditable(value);
          })
          .catch((err) => {
            // 设置失败
          });

        // this.$api.aiReply.getDetail('123')
        //   .then(res => {
        //     console.log('====================================');
        //     console.log(res);
        //     console.log('====================================');
        //   }).catch(err => {
        //     console.log('====================================');
        //     console.log(err);
        //     console.log('====================================');
        //   })

        // let customData = {
        //   isAI: value
        // }
        // 设置自定义属性
        // this.$tim.tim.setConversationCustomData({
        //   conversationIDList: [this.currentContact.tim.conversationID],
        //   customData: JSON.stringify(customData)
        // }).then(res => {
        //   console.log('====================================');
        //   console.log(res);
        //   console.log('====================================');
        //   this.setEditable(value)
        // }).catch(err => {
        //   console.warn('revokeMessage error:', err);
        // });
      }
    },
    setEditable(value) {
      // const { IMUI } = this.$refs
      // const editorInput = IMUI.$el.querySelector('.lemon-editor__input')
      // editorInput.style.display = value ? 'none' : 'flex'
      // const editorTool = IMUI.$el.querySelector('.lemon-editor__tool')
      // editorTool.style.pointerEvents = value ? 'none' : 'auto'
      // editorTool.style.cursor = value ? 'not-allowed' : 'auto'

      const { IMUI } = this.$refs;
      const editor = IMUI.$el.querySelector(".lemon-editor");
      if (value) {
        editor.style.display = "none";
      } else {
        editor.style.display = "flex";
      }
    },
    handleClick(tab, event) {
      const active = this.problemType.find((ele) => ele.id == this.activeName);
      this.page = 1;
      this.getList();
    },
    getList() {
      this.$nextTick(() => {
        const { table } = this.$refs;
        if (table) table.loadStart();
      });
      this.$api.faq
        .getList({
          page: this.page,
          page_size: this.pageSize,
          ordering: "id",
          category: this.activeName,
        })
        .then((res) => {
          this.total = res.data.count;
          this.tableData = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow;
    },
    sendAnswer() {
      this.sendQuestionVisible = false;
      const { IMUI } = this.$refs;
      const editorInput = IMUI.$el.querySelector(".lemon-editor__input");
      editorInput.innerText = this.currentRow.answer;
      IMUI.$refs.editor.submitDisabled = false;
    },

    showImageViewer(url) {
      this.imageUrl = url;
      this.imageViewerVisible = true;
    },
    closeImageViewer() {
      this.imageViewerVisible = false;
    },
    // getMyPatient() {
    //   this.chatLoading = true
    //   this.$api.myProjectPatient
    //     .getList({
    //       ordering: '-id',
    //       dpt_id: this.userInfo.selectedDepartment.id,
    //       page: 1,
    //       page_size: 200
    //     })
    //     .then((res) => {
    //       this.chatLoading = false
    //       this.myPatients = res.data.results
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       this.chatLoading = false
    //       this.$message.error(JSON.stringify(err))
    //     })
    // },
    createPrivateChat() {
      if (!this.timReady) {
        return;
      }

      const { im } = this.$route.query;
      const { IMUI } = this.$refs;
      if (!im) return;
      IMUI.activeSidebar = this.menuMessages;
      const imId = "C2C" + window.atob(im);
      const conv = this.convList.find((tim) => tim.conversationID === imId);
      if (conv) {
        setTimeout(() => {
          IMUI.changeContact(imId);
        }, 1000);
      } else {
        let relImId = imId.replace("C2C", "");
        // 添加好友
        setTimeout(() => {
          this.$tim.tim
            .checkFriend({
              userIDList: [relImId],
              type: TIM.TYPES.SNS_CHECK_TYPE_BOTH,
            })
            .then((res) => {
              // 是好友
              if (res.data.successUserIDList.length == 0) {
                this.addFriend(relImId);
              } else {
                this.sendFirst(relImId)
              }
            })
            .catch((error) => {
              console.warn("checkFriend error:", error); // 添加好友失败的相关信息
            });
        }, 1000);
      }
    },
    sendFirst(relImId) {
      let message = this.$tim.createTextMessage({
        to: relImId,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          text: `您好，${this.userInfo.name}正在为您服务`,
        },
        needReadReceipt: true,
      });
      this.$tim
        .sendMessage(message)
        .then((imResponse) => {
          const { IMUI } = this.$refs;
          IMUI.activeSidebar = this.menuMessages;
          const imId = "C2C" + relImId;
          IMUI.changeContact(imId);
        })
        .catch(function (imError) {
          console.warn("sendMessage error:", imError);
        });
    },
    addFriend(relImId) {
      this.$tim.tim
        .addFriend({
          to: relImId,
          source: "patient",
          remark: "patient",
          groupName: "好友",
          wording: "你好",
          type: TIM.TYPES.SNS_ADD_TYPE_BOTH,
        })
        .then((imResponse) => {
          this.sendFirst(relImId)
        })
        .catch((imError) => {
          console.warn("addFriend error:", imError); // 添加好友失败的相关信息
        });
    },
    getFriendList() {
      this.$tim
        .getFriendList()
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    },
    // getMyProfile() {
    //   this.$tim.getMyProfile()
    //     .then((res) => {
    //       console.log(res)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // },
    handleToolbarCommand(command) {
      switch (command) {
        case "createGroup":
          // 创建群聊
          this.createGroupClick();
          break;
        case "massMessage":
          // 群发消息
          this.massMessageVisible = true;
          break;
      }
    },
    initMenus() {
      const { IMUI } = this.$refs;
      const menus = [
        {
          name: "messages",
          title: "消息",
        },
        {
          name: "contacts",
          title: "联系人",
        },
      ];

      IMUI.initMenus(menus);
    },
    initContacts() {
      if (this.menuActiveName === this.menuMessages) {
        this.boxingConvList();
      } else {
        this.boxingContactList();
      }
    },
    initEditorTools() {
      const { IMUI } = this.$refs;
      const tools = this.imuiTools;
      IMUI.initEditorTools(tools);
    },

    handleSendCustomSelectionChange(val) {
      this.sendCustomSelection = val;
    },
    getSendScale() {
      this.$refs.sendScaleTable.loadStart();
      this.$api.scale
        .getList({
          status: "published",
          page: this.sendScalePage,
          page_size: this.sendScalePageSize,
          ordering: "id",
        })
        .then((res) => {
          this.sendScaleTotal = res.data.count;
          this.sendScaleData = res.data.results;
        });
    },
    getSendPlan() {
      this.$refs.sendPlanTable.loadStart();
      this.$api.ppIntervs
        .getList({
          patient_user_id: this.currentContact.id.split("_").pop(),
          page: this.sendPlanPage,
          page_size: this.sendPlanPageSize,
        })
        .then((res) => {
          this.sendPlanTotal = res.data.count;
          this.sendPlanData = res.data.results;
        });
    },
    getSendKCard() {
      this.$refs.sendKCardTable.loadStart();
      this.$api.kcard
        .getList({
          page: this.sendKCardPage,
          page_size: this.sendKCardPageSize,
          ordering: "id",
        })
        .then((res) => {
          this.sendKCardTotal = res.data.count;
          this.sendKCardData = res.data.results;
        });
    },
    getSendArticle() {
      this.$refs.sendArticleTable.loadStart();
      this.$api.content
        .getPublicList({
          page: this.sendArticlePage,
          page_size: this.sendArticlePageSize,
          ordering: "id",
        })
        .then((res) => {
          this.sendArticleTotal = res.data.count;
          this.sendArticleData = res.data.results;
        });
    },
    sendCustomHandler(type) {
      const { IMUI } = this.$refs;
      const currentContact = IMUI.currentContact;

      let to = "";
      if (currentContact.tim.type === TIM.TYPES.CONV_GROUP) {
        to = currentContact.tim.groupProfile.groupID;
      } else if (currentContact.tim.type === TIM.TYPES.CONV_C2C) {
        to = currentContact.tim.userProfile.userID;
      }

      if (type == 6) {
        let payload = {
          category: type, // 1-图片 2-量表 3-方案 4-知识卡 5-科普文章/视频
          id: -1, // 量表/方案/知识卡/科普 id
          url: null, // 图片/视频图片地址
          title: "健康评估", // 科普视频/文章、知识卡片、量表、方案标题/名称
          summary: "", // 知识卡片、量表简介
          videoDuration: 0, // 视频时长(秒)
          videoCover: "", // 视频封面
          authorAvatar: "", // 科普作者头像
          authorName: "", // 科普作者
        };
        const customMessage = this.$tim.createCustomMessage({
          to: to,
          conversationType: currentContact.tim.type,
          payload: {
            data: JSON.stringify(payload),
          },
        });
        // return
        this.focusEditor();
        this.$tim
          .sendMessage(customMessage)
          .then((imResponse) => {
            let message = this.messageBuilder(imResponse.data.message);
            if (!message) return;
            message.toContactId = imResponse.data.message.conversationID;
            IMUI.appendMessage(message, true);
            // next()
          })
          .catch((imError) => {
            console.log(imError);
            this.$message.error(imError);
          });
      } else {
        this.sendCustomSelection.forEach((item) => {
          let payload = {
            category: type, // 1-图片 2-量表 3-方案 4-知识卡 5-科普文章/视频
            id: item.id, // 量表/方案/知识卡/科普 id
            url: null, // 图片/视频图片地址
            title: item.name, // 科普视频/文章、知识卡片、量表、方案标题/名称
            summary: "", // 知识卡片、量表简介
            videoDuration: 0, // 视频时长(秒)
            videoCover: "", // 视频封面
            authorAvatar: "", // 科普作者头像
            authorName: "", // 科普作者
          };
          // 量表
          if (type == 2) {
            payload.summary = item.config.instructions;
            // 知识卡
          } else if (type == 4) {
            payload.summary = item.summary;
            // 科普
          } else if (type == 5) {
            payload.title = item.title;
            payload.authorAvatar = item.creator.avatar_url;
            payload.authorName = item.author_name;
            if (item.content_type == "video") {
              payload.videoDuration = item.video.duration;
              payload.videoCover = item.video.cover_url;
            }
          }
          const customMessage = this.$tim.createCustomMessage({
            to: to,
            conversationType: currentContact.tim.type,
            payload: {
              data: JSON.stringify(payload),
            },
          });
          // return
          this.focusEditor();
          this.$tim
            .sendMessage(customMessage)
            .then((imResponse) => {
              let message = this.messageBuilder(imResponse.data.message);
              if (!message) return;
              message.toContactId = imResponse.data.message.conversationID;
              IMUI.appendMessage(message, true);
              // next()
            })
            .catch((imError) => {
              console.log(imError);
              this.$message.error(imError);
            });
        });
      }

      this.sendScaleVisible = false;
      this.sendPlanVisible = false;
      this.sendKCardVisible = false;
      this.sendArticleVisible = false;
    },
    initEmoji() {
      const { IMUI } = this.$refs;

      IMUI.initEmoji(this.emojiData);
    },
    changeMenu(menu) {
      this.menuActiveName = menu;
      if (this.menuActiveName === this.menuMessages) {
        this.boxingConvList();
      } else {
        this.boxingContactList();
      }
    },
    customMap(category) {
      const map = {
        1: "图片",
        2: "量表",
        3: "方案",
        4: "知识卡",
        5: "科普知识",
        6: "健康评估",
        7: "模版消息",
      };
      return map[category];
    },
    // 解析tim会话的lastMessage，返回消息类型（IMUI的消息类型）和一个适合展示的文本
    parseLastMessage(lastMessage = {}) {
      let lastText = "";
      let lastType = "";

      switch (lastMessage.type) {
        case TIM.TYPES.MSG_TEXT: {
          lastType = "text";
          if (lastMessage.isRevoked) {
            console.log(lastMessage);
            lastText =
              lastMessage.fromAccount === this.user.id
                ? "你撤回了一条消息"
                : `${lastMessage.nick}撤回了一条消息`;
          } else {
            lastText = lastMessage.payload.text;
          }
          break;
        }
        case TIM.TYPES.MSG_IMAGE: {
          lastType = "image";
          lastText = "[图片]";
          break;
        }
        case TIM.TYPES.MSG_FILE: {
          lastType = "file";
          lastText = "[文件]";
          break;
        }
        case TIM.TYPES.MSG_VIDEO: {
          lastType = "video";
          lastText = "[视频]";
          break;
        }
        case TIM.TYPES.MSG_SOUND: {
          lastType = "text";
          lastText = "[语音]";
          break;
        }
        case TIM.TYPES.MSG_CUSTOM: {
          lastType = "custom";
          // 自定义类型的消息会根据lastType的值来显示最后消息的内容
          let payload;
          try {
            payload = JSON.parse(lastMessage.payload.data);
          } catch (e) {
            lastType = "text";
            lastText = payload;
          }
          if (typeof payload === "object") {
            lastText = this.customMap(payload.category);
          } else {
            const extension = lastMessage.payload.extension;
            if (lastMessage.payload.data === "group_create") {
              lastText = lastMessage.nick + "创建了群聊";
            } else if (extension) {
              lastText = extension.replace(
                new RegExp(lastMessage.fromAccount),
                lastMessage.nick
              );
            } else {
              lastText = lastMessage.payload.data;
            }
          }
          break;
        }
        default: {
          lastType = "text";
          lastText = "[未知消息]";
        }
      }
      return { lastText, lastType };
    },
    // 将tim会话包装为IMUI会话
    boxingConvList() {
      const { IMUI } = this.$refs;
      const convs = [];

      // 当lastContent有内容时，IMUI才会将聊天加入到会话列表中
      this.convList.forEach((item) => {
        // tim返回的是秒时间戳，js需要毫秒时间戳才能显示正确的时间
        const lastTime = item.lastMessage.lastTime * 1000;
        const { lastText, lastType } = this.parseLastMessage(item.lastMessage);

        let conv = {};

        switch (item.type) {
          case TIM.TYPES.CONV_C2C: {
            // 单聊
            conv = {
              tim: item,
              id: item.conversationID,
              displayName: item.userProfile.nick || "未命名",
              // avatar: item?.userProfile?.avatar ?? require('@/common/assets/bg/default_avatar.png'),
              avatar: item?.userProfile?.avatar,
              index: "[3]联系人",
              unread: item.unreadCount,
              // lastContent: item.lastMessage.messageForShow,
              lastContent: IMUI.lastContentRender({
                type: lastType,
                content: lastText,
              }),
              lastSendTime: lastTime,
            };
            convs.push(conv);
            break;
          }
          case TIM.TYPES.CONV_GROUP: {
            // 群聊
            conv = {
              tim: item,
              id: item.conversationID,
              displayName: item.groupProfile.name,
              avatar: item?.groupProfile?.avatar,
              index: "[2]群聊",
              unread: item.unreadCount,
              // lastContent: item.lastMessage.messageForShow,
              lastContent: IMUI.lastContentRender({
                type: lastType,
                content: lastText,
              }),
              lastSendTime: lastTime,
            };
            convs.push(conv);
            break;
          }
        }
      });

      IMUI.initContacts(convs);
    },
    boxingContactList() {
      const { IMUI } = this.$refs;
      let list = [];

      const friend = this.friendList
        .filter((item) => {
          return item?.profile?.userID !== this.userID;
        })
        .map((item) => {
          item.type = TIM.TYPES.CONV_C2C;
          item.userProfile = {};
          item.userProfile.userID = item.profile.userID;
          return {
            tim: item,
            id: "C2C" + item?.profile?.userID,
            displayName: item?.profile?.nick || "未命名",
            avatar: item?.profile?.avatar,
            index: "[3]联系人",
            // unread: item.unreadCount,
            unread: 0,
            lastContent: " ",
            lastSendTime: "",
          };
        });

      const group = this.groupList.map((item) => {
        item.type = TIM.TYPES.CONV_GROUP;
        item.groupProfile = {};
        item.groupProfile.groupID = item.groupID;
        return {
          tim: item,
          id: "GROUP" + item.groupID,
          displayName: item.name,
          avatar: item?.groupProfile?.avatar,
          index: "[2]群聊",
          unread: 0,
          lastContent: " ",
          lastSendTime: "",
        };
      });
      list = [...friend, ...group];

      IMUI.initContacts(list);
    },
    handleContactSend(curact) {
      const { IMUI } = this.$refs;

      this.$nextTick(() => {
        if (curact.index === "联系人")
          curact.tim.conversationID = "C2C" + curact.id;
        IMUI.appendContact(curact);
      });
    },
    // 获取群成员列表
    getGroupMemberList(contact) {
      if (contact.tim.type === TIM.TYPES.CONV_GROUP) {
        this.$tim
          .getGroupMemberList({
            groupID: contact.tim.groupProfile.groupID,
            count: 100,
          })
          .then((res) => {
            console.log("memberList: ", res.data.memberList);
            this.groupMemberList = res.data.memberList;
            const owner = this.groupMemberList.find(
              (ele) => ele.role == TIM.TYPES.GRP_MBR_ROLE_OWNER
            );
            if (owner && owner.userID == this.userInfo.im_profile.im_user_id) {
              this.isOwner = true;
            } else {
              this.isOwner = false;
            }
            const user_id__in = this.groupMemberList
              .map((ele) => {
                let userid = ele.userID;
                let userids = userid.split("_");
                if (userids.length >= 3) {
                  return userids[2];
                }
                return "";
              })
              .filter((ele) => ele.length > 0)
              .map((ele) => parseInt(ele));
            if (user_id__in.length > 0) {
              this.$api.myProjectPatient
                .getList({
                  ordering: "-id",
                  page: 1,
                  page_size: user_id__in.length,
                  user_id__in: user_id__in.join(","),
                })
                .then((res) => {
                  this.convPatientsInfo = [];
                  if (
                    res.data &&
                    res.data.results &&
                    res.data.results.length > 0
                  ) {
                    this.convPatientsInfo = res.data.results;
                  } else {
                    this.convPatientsInfo = [];
                  }
                })
                .catch((err) => {
                  this.convPatientsInfo = [];
                  console.log(err);
                });
            }
          });
      }
    },
    getGroupProfile(contact) {
      if (contact.tim.type === TIM.TYPES.CONV_GROUP) {
        this.$tim
          .getGroupProfile({
            groupID: contact.tim.groupProfile.groupID,
          })
          .then((res) => {
            this.groupProfile = res.data.group;
          });
      }
    },
    handleChangeContact(contact, instance) {
      const { IMUI } = this.$refs;
      if (contact.tim) {
        this.currentContact = contact;
      }
      this.initEditorTools();
      const editor = IMUI.$el.querySelector(".lemon-editor");
      const leftTool = IMUI.$el.querySelector(".lemon-editor__tool-left");
      const rightTool = IMUI.$el.querySelector(".lemon-editor__tool-right");

      this.convPatientInfo = null;
      this.convPatientsInfo = [];
      // 系统通知
      if (
        this.currentContact.tim.conversationID &&
        this.currentContact.tim.conversationID.includes("administrator")
      ) {
        editor.style.display = "none";
        leftTool.style.display = "flex";
        rightTool.style.display = "flex";
        // AI问答
      } else if (
        this.currentContact.tim.conversationID &&
        this.currentContact.tim.conversationID.includes("@RBT")
      ) {
        editor.style.display = "flex";
        leftTool.style.display = "none";
        rightTool.style.display = "none";
      } else {
        leftTool.style.display = "flex";
        rightTool.style.display = "flex";
        this.checked = false;

        var im_session =
          this.currentContact.tim.conversationID ||
          this.currentContact.tim.userID;
        // 单聊要做处理
        if (this.convType === this.c2cType) {
          im_session += this.userInfo.im_profile.im_user_id;
          let userid = this.currentContact.tim.userProfile.userID;
          let userids = userid.split("_");
          if (userids.length >= 3) {
            this.$api.myProjectPatient
              .getList({
                ordering: "-id",
                page: 1,
                page_size: 1,
                user_id: parseInt(userids[2]),
              })
              .then((res) => {
                if (
                  res.data &&
                  res.data.results &&
                  res.data.results.length > 0
                ) {
                  this.convPatientInfo = res.data.results[0];
                } else {
                  this.convPatientInfo = null;
                }
              })
              .catch((err) => {
                console.log(err);
                this.convPatientInfo = null;
              });
          }
        }

        this.$api.aiReply
          .getDetail(encodeURIComponent(im_session))
          .then((res) => {
            this.checked = res.data.is_auto;
            this.setEditable(res.data.is_auto);
          })
          .catch((err) => {
            this.checked = false;
            editor.style.display = "flex";
          });
      }

      // this.$tim.tim.pinConversation({ conversationID: this.currentContact.tim.conversationID, isPinned: true });

      // let isAI = false
      // if (this.currentContact.tim.customData && this.currentContact.tim.customData.length > 0) {
      //   let customData = JSON.parse(this.currentContact.tim.customData)
      //   isAI = customData.isAI
      // }
      // this.checked = isAI

      // this.setEditable(isAI)

      this.$nextTick(() => {
        IMUI.messageViewToBottom();
      });
      this.nextReqMessageID = "";
      if (contact.index === "群聊") {
        this.getGroupMemberList(contact);
      }
      if (this.menuActiveName === this.menuMessages) {
        IMUI.clearMessages(this.currentContact.id);
        if (Object.keys(contact).length !== 0) {
          this.setMessageIsRead(instance.currentContactId);
        }
      }
    },
    setMessageIsRead(id) {
      this.$tim
        .setMessageRead({
          conversationID: id,
        })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
          this.$message.error(JSON.stringify(err));
        });
    },
    // 获取消息处理
    handlePullMessages(contact, next, instance) {
      if (!contact.id) {
        next([], true);
        return;
      }
      if (!contact.tim || !contact.tim.conversationID) {
        next([], true);
        return;
      }
      const options = {
        conversationID: contact.tim.conversationID,
        nextReqMessageID: this.nextReqMessageID,
      };
      this.$tim
        .getMessageList(options)
        .then((res) => {
          console.log("messageList: ", res.data.messageList);
          this.nextReqMessageID = res.data.nextReqMessageID;
          const messages = [];

          // 10位的秒时间戳转13位毫秒级时间戳
          const messageList = res.data.messageList.map((item) => {
            return {
              ...item,
              time: item.time,
            };
          });

          messageList.forEach((item) => {
            const msg = this.messageBuilder(item);
            if (!msg) return;
            messages.push(msg);
          });

          if (Object.keys(res.data).length === 0 || res.data.isCompleted) {
            //将第二个参数设为true，表示已到末尾，聊天窗口顶部会显示“暂无更多消息”，不然会一直转圈。
            next(messages, true);
          } else {
            next(messages, true);
          }

          this.$nextTick(() => {
            this.$refs.IMUI.messageViewToBottom();
          });
        })
        .catch((err) => {
          console.log(err);
          next([], true);
        });
    },
    receiveMessageHandle(timMessage) {
      const message = this.messageBuilder(timMessage);
      if (!message) return;
      this.receiveMessage(message);
    },
    // 接收消息重新渲染
    receiveMessage(message) {
      message.toContactId = message.tim.conversationID;
      const { IMUI } = this.$refs;
      const contact = IMUI.getCurrentContact();
      // 如果收到消息是当前窗口的聊天，需要将消息修改为已读
      if (contact.id === message.toContactId) {
        this.setMessageIsRead(message.toContactId);
        IMUI.appendMessage(message, true);
      }
    },
    // 将tim消息包装为imui可识别的消息
    messageBuilder(item) {
      return messageBuilder(item, this);
    },
    handleSend(message, next, file) {
      console.log(message, next, file);
      switch (message.type) {
        case "text":
          this.sendText(message, next, file);
          break;
        case "image":
          this.sendImage(message, next, file);
          break;
        case "file":
          this.sendFile(message, next, file);
          break;
      }
    },
    focusEditor() {
      const { IMUI } = this.$refs;
      const editorInput = IMUI.$el.querySelector(".lemon-editor__input");
      editorInput.focus();
    },
    sendText(message, next, file) {
      const { IMUI } = this.$refs;
      const currentContact = IMUI.currentContact;

      let to = "";
      if (currentContact.tim.type === TIM.TYPES.CONV_GROUP) {
        to = currentContact.tim.groupProfile.groupID;
      } else if (currentContact.tim.type === TIM.TYPES.CONV_C2C) {
        to = currentContact.tim.userProfile.userID;
      }

      const textMessage = this.$tim.createTextMessage({
        to: to,
        conversationType: currentContact.tim.type,
        payload: {
          text: message.content,
        },
      });
      this.focusEditor();
      this.$tim
        .sendMessage(textMessage)
        .then((imResponse) => {
          message.tim = imResponse.data.message;
          next();
        })
        .catch((imError) => {
          next({ status: "failed" });
        });
    },
    sendImage(message, next, file) {
      const { IMUI } = this.$refs;
      const currentContact = IMUI.currentContact;

      let to = "";
      if (currentContact.tim.type === TIM.TYPES.CONV_GROUP) {
        to = currentContact.tim.groupProfile.groupID;
      } else if (currentContact.tim.type === TIM.TYPES.CONV_C2C) {
        to = currentContact.tim.userProfile.userID;
      }

      const imageMessage = this.$tim.createImageMessage({
        to: to,
        conversationType: currentContact.tim.type,
        payload: {
          file: file,
        },
        cloudCustomData: file.name,
      });
      this.focusEditor();
      this.$tim
        .sendMessage(imageMessage)
        .then((imResponse) => {
          // 发送成功
          message.tim = imResponse.data.message;
          message.fileName = file.name;
          next();
        })
        .catch((imError) => {
          // 发送失败
          next({ status: "failed" });
        });
    },
    sendFile(message, next, file) {
      const { IMUI } = this.$refs;
      const currentContact = IMUI.currentContact;

      if (file.size > 5242880) {
        IMUI.removeMessage(message.id);
        return this.$message.error("上传的内容不能大于5MB！");
      }
      let to = "";
      if (currentContact.tim.type === TIM.TYPES.CONV_GROUP) {
        to = currentContact.tim.groupProfile.groupID;
      } else if (currentContact.tim.type === TIM.TYPES.CONV_C2C) {
        to = currentContact.tim.userProfile.userID;
      }

      const fileMessage = this.$tim.createFileMessage({
        to: to,
        conversationType: currentContact.tim.type,
        payload: {
          file: file,
        },
      });
      this.focusEditor();
      this.$tim
        .sendMessage(fileMessage)
        .then((imResponse) => {
          message.tim = imResponse.data.message;
          // 发送成功
          next();
        })
        .catch((imError) => {
          // 发送失败
          next({ status: "failed" });
        });
    },
    handleMessageClick(e, key, message, instance) {
      switch (message.type) {
        case "image":
          this.showImageViewer(
            message.tim.payload?.imageInfoArray?.[0].imageUrl
          );
          break;
        case "file":
          this.$download(message.content, message.fileName);
          break;
        default:
          break;
      }
    },
    contactTimeFormat(val) {
      return new Date(val).format("hh:mm");
    },
    messageTimeFormat(val) {
      return new Date(val).format("MM月dd日 hh:mm");
    },

    isSendHealth() {
      var user_id = "";
      // 群聊
      if (this.convType === this.groupType) {
        if (this.convPatients.length > 0) {
          user_id = this.convPatients[0].patient.user_id;
        }
        // 单聊
      } else if (this.convType === this.c2cType) {
        if (this.convPatient) {
          user_id = this.convPatient.patient.user_id;
        }
      }

      user_id += "";
      return user_id.length > 0;
    },

    // 发送健康评估
    sendHealthAssessment() {
      // this.$api.evaluationReport.delete(25)
      this.$confirm(`确定向患者发送健康评估链接吗？`, "发送健康评估链接", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          var user_id = "";
          // 群聊
          if (this.convType === this.groupType) {
            user_id = this.convPatients[0].patient.user_id;
            // 单聊
          } else if (this.convType === this.c2cType) {
            user_id = this.convPatient.patient.user_id;
          }
          if (user_id.length == 0) {
            return;
          }
          this.$api.patients
            .patchPatientRecordState(user_id, {
              patient_id: user_id,
              report_state: 1,
            })
            .then((res) => {
              this.sendCustomHandler(6);
              this.$message.success("发送成功");
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    getCategoryList() {
      this.$api.faqCategory
        .getList({})
        .then((res) => {
          this.problemType = res.data.results;
          if (this.problemType.length > 0) {
            this.activeName = this.problemType[0].id + "";
          }
          this.tableData = [];
          this.total = 0;
          this.pageSize = 10;
          this.page = 1;
          this.currentRow = null;
          this.sendQuestionVisible = true;
          this.getList();
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
  }, // methods end
  computed: {
    ...mapGetters([
      "userInfo",
      "convList",
      "groupList",
      "friendList",
      "receiveList",
      "timReady",
    ]),
    emojiData() {
      return emojiData;
    },
    leaderRoleName() {
      const lead = this.convPatient.team.members.find(ele => ele.id == this.convPatient.team.leader.id)
      if (lead) return lead.role_name
      return ""
    },
    userID() {
      return this.userInfo.im_profile.im_user_id;
    },
    // 聊天消息的右键菜单配置
    contextmenu() {
      return [
        {
          click: (e, instance, hide) => {
            const { IMUI, message } = instance;
            this.$tim
              .revokeMessage(message.tim)
              .then((res) => {
                const data = {
                  id: message.id,
                  type: "event",
                  //使用 jsx 时 click必须使用箭头函数（使上下文停留在vue内）
                  content: (
                    <div>
                      <span>
                        你撤回了一条消息{" "}
                        <span
                          v-show={message.type === "text"}
                          style="color:#409EFF;cursor:pointer"
                          content={message.content}
                          onClick={(e) => {
                            IMUI.setEditorValue(
                              e.target.getAttribute("content")
                            );
                          }}
                        >
                          重新编辑
                        </span>
                      </span>
                    </div>
                  ),
                  toContactId: message.toContactId,
                  sendTime: new Date().getTime(),
                };
                IMUI.updateMessage(data);
              })
              .catch((error) => {
                console.error(error);
                this.$message.error("无法撤回该条消息");
              });
            hide();
          },
          visible: (instance) => {
            return (
              instance.message.fromUser.id === this.user.id
              // && new Date().getTime() - instance.message.sendTime < 120000
            );
          },
          text: "撤回消息",
        },
        {
          visible: (instance) => {
            return instance.message.type === "image";
          },
          text: "下载图片",
          click: (e, instance, hide) => {
            const { message } = instance;
            const customData = message.tim.cloudCustomData;
            let fileName = "";
            if (customData !== "") {
              fileName = customData;
            } else {
              let ext = "";
              switch (message.tim.payload.imageFormat) {
                case 1:
                  ext = ".jpg";
                  break;
                case 2:
                  ext = ".jpg";
                  break;
                case 3:
                  ext = ".jpg";
                  break;
                case 4:
                  ext = ".jpg";
                  break;
                default:
                  ext = "";
              }
              // 图片格式 JPG = 1，GIF = 2，PNG = 3，BMP = 4，其他 = 255。
              fileName = message.sendTime + ext;
            }
            this.$download(
              message.tim.payload?.imageInfoArray?.[0].imageUrl,
              fileName
            );
            hide();
          },
        },
        {
          visible: (instance) => {
            return instance.message.type === "file";
          },
          text: "下载文件",
          click: (e, instance, hide) => {
            const { message } = instance;
            let url = "";
            switch (message.tim.type) {
              case TIM.TYPES.MSG_VIDEO:
                url = message.tim.payload.videoUrl;
                break;
              default:
                url = message.tim.payload.fileUrl;
            }
            this.$download(url, message.fileName);
            hide();
          },
        },
      ];
    },
    // 会话、联系人右键菜单配置
    contactContextmenu() {
      const { IMUI } = this.$refs;

      return [
        {
          text: "删除该聊天",
          click: (e, instance, hide) => {
            const { IMUI, contact } = instance;
            IMUI.removeContact(contact.id);
            this.$tim
              .deleteConversation(contact.tim.conversationID)
              .then(() => {})
              .catch(() => {});
            hide();
          },
          visible: (instance) => {
            return this.menuActiveName === this.menuMessages;
          },
        },
        {
          text: "解散群聊",
          icon: "el-icon-delete",
          color: "red",
          click: (e, instance, hide) => {
            // 群主不能解散好友工作群
            const { IMUI, contact } = instance;
            console.log(contact);
            hide();
            this.$confirm("确定解散该群聊吗？", "提示", {
              confirmButtonText: "解散",
              cancelButtonText: "取消",
              type: "error",
            })
              .then(() => {
                this.$tim
                  .dismissGroup(contact.tim.groupID)
                  // this.$tim.quitGroup(contact.id)
                  .then(() => {
                    this.initContacts();
                    this.$message({
                      type: "success",
                      message: "解散群聊成功!",
                    });
                  })
                  .catch((err) => {
                    console.log(JSON.stringify(err));
                    this.$message.error(err.message);
                  });
              })
              .catch(() => {});
          },
          visible: (instance) => {
            const { contact } = instance;
            if (
              contact.index !== "群聊" ||
              this.menuActiveName !== this.menuContacts
            ) {
              return false;
            }
            return true;
            // return contact?.tim?.selfInfo?.role === 'Owner' && contact?.tim?.selfInfo?.userID === this.userID;
          },
        },
        // {
        //   text: '退出群聊',
        //   icon: 'el-icon-delete',
        //   color: 'red',
        //   click: (e, instance, hide) => {
        //     const { IMUI, contact } = instance
        //     console.log(contact)
        //     hide()
        //     this.$confirm('确定退出该群聊吗？', '提示', {
        //       confirmButtonText: '退出',
        //       cancelButtonText: '取消',
        //       type: 'error'
        //     })
        //       .then(() => {
        //         this.$tim.quitGroup(contact.id)
        //           .then(() => {
        //             this.$message({
        //               type: 'success',
        //               message: '退出群聊成功!'
        //             })
        //           })
        //           .catch((err) => {
        //             console.log(JSON.stringify(err))
        //             this.$message.error(err.message)
        //             // if (err.code === 10009) {
        //             //   this.$message.error('禁止所有者退出群组')
        //             // } else {
        //             //   this.$message.error(JSON.stringify(err))
        //             // }
        //           })
        //       })
        //       .catch(() => {
        //       })
        //   },
        //   visible: instance => {
        //     const { contact } = instance
        //     if (contact.index !== '群聊' || this.menuActiveName !== this.menuContacts) {
        //       return false
        //     }
        //     // if (contact?.tim?.selfInfo?.role === 'Owner' && contact?.tim?.selfInfo?.userID === this.userID) {
        //     //   return false
        //     // }
        //     return true
        //   }
        // },
      ];
    },
    imuiTools() {
      if (this.convType === this.c2cType) {
        return [
          {
            name: "emoji",
          },
          // {
          //   name: 'uploadFile',
          //   title: "发送文件",
          // },
          {
            name: "uploadImage",
          },
          {
            name: "article",
            title: "发送文章",
            click: () => {
              this.sendArticleVisible = true;
              this.sendCustomSelection = [];
              this.$nextTick(() => {
                this.getSendArticle();
              });
            },
            render: () => {
              return (
                <i
                  class="el-icon-tickets"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "solution",
            title: "发送方案",
            click: () => {
              this.sendPlanVisible = true;
              this.sendCustomSelection = [];
              this.$nextTick(() => {
                this.getSendPlan();
              });
            },
            render: () => {
              if (this.convType === this.c2cType) {
                return (
                  <i
                    class="el-icon-news"
                    style="font-size: 20px; vertical-align: middle;"
                  ></i>
                );
              } else {
                return <div></div>;
              }
            },
          },
          {
            name: "scale",
            title: "发送量表",
            click: () => {
              this.sendScaleVisible = true;
              this.sendCustomSelection = [];
              this.$nextTick(() => {
                this.getSendScale();
              });
            },
            render: () => {
              return (
                <i
                  class="el-icon-edit"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "kcard",
            title: "发送知识卡",
            click: () => {
              this.sendKCardVisible = true;
              this.sendCustomSelection = [];
              this.$nextTick(() => {
                this.getSendKCard();
              });
            },
            render: () => {
              return (
                <i
                  class="el-icon-postcard"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "sendHealthAssessment",
            title: "发送健康评估链接",
            click: () => {
              var canSend = false;
              // 群聊
              if (this.convType === this.groupType) {
                canSend = this.convPatients[0].im_group_id.length > 0;
                // 单聊
              } else if (this.convType === this.c2cType) {
                canSend = this.convPatient.patient.im_user_id.length > 0;
              }
              if (canSend) {
                this.sendHealthAssessment();
              }
            },
            render: () => {
              if (this.isSendHealth()) {
                return (
                  <i
                    class="el-icon-link"
                    style="font-size: 20px; vertical-align: middle;"
                  ></i>
                );
              } else {
                return <div></div>;
              }
            },
          },
          {
            name: "sendTemplateMsg",
            title: "发送推送消息",
            click: () => {
              this.sendTemplateMsgVisible = true;
            },
            render: () => {
              return (
                <i
                  class="el-icon-message"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "sendQuestion",
            title: "发送常见问题",
            isRight: true,
            click: () => {
              this.getCategoryList();
            },
            render: () => {
              return (
                <i
                  class="el-icon-s-opportunity"
                  style="font-size: 20px; vertical-align: middle; color: orange"
                ></i>
              );
            },
          },
        ];
      } else {
        return [
          {
            name: "emoji",
          },
          // {
          //   name: 'uploadFile',
          //   title: "发送文件",
          // },
          {
            name: "uploadImage",
          },
          {
            name: "article",
            title: "发送文章",
            click: () => {
              this.sendArticleVisible = true;
              this.sendCustomSelection = [];
              this.$nextTick(() => {
                this.getSendArticle();
              });
            },
            render: () => {
              return (
                <i
                  class="el-icon-tickets"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "scale",
            title: "发送量表",
            click: () => {
              this.sendScaleVisible = true;
              this.sendCustomSelection = [];
              this.$nextTick(() => {
                this.getSendScale();
              });
            },
            render: () => {
              return (
                <i
                  class="el-icon-edit"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "kcard",
            title: "发送知识卡",
            click: () => {
              this.sendKCardVisible = true;
              this.sendCustomSelection = [];
              this.$nextTick(() => {
                this.getSendKCard();
              });
            },
            render: () => {
              return (
                <i
                  class="el-icon-postcard"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "sendTemplateMsg",
            title: "发送推送消息",
            click: () => {
              this.sendTemplateMsgVisible = true;
            },
            render: () => {
              return (
                <i
                  class="el-icon-message"
                  style="font-size: 20px; vertical-align: middle;"
                ></i>
              );
            },
          },
          {
            name: "sendQuestion",
            title: "发送常见问题",
            isRight: true,
            click: () => {
              this.getCategoryList();
            },
            render: () => {
              return (
                <i
                  class="el-icon-s-opportunity"
                  style="font-size: 20px; vertical-align: middle; color: orange"
                ></i>
              );
            },
          },
        ];
      }
    },
    menuMessages() {
      return "messages";
    },
    menuContacts() {
      return "contacts";
    },

    /** 展示患者信息的逻辑
     * 点击的我的患者，就是my_project_patients列表里的患者，右侧显示患者信息
     * 点击其他人，因为无法判断他是患者还是医生，不显示右侧信息
     * 点击群聊，群成员中包含我的患者，右侧显示患者信息
     * 点击群聊，群成员中不包含我的患者，不显示右侧信息
     */
    // 当前点击的会话类型
    convType() {
      console.log("====================================");
      console.log(this.currentContact);
      console.log("====================================");
      if (this.currentContact && this.currentContact.tim) {
        return this.currentContact.tim.type;
      } else if (this.currentContact && this.currentContact.type) {
        return this.currentContact.type;
      } else {
        return null;
      }
    },
    groupType() {
      return TIM.TYPES.CONV_GROUP;
    },
    c2cType() {
      return TIM.TYPES.CONV_C2C;
    },
    // 当前点击的患者
    convPatient() {
      if (
        this.convType === this.groupType ||
        !this.convPatientInfo ||
        !this.currentContact ||
        !this.currentContact.tim
      ) {
        return null;
      }
      return this.convPatientInfo;
    },
    // 当前点击的群组中我的患者
    convPatients() {
      const patients = [];
      if (
        this.convType === this.c2cType ||
        this.groupMemberList.length === 0 ||
        this.convPatientsInfo.length === 0
      ) {
        return patients;
      } else {
        this.convPatientsInfo.forEach((patient) => {
          this.groupMemberList.forEach((member) => {
            if (member.userID === patient.patient.im_user_id) {
              patients.push(patient);
            }
          });
        });
      }
      return patients;
    },
    isAI() {
      if (this.currentContact) {
      }
      return false;
    },
  }, // computed end
};
</script>

<style scoped lang="less">
.panel {
  .chat {
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
  }

  :deep(.card) {
    margin-top: 32px;
    height: calc(100% - 32px - 32px);
    box-shadow: 0 10px 20px 0 rgb(0 0 0 / 10%);

    .el-card__body {
      height: 100% !important;
      padding: 0;
    }
  }
}

.list-toolbar {
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: flex-end;

  .i-box {
    width: 40px;
    height: 40px;
    line-height: 40px;
    float: right;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      font-size: 18px;
      font-weight: bold;
    }
  }
}

.chat {
  :deep(.lemon-menu .lemon-avatar img),
  :deep(.lemon-message .lemon-avatar img) {
    background-color: #fff;
  }

  :deep(.lemon-avatar) {
    img {
      background-color: #fff;
    }
  }

  :deep(.lemon-menu) {
    background-color: #5b607f;

    .lemon-menu__item {
      color: #dadada;
    }

    .lemon-menu__item--active {
      color: @primaryColor;
    }
  }
}

.send-card-dialog {
  :deep(.el-dialog) {
    width: 680px;
    height: 550px;
  }
}

.message-header {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;

  @nameColor: #344563;

  .main-title {
    font-size: 20px;
    font-weight: 500;
    color: @nameColor;
  }

  .project-name,
  .team-name {
    font-size: 16px;
    margin-left: 20px;
    font-weight: 500;
    color: @nameColor;
  }
}

.message-side-box {
  width: 340px;
  height: 100%;
  box-sizing: border-box;
  border-left: 1px solid #ccc;
  padding: 10px 10px 0 10px;
  color: #344563;
  overflow: hidden auto;

  .side-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .side-user-info {
    display: flex;
    align-items: center;
    margin-left: 10px;

    .avatar {
      margin-right: 10px;
    }

    .info {
    }
  }

  .card-list {
    margin: 10px 0;

    .m-card {
      margin: 0 auto;
      width: 200px;
      height: 120px;
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
    }

    .link {
      display: block;
      margin: 5px auto;
      width: 75px;
    }
  }

  .remark {
    margin-bottom: 20px;
    font-size: 12px;

    .memo-content {
      color: #666;
    }

    .memo-creator {
      margin-left: 3px;
      color: #bcbdbe;
    }
  }

  .doctor {
    .side-user-info {
      margin-bottom: 10px;
    }

    .role {
      margin-left: 10px;
      font-size: 12px;
    }
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

.message-side-box.conv-group {
  .carousel {
    height: 100%;

    :deep(.el-carousel__container) {
      height: 100%;
    }

    :deep(.el-carousel__arrow) {
      top: 60%;
    }
  }

  .memo-list {
    .memo-item {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      cursor: default;

      .el-tooltip.item {
        height: auto;
      }

      .content {
        width: 50%;
        .text-ellipsis();
      }

      .creator {
        width: 50%;
        display: flex;
        flex-direction: column;

        .name {
          .text-ellipsis();
          color: #bcbdbe;
          text-align: right;
        }

        .time {
          .text-ellipsis();
          text-align: right;
          color: #bcbdbe;
        }
      }
    }
  }
}

.hide-carousel-arrow {
  :deep(.el-carousel__arrow) {
    display: none;
  }
}

.create-group-dialog {
  :deep(.el-dialog) {
    margin-top: 5vh !important;
    margin-bottom: 0 !important;
    width: 880px;
    height: 90vh;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
      color: #5a6d86 !important;

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

.create-group-dialog {
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

  .member-list {
    padding-top: 10px;
    height: 300px;
    overflow: hidden auto;
    //background-color: #efefef;
  }

  .member-wrap {
  }

  .user-wrap {
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
}

.selected-wrap {
  height: 826px;
  overflow: hidden auto;
  border: 1px solid #eee;
  border-radius: 6px;
}

.question-dialog {
  :deep(.el-dialog) {
    height: 94vh;

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
