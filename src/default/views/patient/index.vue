<template>
  <div class="panel scroll">
    <div
      class="card header-project"
      style="margin-bottom: 4px; padding-top: 20px; padding-bottom: 12px"
    >
      <div class="h_100 flex justify_start align_center">
        <div
          v-for="(item, index) in projectCardList"
          :key="item.id"
          class="project-card"
          :class="{ active: projectCardActive === index }"
          @click="
            projectPatientsPage = 1
            setProjectCardActive(index)
          "
        >
          <div class="icon">
            <icon-box
              v-if="item.product === $enum.PRODUCT.WEI_ZHUAN_LIU"
              :icon-name="projectCardActive === index ? 'type_weizhuanliu_active' : 'type_weizhuanliu'"
              w="23"
              h="23"
            ></icon-box>
            <icon-box
              v-else-if="item.product === $enum.PRODUCT.SHUI_QIU"
              :icon-name="projectCardActive === index ? 'type_shuiqiu_active' : 'type_shuiqiu'"
              w="23"
              h="23"
            ></icon-box>
            <icon-box
              v-else
              :icon-name="projectCardActive === index ? 'type_weizhuanliu_active' : 'type_weizhuanliu'"
              w="23"
              h="23"
            ></icon-box>
          </div>
          <div class="product">{{ $dict.product.getLabel(item.product) }}</div>
          <div class="type">{{ $dict.projectType.getLabel(item.project_type) }}</div>
          <div
            class="name"
            :title="item.name"
          >{{ item.name }}</div>
          <div class="line"></div>
        </div>
      </div>
      <el-pagination
        class="card-pagination"
        small
        background
        layout="prev, pager, next"
        :page-size="5"
        :current-page="projectCardPage"
        :total="projectCardTotal"
        @current-change="currentPageChange"
        v-show="projectCardTotal > 5"
      > </el-pagination>
    </div>

    <el-breadcrumb
      separator="-"
      class="breadcrumb-reset"
      style="margin-bottom: 4px;"
    >
      <el-breadcrumb-item>
        <icon-box
          icon-name="menu_wdhz"
          w="20"
          box-h="38"
          box-w="20"
          style="margin-right: 10px"
        ></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div
      class="card body-patient"
      style="margin-top: 0; padding-top: 20px !important;"
    >
      <div
        class="title-info flex mb_14"
        v-if="currentProject.id"
      >
        <div class="project-name">{{ currentProject.name }}</div>
        <el-tag>{{ $dict.projectType.getLabel(currentProject.project_type) }}</el-tag>
        <m-tag
          circle
          :status="currentProject.status"
          style="margin-left: 6px; border-radius: 13px !important"
        ></m-tag>
        <el-tag style="margin-left: 6px">第{{ startDay() }}天</el-tag>
        <el-tag
          style="margin-left: 6px"
          :disable-transitions="true"
          v-for="stage in currentProject.stage"
          :key="stage"
        >
          {{ stage }}
        </el-tag>
      </div>
      <div
        class="team-list flex"
        v-if="currentProject.team"
      >
        <div
          class="team-name flex mr_20"
          v-for="team in [currentProject.teams]"
          :key="team.id"
        >
          <template v-if="teamHasMe(team.members)">
            <div class="avatar">
              <el-avatar
                fit="cover"
                :size="20"
                :src="team.avatar ? team.avatar : require('@/common/assets/bg/default_team_avatar.png')"
              ></el-avatar>
            </div>
            <div class="name">{{ team.name }}</div>
            <icon-box
              icon-name="tuanduivibiao"
              w="10"
              h="11"
              box-h="20"
            ></icon-box>
          </template>
        </div>
      </div>

      <div class="stat-info flex">
        <div class="stat-card fwhz">
          <div class="bg"></div>
          <div class="icon">
            <icon-box
              icon-name="lj_fwhz"
              w="31"
              h="35"
            ></icon-box>
          </div>
          <div class="desc">累计服务患者</div>
          <div class="count">{{ projectPatientStats.service_patient }}</div>

        </div>
        <div class="stat-card tzdk">
          <div class="bg"></div>
          <div class="icon">
            <icon-box
              icon-name="lj_tzdk"
              w="31"
              h="35"
            ></icon-box>
          </div>
          <div class="desc">累计体重打卡</div>
          <div class="count">{{ projectPatientStats.weight_record }}</div>
        </div>
        <div class="stat-card ysdk">
          <div class="bg"></div>
          <div class="icon">
            <icon-box
              icon-name="lj_ysdk"
              w="31"
              h="35"
            ></icon-box>
          </div>
          <div class="desc">累计饮食打卡</div>
          <div class="count">{{ projectPatientStats.diet_record }}</div>
        </div>
        <div class="stat-card yddk">
          <div class="bg"></div>
          <div class="icon">
            <icon-box
              icon-name="lj_yddk"
              w="31"
              h="35"
            ></icon-box>
          </div>
          <div class="desc">累计运动打卡</div>
          <div class="count">{{ projectPatientStats.exercise_record }}</div>
        </div>
        <div class="stat-card zx">
          <div class="bg"></div>
          <div class="icon">
            <icon-box
              icon-name="lj_zxsc"
              w="31"
              h="35"
            ></icon-box>
          </div>
          <div class="desc">累计在线时长</div>
          <div class="count">{{ projectPatientStats.online_hours }}</div>
        </div>
      </div>

      <el-form
        class="form-box"
        :model="patientSearchForm"
        ref="form"
        label-position="top"
      >
        <div class="search-bar mt_14">
          <el-row
            class="search-bar-row"
            type="flex"
            justify="start"
            align="middle"
            :gutter="20"
            style="width: 100%; height: 100%"
          >
            <el-col
              class="search-bar-col"
              :span="5"
            >
              <el-row class="label-t">患者姓名</el-row>
              <el-row>
                <el-form-item prop="stage">
                  <el-input
                    v-model="patientSearchForm.name"
                    clearable
                    placeholder="请输入患者姓名"
                  ></el-input>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col
              class="search-bar-col"
              :span="6"
            >
              <el-row class="label-t">选择加入时间</el-row>
              <el-row>
                <el-form-item prop="stage">
                  <el-date-picker
                    type="datetime"
                    v-model="patientSearchForm.joined_at"
                    placeholder="请选择加入时间"
                  ></el-date-picker>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col
              class="search-bar-col"
              :span="6"
            >
              <el-row class="label-t">患者标签</el-row>
              <el-row>
                <el-form-item prop="stage">
                  <el-select
                    class="patient-tagss"
                    v-model="patientSearchForm.tags__in"
                    multiple
                    filterable
                    collapse-tags
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in tagss"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    > </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            </el-col>
            <el-col
              class="search-bar-col"
              :span="13"
            >
              <el-row class="label-t">&nbsp;</el-row>
              <el-row>
                <m-button
                  icon="el-icon-search"
                  h="40px"
                  w="100px"
                  @click="
                    projectPatientsPage = 1
                    getProjectPatients()
                  "
                >搜 索</m-button>
                <m-button
                  v-auth="'patient.export'"
                  :icon="exportBtnLoading ? 'el-icon-loading' : 'el-icon-document'"
                  h="40px"
                  @click="exportPatientExcel"
                >导出健康数据 </m-button>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <m-table
        ref="projectPatientTable"
        class="m-table"
        :data="projectPatients"
        :total="projectPatientTotal"
        :page-sizes="[5, 10, 15, 20]"
        :page-size.sync="projectPatientPageSize"
        :current-page.sync="projectPatientsPage"
        :get-data-func="getProjectPatients"
        @selection-change="patientSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        > </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="patient.user_id"
          label="患者ID"
        > </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="patient.name"
          label="昵称"
        > </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="patient.name"
          label="姓名"
          min-width="100"
        >
          <template v-slot="scope">
            <el-link @click="toPatientDetail(scope.row)">{{ scope.row.patient.real_name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="性别"
          width="80"
        >
          <template v-slot="scope">
            {{ $dict.sex.getLabel(scope.row.patient.sex) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="年龄"
          min-width="80"
        >
          <template v-slot="scope">
            {{ scope.row.patient.user_profile.birthday | calcAge }}
          </template>
        </el-table-column>
        <el-table-column
          label="服务状态"
          min-width="80"
        >
          <template v-slot="scope">
            {{ $dict.patientServiceStatus.getLabel(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="加入时间"
          width="120"
        >
          <template v-slot="scope">
            {{ scope.row.joined_at | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="stage"
          label="项目阶段"
          min-width="80"
        > </el-table-column>
        <el-table-column
          align="center"
          width="100"
          v-auth="'patient.tag'"
        >
          <template v-slot:header>
            <el-tag class="tag">标签</el-tag>
          </template>
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                icon-name="table_add"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="添加"
                @click.native="addPatientTags(scope.row)"
              ></icon-box>
              <icon-box
                icon-name="table_view"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="查看"
                @click.native="viewPatientTags(scope.row)"
              ></icon-box>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
        >
          <template v-slot:header>
            <el-tag class="tag">服务备注</el-tag>
          </template>
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                v-auth="'patient.serviceRemarks'"
                icon-name="table_add"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="添加"
                @click.native="addServiceRemark(scope.row)"
              ></icon-box>
              <icon-box
                v-auth="'patient.serviceRemarks'"
                icon-name="table_view"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="查看"
                @click.native="viewServiceRemark(scope.row)"
              ></icon-box>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
        >
          <template v-slot:header>
            <el-tag class="tag">健康评估</el-tag>
          </template>
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                v-auth="'patient.healthAssessmentInfo'"
                icon-name="table_add"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="添加"
                @click.native="sendHealthAssessment(scope.row)"
              ></icon-box>
              <icon-box
                v-auth="'patient.healthAssessmentInfo'"
                icon-name="table_view"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="查看"
                @click.native="viewHealthAssessment(scope.row)"
              ></icon-box>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="120"
        >
          <template v-slot:header>
            <el-tag
              style="width: 100px"
              class="tag"
            >运动开始日期</el-tag>
          </template>
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                v-auth="'patient.startDate'"
                icon-name="table_add"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="添加"
                @click.native="addStartTime(scope.row)"
              ></icon-box>
              <icon-box
                v-auth="'patient.startDate'"
                icon-name="table_view"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="查看"
                @click.native="viewStartTime(scope.row)"
              ></icon-box>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
        >
          <template v-slot:header>
            <el-tag class="tag">随访</el-tag>
          </template>
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                v-auth="'patient.followUp'"
                icon-name="table_add"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="添加"
                @click.native="addFollowUp(scope.row)"
              ></icon-box>
              <icon-box
                v-auth="'patient.followUp'"
                icon-name="table_view"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="查看"
                @click.native="viewFollowUp(scope.row)"
              ></icon-box>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
        >
          <template v-slot:header>
            <el-tag class="tag">方案</el-tag>
          </template>
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                v-auth="'patient.scheme'"
                icon-name="table_add"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="添加"
                @click.native="addSolutions(scope.row)"
              ></icon-box>
              <icon-box
                v-auth="'patient.scheme'"
                icon-name="table_view"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="查看"
                @click.native="viewSolution(scope.row)"
              ></icon-box>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
        >
          <template v-slot:header>
            <el-tag class="tag">配餐</el-tag>
          </template>
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box
                v-auth="'patient.catering'"
                icon-name="table_add"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="添加"
                @click.native="addPlanningMeals(scope.row)"
              ></icon-box>
              <icon-box
                v-auth="'patient.catering'"
                icon-name="table_view"
                w="39"
                h="39"
                box-w="39"
                style="cursor: pointer"
                title="查看"
                @click.native="viewPlanningMeals(scope.row)"
              ></icon-box>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          min-width="240"
        >
          <template v-slot="scope">
            <div class="flex justify_start">
              <el-link
                v-auth="'patient.unallotment'"
                @click="unAssigned(scope.row)"
              >取消分配</el-link>
              <span class="inline_block mr_6"></span>
              <el-link
                v-auth="'patient.continuationService'"
                @click="continueService(scope.row)"
              >延续服务</el-link>
              <span class="inline_block mr_6"></span>
              <el-link
                v-auth="'patient.endService'"
                @click="endService(scope.row)"
              >结束服务</el-link>
              <span class="inline_block mr_6"></span>
              <el-link @click="toPatientDetail(scope.row)">详情</el-link>
            </div>
          </template>
        </el-table-column>
      </m-table>
    </div>

    <el-dialog
      title="个人标签"
      :visible.sync="addPatientTagsDialogVisible"
      :modal="true"
      class="patient-tags"
    >
      <!-- <el-autocomplete 
        class="inline-input mr_10" 
        v-model="tagInputValue"  
        :fetch-suggestions="tagQuerySearch" 
        placeholder="" 
        @select="patientTagSelect">
      </el-autocomplete> -->
      <el-cascader
        filterable
        :show-all-levels="false"
        v-model="tagValue"
        :options="tagCategory"
        :props="tagCategoryProps"
        @change="tagHandleChange"
        ref="tagCascader"
        popper-class="disableFirstLevel"
      >
      </el-cascader>
      <el-tag
        v-for="tag in patientTags"
        :key="tag.id"
        :disable-transitions="true"
        :closable="tag.attribute != 'Auto'"
        @close="handleClose(tag)"
      >
        {{ tag.name }}
      </el-tag>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="addPatientTagsDialogVisible = false"
        >取 消</m-button>
        <m-button
          :loading="tagSubmitLoading"
          @click="submitPatientTags"
        >确 认</m-button>
      </span>
    </el-dialog>

    <!-- 查看个人标签-->
    <el-dialog
      title="个人标签"
      :visible.sync="viewPatientTagsDialogVisible"
      :modal="true"
      class="patient-tags"
    >
      <div>
        <el-tag
          v-for="tag in patientTags"
          :key="tag.id"
          :disable-transitions="true"
        >
          {{ tag.name }}
        </el-tag>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="viewPatientTagsDialogVisible = false"
        >关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加服务备注"
      :visible.sync="addServiceRemarkDialogVisible"
      :modal="true"
      class="service-remark-dialog"
    >
      <el-table
        ref="addRemarkTableRef"
        :data="patientMemos"
        border
        size="small"
        :header-cell-style="tableHeaderStyle"
        height="201"
        empty-text=" "
      >
        <el-table-column
          show-overflow-tooltip
          prop="content"
          label="备注内容"
          align="left"
          min-width="300"
        > </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="creator.name"
          label="提交人"
          align="left"
          min-width="140"
        > </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="created_at"
          label="提交时间"
          align="left"
          min-width="160"
        >
          <template v-slot="scope">
            {{ scope.row.created_at | dateFormat }}
          </template>
        </el-table-column>
      </el-table>
      <el-input
        class="mt_20"
        type="textarea"
        :rows="4"
        resize="none"
        placeholder="请输入内容"
        v-model="remarkContent"
      > </el-input>
      <el-button
        size="small"
        class="submit-btn"
        @click="addRemark"
      >发表</el-button>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="addServiceRemarkDialogVisible = false"
        >关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog
      title="服务备注"
      :visible.sync="viewServiceRemarkDialogVisible"
      :modal="true"
      class="service-remark-dialog"
    >
      <el-table
        ref="remarkTableRef"
        :data="patientMemos"
        border
        size="small"
        :header-cell-style="tableHeaderStyle"
        height="321"
        empty-text=" "
      >
        <el-table-column
          show-overflow-tooltip
          prop="content"
          label="备注内容"
          align="left"
          min-width="300"
        > </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="creator.name"
          label="提交人"
          align="left"
          min-width="140"
        > </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="created_at"
          label="提交时间"
          align="left"
          min-width="160"
        >
          <template v-slot="scope">
            {{ scope.row.created_at | dateFormat }}
          </template>
        </el-table-column>
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="viewServiceRemarkDialogVisible = false"
        >关 闭</m-button>
      </span>
    </el-dialog>

    <!-- 查看健康评估发送状态-->
    <el-dialog
      title="健康评估状态"
      :visible.sync="viewHealthAssessmentDialogVisible"
      :modal="true"
      class="patient-tags"
    >
      <div
        v-if="report_state != 3"
        class="health-assessment"
      >
        <div>{{ reportState }}</div>
      </div>
      <div
        v-else
        class="health-assessment"
      >
        <div>营养处方：{{ nutritionState }}</div>
        <div>运动处方：{{ exerciseState }}</div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="viewHealthAssessmentDialogVisible = false"
        >关 闭</m-button>
      </span>
    </el-dialog>

    <!-- 查看运动开始日期-->
    <el-dialog
      title="运动开始日期"
      :visible.sync="viewStartTimeDialogVisible"
      :modal="true"
    >
      <div
        class="add-start-time"
        v-if="isAddStartTime"
      >
        <span>请设置患者运动开始日期</span>
        <div>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="startTime"
            type="date"
            placeholder="年/月/日"
          > </el-date-picker>
        </div>
      </div>
      <div
        v-else
        class="start-time"
      >
        <div>{{ startTime ? startTime : '暂未设置' }}</div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <m-button
          type="default"
          @click="viewStartTimeDialogVisible = false"
        >关 闭</m-button>
        <m-button
          v-if="isAddStartTime"
          @click="setStartTime"
        >确 认</m-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import baseUrl from "@/common/request/base";

export default {
  name: "Patient",
  data() {
    return {
      form: {
        name: "",
        joinTime: "",
      },
      rules: {},
      projectPatients: [],
      projectPatientTotal: 0,
      projectPatientPageSize: 5,
      projectPatientsPage: 1,

      projectCardActive: 0,
      projectCardList: [],
      projectCardTotal: 0,
      projectCardPage: 1,

      activeProject: {},

      assignedDialogVisible: false,
      unassignedDialogVisible: false,

      patientTags: [],
      category: [],
      tags: [],
      tagInputValue: "",
      addPatientTagsDialogVisible: false,
      viewPatientTagsDialogVisible: false,
      tagSubmitLoading: false,

      patientMemos: [],
      remarkContent: "",
      addServiceRemarkDialogVisible: false,
      viewServiceRemarkDialogVisible: false,

      patientSearchForm: {
        name: "",
        joined_at: "",
        tags__in: [],
      },

      projectPatientStats: {},

      currentProjectPatient: {},

      exportBtnLoading: false,
      patientSelection: [],

      // 健康评估状态
      viewHealthAssessmentDialogVisible: false,
      exercise_state: 0, // 0 无需开通  1 未开  2 已开
      nutrition_state: 1, // 1 未开  2 已开
      report_state: 0,
      // 开始运动日期
      viewStartTimeDialogVisible: false,
      // 是添加还是查看
      isAddStartTime: true,
      // 运动开始日期
      startTime: "",
      tagss: [],

      tagCategory: [],
      tagCategoryProps: {
        // value: "id",
        // label: "name",
        multiple: true,
        // lazy: true,
        // lazyLoad (node, resolve) {
        //     if (node.level == 1) {
        //       that.getTags(node.value, resolve)
        //     } else {
        //       resolve([])
        //     }
        // }
      },
      tagValue: [],
    };
  },
  watch: {
    addPatientTagsDialogVisible(visible) {
      this.tagSubmitLoading = false;
      if (!visible) {
        this.patientTags = [];
        this.currentProjectPatient = {};
      }
    },
    viewPatientTagsDialogVisible(visible) {
      if (!visible) {
        this.patientTags = [];
      }
    },
    addServiceRemarkDialogVisible(visible) {
      this.remarkContent = "";
      if (visible) {
      } else {
        this.patientMemos = [];
        this.currentProjectPatient = {};
      }
    },
    viewServiceRemarkDialogVisible(visible) {
      if (!visible) {
        this.patientMemos = [];
      }
    },
  },
  computed: {
    ...mapGetters(["ppInfo", "userInfo"]),
    currentProject() {
      if (this.projectCardList.length === 0) {
        return {};
      } else {
        return this.projectCardList[this.projectCardActive];
      }
    },
    tableHeaderStyle() {
      return {
        backgroundColor: "#FAFAFA",
        fontSize: "14px",
        fontWeight: 400,
        color: "#5A6D86",
      };
    },
    exerciseState() {
      if (this.exercise_state == 0) return "无需开具";
      else if (this.exercise_state == 1) return "未开";
      else return "已开";
    },
    nutritionState() {
      if (this.nutrition_state == 1) return "未开";
      else return "已开";
    },
    reportState() {
      if (this.report_state == 0) {
        return "待评估";
      } else if (this.report_state == 1) {
        return "待填写问卷";
      } else if (this.report_state == 2) {
        return "问卷填写中";
      }
      return "";
    },
  },
  mounted() {
    this.getProjectList();
    this.getTagList();
  },
  methods: {
    ...mapActions({
      setPpInfo: "ppInfo/setPpInfo",
    }),
    getProjectList() {
      this.$api.project
        .getList({
          page: this.projectCardPage,
          page_size: 5,
          ordering: "id",
          team_member: this.userInfo.id,
          dpt: this.userInfo.selectedDepartment.id,
          org: this.userInfo.selectedOrganization.id,
        })
        .then((res) => {
          this.projectCardList = res.data.results;
          this.projectCardTotal = res.data.count;
          this.getProjectPatients();
          this.getProjectStat();
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getProjectPatients() {
      if (!this.currentProject.id) return;
      const { projectPatientTable } = this.$refs;
      if (projectPatientTable) projectPatientTable.loadStart();
      this.$api.myProjectPatient
        .getList({
          project: this.currentProject.id,
          page: this.projectPatientsPage,
          page_size: this.projectPatientPageSize,
          ordering: "id",
          search: this.patientSearchForm.name,
          joined_at__gt: this.patientSearchForm.joined_at,
          tags__in: this.patientSearchForm.tags__in.join(","),
        })
        .then((res) => {
          this.projectPatients = res.data.results;
          this.projectPatientTotal = res.data.count;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getProjectStat() {
      if (!this.currentProject.id) return;
      this.$api.myProjectPatient
        .getStat({
          project_id: this.currentProject.id,
        })
        .then((res) => {
          this.projectPatientStats = res.data;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    tagHandleChange(node) {
      const autos = this.patientTags.filter((ele) => ele.attribute == "Auto");
      const tags = this.$refs.tagCascader.getCheckedNodes(true);
      this.patientTags = autos.concat(tags.map((ele) => ele.data));
    },
    getCategoryList() {
      this.$api.tagCategories
        .getList({
          page: 1,
          page_size: 99999,
        })
        .then((res) => {
          this.tagCategory = res.data.results.map((ele, index) => {
            return {
              ...ele,
              value: ele.id,
              label: ele.name,
              children: [],
            };
          });
          this.$api.tag
            .getList({
              ordering: "id",
              page: 1,
              page_size: 99999,
              attribute__in: "Private, Public",
            })
            .then((res) => {
              res.data.results.forEach((ele) => {
                const idx = this.tagCategory.find(
                  (ite) => ite.id == ele.category.id
                );
                if (idx) {
                  idx.children.push({
                    ...ele,
                    value: ele.id,
                    label: ele.name,
                    leaf: "leaf",
                  });
                }
              });
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getPatientMemos() {
      this.$api.ppMemos
        .getList({
          project_patient: this.currentProjectPatient.id,
        })
        .then((res) => {
          this.patientMemos = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    currentPageChange(val) {
      this.projectCardPage = val;
      this.projectCardActive = 0;
      this.getProjectList();
    },
    hideCalorieCalc() {
      this.calorieCalcVisible = false;
    },
    leavePage() {
      if (this.type === "create") {
        this.$router.push("/project");
      } else {
        this.$router.push(`project/project_detail/${this.projectInfo.id}`);
      }
    },
    handleClose(tag) {
      const index = this.patientTags.map((item) => item.id).indexOf(tag.id);
      this.patientTags.splice(index, 1);
    },
    setProjectCardActive(index) {
      if (this.projectCardActive !== index) {
        this.projectCardActive = index;
        this.getProjectPatients();
        this.getProjectStat();
      }
    },
    showCalorieCalc() {
      this.calorieCalcVisible = true;
    },
    addRemark() {
      if (this.remarkContent.trim() === "") {
        return this.$message.error("内容不能为空");
      }
      this.$api.ppMemos
        .create({
          project_patient: this.currentProjectPatient.id,
          content: this.remarkContent,
        })
        .then((res) => {
          this.$message.success("添加服务备注成功");
          this.remarkContent = "";
          this.getPatientMemos();
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    addPatientTags(row) {
      this.currentProjectPatient = row;
      this.setPpInfo(row);
      this.patientTags = [].concat(row.patient.tags);
      this.getCategoryList();
      this.addPatientTagsDialogVisible = true;

      const notAutos = this.patientTags.filter(
        (ele) => ele.attribute != "Auto"
      );
      this.tagValue = notAutos.map((ele) => {
        return [ele.category.id, ele.id];
      });
    },
    viewPatientTags(row) {
      this.setPpInfo(row);
      this.patientTags = row.patient.tags;
      this.currentProjectPatient = row;
      this.viewPatientTagsDialogVisible = true;
    },
    addServiceRemark(row) {
      this.currentProjectPatient = row;
      this.setPpInfo(row);
      this.getPatientMemos();
      this.addServiceRemarkDialogVisible = true;
    },
    viewServiceRemark(row) {
      this.currentProjectPatient = row;
      this.setPpInfo(row);
      this.getPatientMemos();
      this.viewServiceRemarkDialogVisible = true;
    },
    unAssigned(row) {
      this.setPpInfo(row);
      this.$confirm(`确定取消分配吗？`, "取消分配", {
        confirmButtonText: "确定",
        cancelButtonText: "关闭",
        type: "error",
      })
        .then(() => {
          this.$api.myProjectPatient
            .cancelAssign(row.id)
            .then((res) => {
              this.$message.success("取消分配成功");
              this.getProjectPatients();
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    continueService(row) {
      this.setPpInfo(row);
      this.$confirm(`确定延续服务吗？`, "延续服务", {
        confirmButtonText: "确定",
        cancelButtonText: "关闭",
        type: "warning",
      })
        .then(() => {
          this.$api.myProjectPatient
            .continueService(row.id)
            .then((res) => {
              this.$message.success("延续服务成功");
              this.getProjectPatients();
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    endService(row) {
      this.setPpInfo(row);
      this.$confirm(`确定结束服务吗？`, "结束服务", {
        confirmButtonText: "确定",
        cancelButtonText: "关闭",
        type: "error",
      })
        .then(() => {
          this.$api.myProjectPatient
            .endService(row.id)
            .then((res) => {
              this.$message.success("结束服务成功");
              this.getProjectPatients();
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    toPatientDetail(row) {
      this.setPpInfo(row);
      this.$router.push({
        path: `/patient_detail/${row.id}?views=0`,
      });
    },
    startDay() {
      return Math.floor(
        (new Date() - new Date(this.currentProject.start_date)) /
          (24 * 3600 * 1000)
      );
    },
    tagQuerySearch(queryString, cb) {
      const tags = this.tags;
      if (queryString.trim() === "") {
        cb(tags);
      } else {
        cb(
          tags.filter((item) => {
            item.name === queryString;
          })
        );
      }
    },
    patientTagSelect(value) {
      if (this.patientTags.find((item) => item.id === value.id)) {
        this.tagInputValue = "";
      } else {
        this.patientTags.push(value);
        this.tagInputValue = "";
      }
    },
    submitPatientTags() {
      this.tagSubmitLoading = true;
      this.$api.patients
        .patch(this.currentProjectPatient.patient.user_id, {
          tags_id: this.patientTags.map((item) => item.id),
        })
        .then((res) => {
          this.tagSubmitLoading = false;
          this.$message.success("保存成功");
          this.addPatientTagsDialogVisible = false;
          this.getProjectPatients();
        })
        .catch((err) => {
          this.tagSubmitLoading = false;
          this.$message.error(JSON.stringify(err));
        });
    },
    addFollowUp(row) {
      this.$router.push({
        name: "PatientSetFollowUp",
        params: {
          type: "create",
          ppid: row.id,
          projectId: row.project.id,
          userId: row.patient.user_id,
          stage: row.stage,
          createMethod: "create",
        },
      });
    },
    viewFollowUp(row) {
      this.$router.push({
        name: "PatientFollowUp",
        params: {
          ppid: row.id,
          projectId: row.project.id,
          userId: row.patient.user_id,
          stage: row.stage,
        },
      });
    },
    addSolutions(row) {
      this.$router.push({
        name: "PatientSetSolution",
        params: {
          type: "create",
          ppid: row.id,
          projectId: row.project.id,
          solutionId: null,
          userId: row.patient.user_id,
          stage: row.stage,
        },
      });
    },
    viewSolution(row) {
      this.$router.push({
        path: `/patient_detail/${row.id}?views=1`,
      });
    },
    addPlanningMeals(row) {
      this.$router.push({
        name: "PatientSetRecipe",
        params: {
          type: "create",
          ppid: row.id,
          projectId: row.project.id,
          userId: row.patient.user_id,
          stage: row.stage,
        },
      });
    },
    viewPlanningMeals(row) {
      this.$router.push({
        name: "RecipeLibrary",
        query: {
          views: 1,
          ppid: row.id,
          name: row.patient.name,
        },
      });
    },
    teamHasMe(members = []) {
      return members.some((item) => item.id === this.userInfo.id);
    },

    downloadExcel(response, customFilename = "") {
      let blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      let downloadElement = document.createElement("a");
      let href = window.URL.createObjectURL(blob); // 创建下载的链接
      downloadElement.href = href;

      let filename = "";
      if (response.headers["content-disposition"]) {
        filename = decodeURI(
          response.headers["content-disposition"].split("filename=")[1]
        );
      } else {
        if (customFilename !== "") {
          filename = customFilename;
        } else {
          filename = "文件.xlsx";
        }
      }
      downloadElement.download = filename; // 下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      window.URL.revokeObjectURL(href);
    },
    exportPatientExcel() {
      if (this.projectPatients.length === 0) {
        return this.$message.warning("暂无患者健康数据");
      }
      this.exportBtnLoading = true;
      const params = {};
      const last = this.patientSelection.length - 1;
      if (this.patientSelection.length > 0) {
        params.patient_ids = this.patientSelection.reduce(
          (item, curr, index) => {
            if (index === last) {
              return (item += curr.patient.user_id);
            } else {
              return (item += curr.patient.user_id + ",");
            }
          },
          ""
        );
      }

      this.$api.exports
        .exportFile(params)
        .then((res) => {
          this.downloadExcel(res, `我的患者数据——${this.userInfo.name}.xlsx`);
        })
        .catch((err) => {
          this.$message.error(err.detail);
        })
        .finally(() => {
          this.exportBtnLoading = false;
        });
    },
    patientSelectionChange(val) {
      this.patientSelection = val;
    },

    // 发送健康评估
    sendHealthAssessment(row) {
      this.$confirm(`确定向患者发送健康评估链接吗？`, "发送健康评估链接", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$api.patients
            .patchPatientRecordState(row.patient.user_id, {
              report_state: 1,
            })
            .then((res) => {
              this.$message.success("发送成功");
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err));
            });
        })
        .catch(() => {});
    },
    // 查看健康评估
    viewHealthAssessment(row) {
      this.$api.patients
        .getPatientRecordState(row.patient.user_id)
        .then((res) => {
          this.report_state = res.data.report_state;
          this.exercise_state = res.data.exercise_state;
          this.nutrition_state = res.data.nutrition_state;
          this.viewHealthAssessmentDialogVisible = true;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    // 添加开始运动时间
    addStartTime(row) {
      this.currentProjectPatient = row;
      this.$api.patients
        .getPatientRecordState(row.patient.user_id)
        .then((res) => {
          this.startTime = res.data.exercise_begin_date;
          this.isAddStartTime = true;
          this.viewStartTimeDialogVisible = true;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    // 查看开始运动时间
    viewStartTime(row) {
      this.$api.patients
        .getPatientRecordState(row.patient.user_id)
        .then((res) => {
          this.startTime = res.data.exercise_begin_date;
          this.isAddStartTime = false;
          this.viewStartTimeDialogVisible = true;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    // 添加运动时间确认
    setStartTime() {
      this.$api.patients
        .patchPatientRecordState(this.currentProjectPatient.patient.user_id, {
          exercise_begin_date: this.startTime,
        })
        .then((res) => {
          this.$message.success("设置成功");
          this.viewStartTimeDialogVisible = false;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
    getTagList() {
      this.$api.tag
        .getList({
          ordering: "id",
          private_dpt: this.userInfo.selectedDepartment.id,
          page: 1,
          page_size: 99999,
          // attribute__in: "Private, Public"
        })
        .then((res) => {
          this.tagss = res.data.results;
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err));
        });
    },
  }, // methods end
};
</script>

<style scoped lang="less">
.panel {
  .card {
    //min-width: 1100px !important;
  }

  /* head */

  .header-project {
    position: relative;
    box-sizing: border-box;
    height: 117px;
    margin-top: 32px;
    padding: 0 32px;
    padding-top: 5px;
    min-height: 104px;

    .project-card {
      box-sizing: border-box;
      position: relative;
      width: 178px;
      min-width: 178px;
      height: 72px;
      margin-right: 10px;
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: #5a607f;
      cursor: pointer;
      transition: all 0.3s;

      .icon {
        position: absolute;
        top: 11px;
        left: 11px;
      }

      .product {
        position: absolute;
        top: 10px;
        left: 38px;
        font-size: 14px;
        font-weight: bold;
        line-height: 23px;
        color: #5a607f;
      }

      .type {
        position: absolute;
        top: 14px;
        right: 14px;
        font-size: 14px;
        color: #a1a7c4;
      }

      .name {
        position: absolute;
        bottom: 12px;
        left: 11px;
        font-size: 14px;
        width: calc(176px - 11px);
        .text-ellipsis();
      }
    }

    .project-card.active {
      border: 1px solid @primaryColor;
      color: @primaryColor;
      transform: translateY(-5px);

      .product {
        color: @primaryColor;
      }

      &::before {
        content: "";
        position: absolute;
        top: 11px;
        width: 2px;
        height: 47px;
        background-color: #00a29a;
      }
    }

    .card-pagination {
      position: absolute;
      top: 97px;
      right: 10px;

      :deep(.el-pager) {
        display: none;
      }
    }
  }

  .breadcrumb-reset {
    margin-left: 0;
    height: 38px;
    line-height: 38px;
    margin-bottom: 20px;
  }

  /* body */

  .card.body-patient {
    box-sizing: border-box;
    padding: 32px !important;
    margin-top: 32px;
    margin-bottom: 20px;

    .title-info {
      .project-name {
        font-size: 20px;
        color: #344563;
      }

      .el-tag {
        box-sizing: border-box;
        height: 27px;
        line-height: 27px;
        background-color: #ffffff;
        border-radius: 14px;
        margin-left: 16px;
        border: 1px solid #d9e1ec;
        color: #1e242c;
      }
    }

    .team-name {
      margin-bottom: 30px;

      .avatar {
        width: 20px;
        height: 20px;
      }

      .name {
        margin-left: 5px;
        margin-right: 4px;
        height: 16px;
        line-height: 20px;
        font-size: 16px;
        font-weight: 500;
        color: #344563;
      }
    }

    .stat-info {
      .stat-card {
        position: relative;
        box-sizing: border-box;
        //width: 205px;
        width: 20%;
        height: 56px;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-right: 8px;

        .bg {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          opacity: 0.1;
        }

        .info {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 10px;
        }

        .count {
          height: 20px;
          line-height: 20px;
          font-size: 24px;
          font-weight: 400;
          color: #344563;
          margin: 10px 0;
          margin-left: 10px;
        }

        .desc {
          height: 14px;
          font-size: 14px;
          font-weight: 400;
          color: #344563;
          line-height: 14px;
          margin-left: 6px;
        }
      }

      .stat-card:last-child {
        margin-right: 0;
      }

      .stat-card.fwhz .bg {
        background: linear-gradient(319deg, #98b7c3 0%, #6a7190 100%);
      }

      .stat-card.tzdk .bg {
        background: linear-gradient(319deg, #20b9f8 0%, #3257f6 100%);
      }

      .stat-card.ysdk .bg {
        background: linear-gradient(144deg, #fd723c 0%, #ffb470 100%);
      }

      .stat-card.yddk .bg {
        background: linear-gradient(338deg, #24c6b6 0%, #31d09f 100%);
      }

      .stat-card.zx .bg {
        background: linear-gradient(214deg, #2455ff 0%, #8472ff 100%);
      }
    }
  }
}

.search-bar {
  .el-form-item {
    margin: 0;

    .el-select {
      width: 100%;
    }

    .el-date-editor {
      width: 100%;
    }

    :deep(.el-input__inner) {
      width: 100%;
      font-size: 14px;
      height: 40px !important;
    }

    :deep(.el-input__icon.el-icon-time) {
      &:before {
        content: "\e78e";
      }
    }
  }
}

.m-table {
  height: 463px;

  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
  }

  .el-link {
    color: #00b386;
    text-decoration: none;
  }

  .tag {
    padding: 0;
    margin: 0 auto;
    width: 80px;
    height: 28px;
    background: #5a607f;
    border-radius: 7px;
  }
}

.patient-tags {
  .el-tag {
    box-sizing: border-box;
    background-color: @primaryColor;
    margin-bottom: 10px;
    color: #fff;

    :deep(.el-tag__close.el-icon-close::before) {
      color: #fff;
    }
  }

  :deep(.el-cascader) {
    margin-right: 10px;
  }

  :deep(.el-cascader__tags) {
    display: none;
  }

  :deep(.el-input__inner) {
    box-sizing: border-box;
    height: 32px;
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    box-sizing: border-box;
    margin-left: 10px;
    height: 27px;
    line-height: 27px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    box-sizing: border-box;
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}

.service-remark-dialog {
  :deep(.el-dialog) {
    width: 680px;
    height: 520px;
  }

  .submit-btn {
    background-color: @primaryColor;
    color: #fff;
    border-radius: 6px;
    float: right;
    margin-top: 4px;
  }
}

.tag-list-item {
  position: relative;
  //height: 32px;
  //line-height: 32px;
  padding-left: 10px;
  overflow: hidden;

  &:hover {
    background-color: #f4f5fa;
  }

  .name {
    width: auto;
    height: inherit;
    line-height: inherit;
    .text-ellipsis();
  }

  .m-button {
    position: absolute;
    top: 2px;
    right: 0;
    margin-right: 0;
  }
}

.health-assessment {
  padding-top: 80px;
  padding-left: 80px;
  padding-right: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  div {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
  }
}
.start-time {
  padding-top: 80px;
  padding-left: 80px;
  padding-right: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  div {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
  }
}
.add-start-time {
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  padding-left: 80px;
  span {
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
  }
}
.patient-tagss {
  :deep(.el-select__tags-text) {
    color: #333333;
  }
}
</style>
