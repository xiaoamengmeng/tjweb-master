<template>
  <div class="panel">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item>
        <b>待办任务</b>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card">
      <div class="container">
        <div class="todo-top">
          <!-- <el-badge :value="reportStates" :hidden="reportStates <= 0" class="item">
                <el-button @click="clickTop('待评估')" :class="viewMode == '待评估' && 'selected-item'" style="width: 104px;" size="small">待评估</el-button>
            </el-badge> -->
          <el-badge :value="nutritionStates" :hidden="nutritionStates <= 0" class="item">
            <el-button @click="clickTop('待开营养处方')" :class="viewMode == '待开营养处方' && 'selected-item'" size="small">待开营养处方</el-button>
          </el-badge>
          <el-badge :value="exerciseStates" :hidden="exerciseStates <= 0" class="item">
            <el-button @click="clickTop('待开运动处方')" :class="viewMode == '待开运动处方' && 'selected-item'" size="small">待开运动处方</el-button>
          </el-badge>
          <el-badge :value="dietRecords" :hidden="dietRecords <= 0" class="item">
            <el-button @click="clickTop('点评餐饮打卡')" :class="viewMode == '点评餐饮打卡' && 'selected-item'" size="small">点评餐饮打卡</el-button>
          </el-badge>
          <el-badge :value="exerciseRecords" :hidden="exerciseRecords <= 0" class="item">
            <el-button @click="clickTop('点评运动打卡')" :class="viewMode == '点评运动打卡' && 'selected-item'" size="small">点评运动打卡</el-button>
          </el-badge>
          <el-badge :value="weightRecords" :hidden="weightRecords <= 0" class="item">
            <el-button @click="clickTop('点评体重打卡')" :class="viewMode == '点评体重打卡' && 'selected-item'" size="small">点评体重打卡</el-button>
          </el-badge>
          <el-badge :value="ppFollowUps" :hidden="ppFollowUps <= 0" class="item">
            <el-button @click="clickTop('随访')" :class="viewMode == '随访' && 'selected-item'" style="width: 104px" size="small">随访</el-button>
          </el-badge>
        </div>
        <m-table :key="componentKey" class="m-table" ref="table" :data="tableData" :total="total" :page-sizes="[10, 15, 20]" :page-size.sync="pageSize" :current-page.sync="page" :height="'calc(100vh - 320px)'" :get-data-func="getDataFunc">
          <!-- 待评估 待开营养处方 待开运动处方  -->
          <div v-if="viewMode == '待评估' || viewMode == '待开营养处方' || viewMode == '待开运动处方'">
            <el-table-column min-width="10"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient.user_id" label="患者ID" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient.name" label="患者姓名" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip label="性别" min-width="100">
              <template v-slot="scope">
                {{ scope.row.patient.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="年龄" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient.user_profile && scope.row.patient.user_profile.birthday">
                  {{ scope.row.patient.user_profile.birthday | calcAge }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目名称" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient.subscriptions && scope.row.patient.subscriptions.length > 0 && scope.row.patient.subscriptions[0].project">
                  {{ scope.row.patient.subscriptions[0].project.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="服务状态" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.patient.subscriptions && scope.row.patient.subscriptions.length > 0 && scope.row.patient.subscriptions[0].project">
                  {{ $dict.patientServiceStatus.getLabel(scope.row.patient.subscriptions[0].status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目阶段" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient.subscriptions && scope.row.patient.subscriptions.length > 0 && scope.row.patient.subscriptions[0].project">
                  {{ scope.row.patient.subscriptions[0].stage }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <el-link v-auth="'todoTask.update'" v-if="viewMode == '待评估'" @click.native="sendHealthAssessment(scope.row)">发送评估链接</el-link>
                  <template v-if="viewMode == '待开营养处方' || viewMode == '待开运动处方'">
                    <el-link v-auth="'todoTask.update'" v-if="viewMode == '待开营养处方'" @click.native="getNutritionDeatil(scope.row)">查看处方</el-link>
                    <el-link v-auth="'todoTask.update'" v-if="viewMode == '待开运动处方'" @click.native="getExercisePrescription(scope.row)">查看处方</el-link>
                    <el-link @click.native="toEvaluationreport(scope.row)">查看评估报告</el-link>
                    <el-link @click.native="toQuestionnaire(scope.row)">查看问卷</el-link>
                  </template>
                </div>
              </template>
            </el-table-column>
          </div>

          <!-- 点评餐饮打卡 -->
          <div v-else-if="viewMode == '点评餐饮打卡'">
            <el-table-column min-width="10"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient" label="患者ID" min-width="80"> </el-table-column>
            <el-table-column show-overflow-tooltip label="患者姓名" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.patient_info">
                  {{ scope.row.patient_info.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip. label="性别" min-width="100">
              <template v-slot="scope">
                {{ scope.row.patient_info.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="年龄" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.user_profile && scope.row.patient_info.user_profile.birthday">
                  {{ scope.row.patient_info.user_profile.birthday | calcAge }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目名称" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ scope.row.patient_info.subscriptions[0].project.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="服务状态" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ $dict.patientServiceStatus.getLabel(scope.row.patient_info.subscriptions[0].status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目阶段" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ scope.row.patient_info.subscriptions[0].stage }}
                </span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip prop="dateTime" label="用餐时间" min-width="120">
              <template v-slot="scope">
                {{ scope.row.recorded_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="id" label="餐段" min-width="80">
              <template v-slot="scope">
                {{ scope.row.meal | mealType }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="图片" min-width="80">
              <template v-slot="scope">
                <span v-if="!scope.row.image">暂无</span>
                <el-link v-else @click="previewImage(scope.row.image)">查看图片</el-link>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="用餐情况" min-width="120">
              <template v-slot="scope">
                <span v-if="!scope.row.foods || scope.row.foods.length === 0">暂无</span>
                <span v-else>{{ showFoodDetail(scope.row.foods) }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="点赞" min-width="50">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-if="historyTableIsMyLiked(scope.row.likes)" icon-name="is_liked_true" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="dietUnlike(scope.row)"></icon-box>
                  <icon-box v-else icon-name="is_liked_false" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="dietLike(scope.row)"></icon-box>
                  <span v-if="scope.row.likes" class="ml_4">
                    {{ scope.row.likes.length }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="150">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-auth="'todoTask.update'" icon-name="table_comment" w="39" h="39" box-w="39" style="cursor: pointer" title="发表评论" @click.native="dietCommentClick(scope.row)"></icon-box>
                  <icon-box v-auth="'todoTask.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="dietEditClick(scope.row)"></icon-box>
                  <icon-box v-auth="'todoTask.update'" v-if="historyTableIsMyCreator(scope.row.creator)" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deleteDietRecord(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </div>

          <!-- 点评运动打卡 -->
          <div v-else-if="viewMode == '点评运动打卡'">
            <el-table-column min-width="10"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient_info.user_id" label="患者ID" min-width="80"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient_info.name" label="患者姓名" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip label="性别" min-width="100">
              <template v-slot="scope">
                {{ scope.row.patient_info.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="年龄" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.user_profile && scope.row.patient_info.user_profile.birthday">
                  {{ scope.row.patient_info.user_profile.birthday | calcAge }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目名称" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ scope.row.patient_info.subscriptions[0].project.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="服务状态" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ $dict.patientServiceStatus.getLabel(scope.row.patient_info.subscriptions[0].status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目阶段" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ scope.row.patient_info.subscriptions[0].stage }}
                </span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="运动时间" min-width="120">
              <template v-slot="scope">
                {{ scope.row.recorded_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="exercise.name" label="运动项目" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="duration" label="运动时长" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip label="运动图片" min-width="80">
              <template v-slot="scope">
                <span v-if="!scope.row.image">暂无</span>
                <el-link v-else @click="previewImage(scope.row.image)">查看图片</el-link>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="备注" min-width="70">
              <template v-slot="scope">
                <span v-if="!scope.row.info">暂无</span>
                <span v-else>{{ scope.row.info }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="id" label="点赞" min-width="100">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-if="historyTableIsMyLiked(scope.row.likes)" icon-name="is_liked_true" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="exerciseUnlike(scope.row)"></icon-box>
                  <icon-box v-else icon-name="is_liked_false" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="exerciseLike(scope.row)"></icon-box>
                  <span v-if="scope.row.likes" class="ml_4">
                    {{ scope.row.likes.length }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-auth="'todoTask.update'" icon-name="table_comment" w="39" h="39" box-w="39" style="cursor: pointer" title="发表评论" @click.native="exerciseCommentClick(scope.row)"></icon-box>
                  <icon-box v-auth="'todoTask.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="exerciseEditClick(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </div>

          <!-- 点评体重打卡 -->
          <div v-else-if="viewMode == '点评体重打卡'">
            <el-table-column min-width="10"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient_info.user_id" label="患者ID" min-width="80"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient_info.name" label="患者姓名" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip label="性别" min-width="100">
              <template v-slot="scope">
                {{ scope.row.patient_info.sex | sexText }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="年龄" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.user_profile && scope.row.patient_info.user_profile.birthday">
                  {{ scope.row.patient_info.user_profile.birthday | calcAge }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目名称" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ scope.row.patient_info.subscriptions[0].project.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="服务状态" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ $dict.patientServiceStatus.getLabel(scope.row.patient_info.subscriptions[0].status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="项目阶段" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.patient_info.subscriptions && scope.row.patient_info.subscriptions.length > 0">
                  {{ scope.row.patient_info.subscriptions[0].stage }}
                </span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="测量时间" min-width="120">
              <template v-slot="scope">
                {{ scope.row.recorded_at | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="数值（kg）/(cm)" align="center" min-width="140">
              <template v-slot="scope">
                {{ Math.round(scope.row.weight) + '/' + Math.round(scope.row.waistline) }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="场景" min-width="80">
              <template v-slot="scope">
                {{ $dict.weightRecordTimePeriod.getLabel(scope.row.time_period) }}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="点赞" min-width="50">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-if="historyTableIsMyLiked(scope.row.likes)" icon-name="is_liked_true" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="weightUnlike(scope.row)"></icon-box>
                  <icon-box v-else icon-name="is_liked_false" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="weightLike(scope.row)"></icon-box>
                  <span v-if="scope.row.likes" class="ml_4">
                    {{ scope.row.likes.length }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <icon-box v-auth="'todoTask.update'" icon-name="table_comment" w="39" h="39" box-w="39" style="cursor: pointer" title="发表评论" @click.native="weightCommentClick(scope.row)"></icon-box>
                  <icon-box v-auth="'todoTask.update'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="weightEditClick(scope.row)"></icon-box>
                  <icon-box v-auth="'todoTask.update'" v-if="historyTableIsMyCreator(scope.row.creator)" icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deleteWeightRecord(scope.row)"></icon-box>
                </div>
              </template>
            </el-table-column>
          </div>

          <!-- 随访 -->
          <div v-else>
            <el-table-column min-width="10"> </el-table-column>
            <el-table-column prop="created_at" label="创建时间" min-width="150" show-overflow-tooltip>
              <template v-slot="scope">
                <span>{{ scope.row.created_at | dateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="patient_name" label="患者姓名" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="phone_number" label="手机号" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="project_name" label="随访项目" min-width="150"> </el-table-column>
            <el-table-column show-overflow-tooltip prop="project_stage" label="项目阶段" min-width="100"> </el-table-column>
            <el-table-column show-overflow-tooltip label="随访方式" min-width="100">
              <template v-slot="scope">
                <span v-if="scope.row.follow_up_type === 'phone'">电话</span>
                <span v-else>微信</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="期望完成时间" min-width="160">
              <template v-slot="scope">
                <span>{{ scope.row.follow_up_time | dateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100">
              <template v-slot="scope">
                <div class="flex justify_center">
                  <el-link v-auth="'todoTask.update'" @click.native="followUpClick(scope.row)">查看随访</el-link>
                </div>
              </template>
            </el-table-column>
          </div>
        </m-table>
      </div>
    </div>

    <el-dialog title="添加饮食评论" :visible.sync="dietCommentDialogVisible" class="diet-comment-dialog">
      <el-input class="mt_20" type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="dietCommentContent"> </el-input>
      <el-button size="small" class="submit-btn" @click="dietAddComment">发表</el-button>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dietCommentDialogVisible = false">关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑饮食记录" :visible.sync="dietEditDialogVisible" class="diet-edit-dialog">
      <div class="date mtext">
        <span>{{ dietRecord.recorded_at | dateFormat }}</span>
        <span class="ml_30">{{ dietRecord.meal | mealType }}</span>
      </div>
      <div class="date-time mtext">用餐时间：{{ dietRecord.recorded_at | dateFormatHhmm }}</div>
      <div class="diet-image">
        <span class="mtext">用餐照片：</span>
        <div v-if="!dietRecord.image" class="box empty">暂无</div>
        <div v-else class="box">
          <el-image class="" :src="dietRecord.image" :preview-src-list="[dietRecord.image]" fit="cover"> </el-image>
        </div>
      </div>
      <div class="remake">备注：{{ dietRecord.info ? dietRecord.info : '暂无' }}</div>
      <div class="comment-num">
        <div class="comment mtext">点评（{{ dietRecord.comments.length }}）</div>
        <div class="like mtext">
          点赞
          <span class="mr_6">
            {{ dietRecord.likes.length }}
          </span>
          <icon-box class="icon" v-if="dietRecordLikedIsActive" icon-name="is_liked_true" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="dietUnlike(dietRecord)"></icon-box>
          <icon-box class="icon" v-else icon-name="is_liked_false" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="dietLike(dietRecord)"></icon-box>
        </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="comment in dietRecord.comments" :key="comment.id">
          <div class="role-name mtext">
            【{{ comment.creator.role_name }} - {{ comment.creator.name }}】
            <el-link class="delete-link" v-if="comment.creator.id === userInfo.id" @click="dietDeleteComment(comment.id)">删除 </el-link>
          </div>
          <div class="content">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <div class="comment-text-box">
        <el-input class="mt_20" type="textarea" :rows="5" resize="none" placeholder="请输入点评内容" v-model="dietCommentContent" style="width: 400px"> </el-input>
        <el-button size="small" class="submit-btn" @click="dietAddComment">发送</el-button>
      </div>
      <div class="mtext mt_20">用餐情况</div>
      <div class="food-table">
        <m-button class="record-btn" @click="dietRecordAddFoodClick" h="40px"> 手动录入 </m-button>
        <m-view-table :data="dietRecord.foods" height="302" highlight-current-row hide-loading hide-pagination>
          <el-table-column show-overflow-tooltip label="餐段" align="center" min-width="80">
            <template>
              {{ dietRecord.meal | mealType }}
            </template>
          </el-table-column>
          <el-table-column prop="food.name" label="食物/菜肴" align="center"> </el-table-column>
          <el-table-column label="摄入量" align="center">
            <template v-slot="scope">
              {{ scope.row.amount + '克' }}
            </template>
          </el-table-column>
          <el-table-column label="热量" align="center">
            <template v-slot="scope">
              {{ scope.row.calories + '千卡' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <m-button type="danger" w="54px" h="32px" class="p_0" @click="dietRecord.foods.splice(scope.$index, 1)"> 删除 </m-button>
            </template>
          </el-table-column>
        </m-view-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="dietEditDialogVisible = false">关 闭</m-button>
        <m-button @click="dietRecordAddFoodSave">保 存</m-button>
      </span>
    </el-dialog>

    <el-dialog title="添加运动评论" :visible.sync="exerciseCommentDialogVisible" class="diet-comment-dialog">
      <el-input class="mt_20" type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="exerciseCommentContent"> </el-input>
      <el-button size="small" class="submit-btn" @click="exerciseAddComment">发表</el-button>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="exerciseCommentDialogVisible = false">关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog title="运动记录详情" :visible.sync="exerciseDetailDialogVisible" class="diet-edit-dialog exercise">
      <div class="date mtext">
        <span>{{ exerciseRecord.recorded_at | dateFormat }}</span>
        <span class="ml_30">{{ exerciseRecord.meal | mealType }}</span>
      </div>
      <div class="date-time mtext">运动时间：{{ exerciseRecord.recorded_at | dateFormatHhmm }}</div>
      <div class="diet-image">
        <span class="mtext">运动照片：</span>
        <div v-if="!exerciseRecord.image" class="box empty">暂无</div>
        <div v-else class="box">
          <el-image class="" :src="exerciseRecord.image" :preview-src-list="[exerciseRecord.image]" fit="cover"> </el-image>
        </div>
      </div>
      <div class="remake">备注：{{ exerciseRecord.info ? exerciseRecord.info : '暂无' }}</div>
      <div class="comment-num">
        <div class="comment mtext">点评（{{ exerciseRecord.comments.length }}）</div>
        <div class="like mtext">
          点赞
          <span class="mr_6">
            {{ exerciseRecord.likes.length }}
          </span>
          <icon-box class="icon" v-if="exerciseRecordLikedIsActive" icon-name="is_liked_true" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="exerciseUnlike(exerciseRecord)"></icon-box>
          <icon-box class="icon" v-else icon-name="is_liked_false" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="exerciseLike(exerciseRecord)"></icon-box>
        </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="comment in exerciseRecord.comments" :key="comment.id">
          <div class="role-name mtext">
            【{{ comment.creator.role_name }} - {{ comment.creator.name }}】
            <el-link class="delete-link" v-if="comment.creator.id === userInfo.id" @click="exerciseDeleteComment(comment.id)">删除 </el-link>
          </div>
          <div class="content">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <div class="comment-text-box">
        <el-input class="mt_20" type="textarea" :rows="5" resize="none" placeholder="请输入点评内容" v-model="exerciseCommentContent" style="width: 400px"> </el-input>
        <el-button size="small" class="submit-btn" @click="exerciseAddComment">发送</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="exerciseDetailDialogVisible = false">关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog title="体重记录详情" :visible.sync="weightDetailDialogVisible" class="diet-edit-dialog exercise">
      <div class="date mtext">
        <span>{{ weightRecord.recorded_at | dateFormatCN }}</span>
      </div>
      <div class="date-time mtext">测量时间：{{ weightRecord.recorded_at | dateFormatHhmmss }}</div>
      <div class="date-time mtext">测量场景：{{ $dict.weightRecordTimePeriod.getLabel(weightRecord.time_period) }}</div>
      <div class="date-time mtext">体重：{{ Number(weightRecord.weight).toFixed(2) }} kg</div>
      <div class="date-time mtext">腰围：{{ Number(weightRecord.waistline).toFixed(2) }} cm</div>
      <div class="comment-num">
        <div class="comment mtext">点评（{{ weightRecord.comments.length }}）</div>
        <div class="like mtext">
          点赞
          <span class="mr_6">
            {{ weightRecord.likes.length }}
          </span>
          <icon-box class="icon" v-if="weightRecordLikedIsActive" icon-name="is_liked_true" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="weightUnlike(weightRecord)"></icon-box>
          <icon-box class="icon" v-else icon-name="is_liked_false" w="21" h="21" w-box="21 h-box=20" style="cursor: pointer" @click.native="weightLike(weightRecord)"></icon-box>
        </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="comment in weightRecord.comments" :key="comment.id">
          <div class="role-name mtext">
            【{{ comment.creator.role_name }} - {{ comment.creator.name }}】
            <el-link class="delete-link" v-if="comment.creator.id === userInfo.id" @click="weightDeleteComment(comment.id)">删除 </el-link>
          </div>
          <div class="content">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <div class="comment-text-box">
        <el-input class="mt_20" type="textarea" :rows="5" resize="none" placeholder="请输入点评内容" v-model="weightCommentContent" style="width: 400px"> </el-input>
        <el-button size="small" class="submit-btn" @click="weightAddComment">发送</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="weightDetailDialogVisible = false">关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog title="添加体重评论" :visible.sync="weightCommentDialogVisible" class="diet-comment-dialog" width="600px">
      <el-input class="mt_20" type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="weightCommentContent"> </el-input>
      <el-button size="small" class="submit-btn" @click="weightAddComment">发表</el-button>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="weightCommentDialogVisible = false">关 闭</m-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="nutritionCommentDialogVisible" class="nutrition-edit-dialog" width="1000px">
      <div style="padding-top: 20px; position: relative">
        <m-button @click="sendNutrition" style="position: absolute; right: 20px; top: 14px; z-index: 999" h="36px">发送给患者</m-button>
        <div class="sprot-info-title">每日营养摄入</div>
        <div style="margin-bottom: 10px" class="sprot-info-title">
          <div class="nutrition-info">
            <div class="nutrition-info-border nutrition-info-noborder">总热量</div>
            <div class="nutrition-info-border nutrition-info-noborder">碳水化合物</div>
            <div class="nutrition-info-border nutrition-info-noborder">脂肪</div>
            <div class="nutrition-info-border">蛋白质</div>
          </div>
          <div class="nutrition-info">
            <div style="line-height: 96px" class="nutrition-info-border nutrition-info-noborder nutrition-info-notopborder">{{ nutritionInfo.calorie }}Kcal</div>
            <div class="nutrition-info-border nutrition-info-noborder nutrition-info-notopborder">
              <span>{{ nutritionInfo.carbohydrate_ratio }}%</span>
              <span>{{ nutritionInfo.carbohydrate }}克</span>
            </div>
            <div class="nutrition-info-border nutrition-info-noborder nutrition-info-notopborder">
              <span>{{ nutritionInfo.fat_ratio }}%</span>
              <span>{{ nutritionInfo.fat }}克</span>
            </div>
            <div class="nutrition-info-border nutrition-info-notopborder">
              <span>{{ nutritionInfo.protein_ratio }}%</span>
              <span>{{ nutritionInfo.protein }}克</span>
            </div>
          </div>
        </div>
        <el-tabs v-model="dishActiveName">
          <el-tab-pane label="食材明细" name="1">
            <div style="font-size: 14px; color: red">说明：点击食材图片查看可交换食材/食物</div>
            <div class="nutrition-food">
              <div style="width: 100%" v-for="(item, index) in mealType" :key="index">
                <div style="font-size: 14px; text-align: center">{{ item.label }}</div>
                <div class="nutrition-food1" v-for="(ite, idx) in nutritionFoodMap[item.name].foods" :key="idx">
                  <div class="nutrition-food-title">{{ ite.food.food_one_type_name }}</div>
                  <div @click="showFoodDetails(ite)" class="nutrition-food-info">
                    <el-image class="nutrition-food-img" :src="ite.food.foodimg"></el-image>
                    <div class="nutrition-food-detail">{{ ite.food.foodcommonname + '(' + ite.food_weight + 'g)' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="菜品明细" name="2">
            <div>
              <div style="width: 100%" v-for="(item, index) in mealType" :key="index">
                <div style="font-size: 14px">{{ item.label }}</div>
                <div v-if="nutritionDisheMap[item.name].foods.length > 0" class="nutrition-dish-top">
                  <div>菜品名称</div>
                  <div>图片</div>
                  <div>重量（克/毫升）</div>
                  <div>热量（千卡）</div>
                </div>
                <div v-else class="sprot-info-title" style="margin-top: 10px; margin-left: 10px; margin-bottom: 10px">暂无</div>
                <div class="nutrition-dish-item" v-for="(ite, idx) in nutritionDisheMap[item.name].foods" :key="idx">
                  <div>{{ ite.name }}</div>
                  <div class="nutrition-dish-imgdiv">
                    <el-image :src="ite.image" class="nutrition-dish-img" fit="contain" :preview-src-list="[ite.image]"></el-image>
                  </div>
                  <div>{{ ite.weight }}</div>
                  <div>{{ ite.calories }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="exerciseDialogVisible" class="nutrition-edit-dialog" width="1000px">
      <div style="padding: 20px; position: relative">
        <m-button @click="sendExercise" style="position: absolute; right: 20px; top: 14px; z-index: 999" h="36px">发送给患者</m-button>
        <el-tabs v-model="sprotActiveName">
          <el-tab-pane label="处方详情" name="1">
            <div class="sprot-info-title">患者所属人群：{{ exercisePrescription.people }}</div>
            <el-form class="form-box" ref="sprotForm" label-width="60" label-position="left" :model="exerciseInfo">
              <div class="sprot-info-content">
                <div class="sprot-info-content-item">
                  <div class="sprot-info-title">系统建议方案</div>
                  <div class="sprot-info-title sprot-info-title1">
                    <span class="sprot-info-pre">建议每天运动时长：</span>
                    <span
                      ><span class="sprot-info-red">{{ exercise_duration_low }}</span> ~ <span class="sprot-info-red">{{ exercise_duration_height }}</span> 分钟</span
                    >
                  </div>
                  <div class="sprot-info-title sprot-info-title1">
                    <span class="sprot-info-pre">建议靶心率范围：</span>
                    <span
                      ><span class="sprot-info-red">{{ parseInt(exercisePrescription.low_thr) }}</span> ~ <span class="sprot-info-red">{{ parseInt(exercisePrescription.high_thr) }}</span> 次/分钟</span
                    >
                  </div>
                  <div class="sprot-info-title sprot-info-title1">
                    <span class="sprot-info-pre">建议训练频率：</span>
                    <span
                      ><span class="sprot-info-red">{{ exercise_frequency_low }}</span> ~ <span class="sprot-info-red">{{ exercise_frequency_height }}</span> 天/周</span
                    >
                  </div>
                  <div class="sprot-info-title sprot-info-title1">
                    <span class="sprot-info-pre">运动时间：</span>
                    <span
                      ><span class="sprot-info-red">{{ exercise_time_low }}</span> ~ <span class="sprot-info-red">{{ exercise_time_height }}</span></span
                    >
                  </div>
                </div>
                <div class="sprot-info-content-item">
                  <div class="sprot-info-title">患者定制方案</div>
                  <el-form-item label-width="130px" label=" 每天运动时长： " prop="selectedSprotTime">
                    <el-select v-model="exerciseInfo.selectedSprotTime" style="width: 200px" placeholder="请选择运动时长">
                      <el-option v-for="(item, index) in sprotTimes" :key="index" :label="item" :value="item"> </el-option>
                    </el-select>
                    <span> 分钟</span>
                  </el-form-item>
                  <el-form-item label-width="130px" label=" 靶心率范围： " prop="name">
                    <el-input v-model="exerciseInfo.low_thr" type="text" placeholder="请输入" style="width: 90px"></el-input>
                    <span> ~ </span>
                    <el-input v-model="exerciseInfo.high_thr" type="text" placeholder="请输入" style="width: 90px"></el-input>
                    <span> 次/分钟</span>
                  </el-form-item>
                  <el-form-item label-width="130px" label=" 训练频率： " prop="name">
                    <el-select v-model="exerciseInfo.exercise_frequency" style="width: 200px" placeholder="请选择训练频率">
                      <el-option v-for="(item, index) in sprotFrequencys" :key="index" :label="item" :value="item"> </el-option>
                    </el-select>
                    <span> 天/周</span>
                  </el-form-item>
                  <div class="sprot-info-title sprot-info-title1">
                    <span class="sprot-info-pre">运动时间：</span>
                    <span
                      ><span class="sprot-info-red">{{ exercise_time_low }}</span> ~ <span class="sprot-info-red">{{ exercise_time_height }}</span></span
                    >
                  </div>
                </div>
              </div>
              <el-form-item label-width="130px" label=" 注意事项： " prop="name">
                <el-input v-model="exerciseInfo.note" type="textarea" :rows="4" placeholder="请输入注意事项" style="width: 500px"></el-input>
              </el-form-item>
            </el-form>
            <!-- <div class="sprot-info-save">
                  <m-button plain @click="saveExercise">保存</m-button>
              </div> -->
          </el-tab-pane>
          <el-tab-pane label="动作详情" name="2">
            <div style="padding-left: 50px; padding-right: 50px">
              <el-tabs style="padding-top: 10px" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="(item, index) in actionsType" :key="index" :label="item.label" :name="item.code + ''">
                  <div>
                    <div class="action-content">
                      <el-row>
                        <el-col :span="12" v-for="(o, idx) in pptableData.filter((ele) => ele.exercise_categories == item.label)" :key="idx">
                          <div class="action-item">
                            <div class="action-item-left">
                              <el-image @click="toSetPage(o)" class="action-item-image" :src="o.image" fit="contain" />
                              <span>{{ o.name }}</span>
                            </div>
                            <div class="action-item-right">
                              <span>训练频率</span>
                              <el-input v-if="isSave" type="textarea" v-model="current_exercise_frequency[o.name]"></el-input>
                              <span v-else>{{ ea_exercise_frequency[o.name] ? ea_exercise_frequency[o.name] : o.exercise_frequency }}</span>
                              <span>动作要求</span>
                              <span>{{ o.exercise_require }}</span>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="sprot-info-save">
              <m-button plain @click="saveAction">{{ isSave ? '保存' : '编辑' }}</m-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showFoods" title="">
      <div class="show-foods">
        <div>
          <div v-if="nutritionFoodInfo.food" class="nutrition-food-info">
            <el-image class="nutrition-food-img" :src="nutritionFoodInfo.food.foodimg"></el-image>
            <div class="nutrition-food-detail">{{ nutritionFoodInfo.food.foodcommonname + '(' + nutritionFoodInfo.food_weight + 'g)' }}</div>
          </div>
        </div>
        <div class="nutrition-food2">
          <div style="width: 105px" v-for="(ite, idx) in commutatives" :key="idx">
            <div class="nutrition-food-info" style="width: 100%; margin-top: 20px">
              <el-image class="nutrition-food-img" :src="ite.image"></el-image>
              <div class="nutrition-food-detail">{{ ite.food_name + '(' + ite.weight + 'g)' }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <recipe-editor key="dietRecordAddFood" title="添加食物/菜肴" :visible.sync="dietRecordAddFoodVisible" :active.sync="dietRecord.meal" :data.sync="dietRecordAddFooData" single-mead-mode @save="dietRecordAddFooSave"></recipe-editor>

    <recipe-editor key="todayDietRecordAddFood" title="添加食物/菜肴" :visible.sync="todayDietRecordAddFoodVisible" :active.sync="todayDietRecordMeal" :data.sync="todayDietRecordAddFoodData" single-mead-mode @save="todayDietRecordAddFooSave"></recipe-editor>

    <div style="display: none">
      <el-image :src="previewSrc" ref="previewImage" :preview-src-list="[previewSrc]" :z-index="9999"> </el-image>
    </div>

    <el-dialog :visible.sync="dialogVisible" :modal="true" :destroy-on-close="true" class="creation-dialog" @close="close">
      <video ref="videoContent" :src="videoUrl" controls autoplay width="100%" height="100%"></video>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import weightMixin from '../patient/patient_detail/weightMixin'
import dietMixin from '../patient/patient_detail/dietMixin'
import exerciseMixin from '../patient/patient_detail/exerciseMixin'
import dayjs from 'dayjs'
export default {
  name: 'TodoTask',
  mixins: [dietMixin, exerciseMixin, weightMixin],
  data() {
    return {
      viewMode: '待开营养处方',
      tableData: [],
      total: 0,
      pageSize: 10,
      page: 1,

      reportStates: 0,
      nutritionStates: 0,
      exerciseStates: 0,
      ppFollowUps: 0,
      dietRecords: 0,
      exerciseRecords: 0,
      weightRecords: 0,

      previewSrc: null,

      mealType: [],
      nutritionCommentDialogVisible: false,
      nutritionInfo: {},
      nutritionDishes: [],
      nutritionFoods: [],
      // 可交换食材
      nutritionFoodInfo: {},
      commutatives: [],
      dishActiveName: '1',
      showFoods: false,

      exerciseDialogVisible: false,
      sprotActiveName: '1',
      exercisePrescription: {},
      // 运动时长选择
      sprotTimes: [],
      exerciseInfo: {},
      sprotFrequencys: [1, 2, 3, 4, 5, 6, 7],

      // 选中的row
      selectedRow: {},

      // 动作详情
      category: '热身',
      activeName: '1',
      isSave: false,
      pptableData: [],

      ea_exercise_frequency: {},
      current_exercise_frequency: {},

      dialogVisible: false,
      videoUrl: '',

      componentKey: 0,
    }
  },
  mounted() {
    this.getMealType()
    this.getPatientRecordState({ report_state: 0 }, '待评估', true)
    this.getPatientRecordState({ nutrition_state: 1, pre_nutrition_prescription__isnull: false }, '待开营养处方', true)
    this.getPatientRecordState({ exercise_state: 1, pre_exercise_prescription__isnull: false }, '待开运动处方', true)
    this.getDietRecords(true)
    this.getExerciseRecords(true)
    this.getWeightRecords(true)
    this.getPPFollowUps(true)

    // this.getPatientRecordState({report_state: 0})
    this.getPatientRecordState({ nutrition_state: 1, pre_nutrition_prescription__isnull: false }, '待开营养处方')
  },
  methods: {
    // 查看报告
    toEvaluationreport(row) {
      window.open('/evaluationReport/index.html' + '?' + btoa('user_id=' + row.patient.user_id), '_blank')
    },
    // 查看问卷
    toQuestionnaire(row) {
      window.open('/questionnaire/index.html' + '?' + btoa('user_id=' + row.patient.user_id), '_blank')
    },
    saveAction() {
      if (this.isSave) {
        let current = {}
        for (const key in this.current_exercise_frequency) {
          if (Object.hasOwnProperty.call(this.current_exercise_frequency, key)) {
            const element = this.current_exercise_frequency[key]
            const item = this.pptableData.find((ele) => ele.name == key)
            if (element != item.exercise_frequency) {
              current[key] = element
            }
          }
        }

        this.$api.patients
          .patchPatientRecordState(this.selectedRow.patient.user_id, {
            ea_exercise_frequency: current,
          })
          .then((res) => {
            this.$message.success('保存成功')
            this.getDataFunc()
            this.isSave = false
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })
      } else {
        this.isSave = true
      }
    },
    getMealType() {
      this.mealType = this.$dict.nutritionalBloodMealType.data
    },
    clickTop(item) {
      if (this.viewMode != item) {
        this.viewMode = item
        this.tableData = []
        this.$nextTick(() => {
          this.page = 1
          this.total = 0
          this.getDataFunc()
        })
      }
    },
    getDataFunc() {
      if (this.viewMode == '待评估') {
        this.getPatientRecordState({ report_state: 0 })
      } else if (this.viewMode == '待开营养处方') {
        this.getPatientRecordState({ nutrition_state: 1, pre_nutrition_prescription__isnull: false }, '待开营养处方')
      } else if (this.viewMode == '待开运动处方') {
        this.getPatientRecordState({ exercise_state: 1, pre_exercise_prescription__isnull: false }, '待开运动处方')
      } else if (this.viewMode == '点评餐饮打卡') {
        this.getDietRecords()
      } else if (this.viewMode == '点评运动打卡') {
        this.getExerciseRecords()
      } else if (this.viewMode == '点评体重打卡') {
        this.getWeightRecords()
      } else if (this.viewMode == '随访') {
        this.getPPFollowUps()
      }
    },
    showFoodDetail(foods) {
      return foods.reduce((item, curr) => {
        if (curr.food) {
          return (item += curr.food.name + curr.amount + '克 ')
        } else {
          // return item += ' '
          return (item += curr.picture_food + curr.amount + '克 ')
        }
      }, '')
    },
    historyTableIsMyLiked(likes) {
      if (!likes) return false
      if (likes.length === 0) {
        return false
      }
      if (likes.find((item) => item.creator.id === this.userInfo.id)) {
        return true
      }
      return false
    },
    historyTableIsMyCreator(creator) {
      return creator && creator.id === this.userInfo.id
    },

    // 随访
    getPPFollowUps(isCount = false) {
      if (!isCount) {
        this.$refs.table.loadStart()
      }
      let params = {
        ordering: '-created_at',
        page: this.page,
        page_size: this.pageSize,
        status: 'pending',
        dpt_id: this.userInfo.selectedDepartment.id,
        org_id: this.userInfo.selectedOrganization.id,
      }
      if (this.userInfo.role.id == 'dr' || this.userInfo.role.id == 'da') {
        params.doctor_id = this.userInfo.id
      } else {
        params.dietitian_id = this.userInfo.id
      }

      this.$api.ppFollowUps
        .getList(params)
        .then((res) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.tableData = res.data.results
            this.total = res.data.count
            this.componentKey += 1
          }
          this.ppFollowUps = res.data.count
        })
        .catch((err) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    // 查看随访
    followUpClick(row) {
      // console.log(row)
      // return
      this.$router.push({
        name: 'PatientSetFollowUp',
        params: {
          type: 'view',
          ppid: row.project_patient,
          projectId: '',
          userId: '',
          stage: '',
          followId: row.id,
          importType: 'todo_task',
        },
      })
    },
    // 原随访完成
    // followUpClick(row) {
    //   this.$confirm(`确定关闭本条随访待办任务吗？`, '随访完成', {
    //     type: 'success',
    //   })
    //     .then(() => {
    //       this.$api.ppFollowUps
    //         .patch(row.id, {
    //           status: 'finished',
    //         })
    //         .then((res) => {
    //           this.getPPFollowUps()
    //         })
    //         .catch((err) => {
    //           this.$message.error(JSON.stringify(err))
    //         })
    //     })
    //     .catch(() => {})
    // },
    // 随访
    // 点评餐饮
    getDietRecords(isCount = false) {
      if (!isCount) {
        this.$refs.table.loadStart()
      }
      this.$api.dietRecords
        .getList({
          ordering: '-recorded_at',
          page: this.page,
          page_size: this.pageSize,
          comments__isnull: true,
          is_my_patient: true,
          dpt_id: this.userInfo.selectedDepartment.id,
          org_id: this.userInfo.selectedOrganization.id,
        })
        .then((res) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.tableData = res.data.results
            this.total = res.data.count
            this.componentKey += 1
          }
          this.dietRecords = res.data.count
        })
        .catch((err) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    dietAddComment() {
      if (this.dietCommentContent === '') {
        return this.$message.error('请输入评论内容')
      }
      this.$api.dietComments
        .create({
          content: this.dietCommentContent,
          diet_record: this.dietRecord.id,
        })
        .then((res) => {
          this.dietCommentContent = ''
          this.$message.success('发表评论成功')
          this.dietEditDialogVisible = false
          this.dietCommentDialogVisible = false
          this.getDietRecords()
        })
        .catch((err) => {
          if (err.detail === '发布内容存在违规词汇，请编辑后重新发送。') {
            this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
              confirmButtonText: '好的',
              showCancelButton: false,
              type: 'error',
            })
          } else {
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    dietLike(row) {
      this.$api.dietRecords
        .like(row.id)
        .then((res) => {
          this.getDietRecords()
          this.dietEditDialogVisible = false
          this.dietCommentDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    dietUnlike(row) {
      this.$api.dietRecords
        .unlike(row.id)
        .then((res) => {
          this.getDietRecords()
          this.dietEditDialogVisible = false
          this.dietCommentDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    dietRecordAddFoodSave() {
      this.$api.dietRecords
        .patch(this.dietRecord.id, {
          foods: this.dietRecord.foods,
        })
        .then((res) => {
          this.$message.success('保存成功')
          this.getDietRecordDetail()
          this.getDietRecords()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    // 点评餐饮

    // 点评运动
    getExerciseRecords(isCount = false) {
      if (!isCount) {
        this.$refs.table.loadStart()
      }
      this.$api.exerciseRecords
        .getList({
          ordering: '-recorded_at',
          page: this.page,
          page_size: this.pageSize,
          comments__isnull: true,
          is_my_patient: true,
          dpt_id: this.userInfo.selectedDepartment.id,
          org_id: this.userInfo.selectedOrganization.id,
        })
        .then((res) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.tableData = res.data.results
            this.total = res.data.count
            this.componentKey += 1
          }
          this.exerciseRecords = res.data.count
        })
        .catch((err) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    exerciseAddComment() {
      if (this.exerciseCommentContent === '') {
        return this.$message.error('请输入评论内容')
      }
      this.$api.exerciseComments
        .create({
          content: this.exerciseCommentContent,
          exercise_record: this.exerciseRecord.id,
        })
        .then((res) => {
          this.exerciseCommentContent = ''
          this.$message.success('发表评论成功')
          this.exerciseCommentDialogVisible = false
          this.exerciseDetailDialogVisible = false
          this.getExerciseRecords()
        })
        .catch((err) => {
          if (err.detail === '发布内容存在违规词汇，请编辑后重新发送。') {
            this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
              confirmButtonText: '好的',
              showCancelButton: false,
              type: 'error',
            })
          } else {
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    exerciseLike(row) {
      this.$api.exerciseRecords
        .like(row.id)
        .then((res) => {
          this.getExerciseRecords()
          this.exerciseCommentDialogVisible = false
          this.exerciseDetailDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    exerciseUnlike(row) {
      this.$api.exerciseRecords
        .unlike(row.id)
        .then((res) => {
          this.getExerciseRecords()
          this.exerciseCommentDialogVisible = false
          this.exerciseDetailDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    // 点评运动

    // 点评体重
    getWeightRecords(isCount = false) {
      if (!isCount) {
        this.$refs.table.loadStart()
      }
      this.$api.weightRecords
        .getList({
          ordering: '-recorded_at',
          page: this.page,
          page_size: this.pageSize,
          comments__isnull: true,
          is_my_patient: true,
          dpt_id: this.userInfo.selectedDepartment.id,
          org_id: this.userInfo.selectedOrganization.id,
        })
        .then((res) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.tableData = res.data.results
            this.total = res.data.count
            this.componentKey += 1
          }
          this.weightRecords = res.data.count
        })
        .catch((err) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    weightAddComment() {
      if (this.weightCommentContent === '') {
        return this.$message.error('请输入评论内容')
      }
      this.$api.weightComments
        .create({
          content: this.weightCommentContent,
          weight_record: this.weightRecord.id,
        })
        .then((res) => {
          this.weightCommentContent = ''
          this.$message.success('发表评论成功')
          this.weightDetailDialogVisible = false
          this.weightCommentDialogVisible = false
          this.getWeightRecords()
        })
        .catch((err) => {
          if (err.detail === '发布内容存在违规词汇，请编辑后重新发送。') {
            this.$confirm(`发布内容存在违规词汇，请编辑后重新发送。`, '提示', {
              confirmButtonText: '好的',
              showCancelButton: false,
              type: 'error',
            })
          } else {
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    weightLike(row) {
      this.$api.weightRecords
        .like(row.id)
        .then((res) => {
          this.getWeightRecords()
          this.weightDetailDialogVisible = false
          this.weightCommentDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    weightUnlike(row) {
      this.$api.weightRecords
        .unlike(row.id)
        .then((res) => {
          this.getWeightRecords()
          this.weightDetailDialogVisible = false
          this.weightCommentDialogVisible = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    // 点评体重

    // 待评估  待开营养处方  待开运动处方
    getPatientRecordState(payload, viewMode = '待评估', isCount = false) {
      if (!isCount) {
        this.$refs.table.loadStart()
      }
      this.$api.patients
        .getgetPatientRecordList({
          ordering: '-created_at',
          is_my_patient: true,
          page: this.page,
          page_size: this.pageSize,
          patient__subscriptions__project__dpt: this.userInfo.selectedDepartment.id,
          patient__subscriptions__project__dpt__organization: this.userInfo.selectedOrganization.id,
          ...payload,
          // report_state: 0,
        })
        .then((res) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.tableData = res.data.results
            this.total = res.data.count
            this.componentKey += 1
          }
          if (viewMode == '待评估') {
            this.reportStates = res.data.count
          } else if (viewMode == '待开营养处方') {
            this.nutritionStates = res.data.count
          } else if (viewMode == '待开运动处方') {
            this.exerciseStates = res.data.count
          }
        })
        .catch((err) => {
          if (!isCount) {
            this.$refs.table.loadDone()
            this.$message.error(JSON.stringify(err))
          }
        })
    },
    // 发送健康评估
    sendHealthAssessment(row) {
      this.$confirm(`确定向患者发送健康评估链接吗？`, '发送健康评估链接', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$api.patients
            .patchPatientRecordState(row.patient.user_id, {
              report_state: 1,
            })
            .then((res) => {
              this.$message.success('发送成功')
              this.getPatientRecordState({ report_state: 0 })
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch(() => {})
    },
    getNutritionDeatil(row) {
      this.dishActiveName = '1'
      this.selectedRow = row

      var nutrition_prescription = null
      if (row.pre_nutrition_prescription) {
        nutrition_prescription = row.pre_nutrition_prescription
      } else {
        nutrition_prescription = row.nutrition_prescription
      }

      if (nutrition_prescription) {
        this.$api.patients
          .getPatientNutritionPrescription(nutrition_prescription)
          .then((res) => {
            this.nutritionInfo = res.data
            this.nutritionCommentDialogVisible = true
            this.getNutritionFoods()
            this.getNutritionDishes()
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
          })
      }
    },
    sendNutrition() {
      let message = '发布成功'
      let title = '发布处方'
      let detail = '确定发布营养处方给患者吗？'
      let nutrition_state = 2
      this.$confirm(detail, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$api.patients
            .patchPatientNutritionPrescription(this.nutritionInfo.id, {
              prescribe_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              state: nutrition_state,
            })
            .then((res) => {
              this.$message.success('发送成功')
              this.nutritionCommentDialogVisible = false
              this.getPatientRecordState({ nutrition_state: 1, pre_nutrition_prescription__isnull: false }, '待开营养处方')
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
          // this.$api.patients.patchPatientRecordState(this.selectedRow.patient.user_id, {
          //   nutrition_state: nutrition_state,
          //   nutrition_publish_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
          // }).then((res) => {
          //     this.$message.success('发送成功')
          //     this.nutritionCommentDialogVisible = false
          //     this.getPatientRecordState({nutrition_state: 1}, '待开营养处方')
          //   })
          //   .catch((err) => {
          //     this.$message.error(JSON.stringify(err))
          //   })
        })
        .catch(() => {})
    },
    getNutritionDishes() {
      this.$api.nutritionDishes
        .getList({
          // page: 1,
          // page_size: 9999,
          // ordering: 'id',
          nutrition_id: this.nutritionInfo.nutrition_id,
        })
        .then((res) => {
          this.nutritionDishes = res.data
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getNutritionFoods() {
      this.$api.nutritionFoods
        .getList({
          page: 1,
          page_size: 9999,
          ordering: 'id',
          nutrition_id: this.nutritionInfo.nutrition_id,
        })
        .then((res) => {
          this.nutritionFoods = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    showFoodDetails(row) {
      this.nutritionFoodInfo = row
      this.commutatives = row.commutative_foods
      this.showFoods = true
      // console.log('====================================');
      // console.log(row);
      // console.log('====================================');
      // this.getNutritionFoodCommutative(row.food.foodid)
    },
    getNutritionFoodCommutative(id) {
      this.$api.patients
        .getNutritionFoodCommutative({
          page: 1,
          page_size: 9999,
          ordering: 'id',
          foodid: id,
        })
        .then((res) => {
          this.commutatives = res.data.results
          this.showFoods = true
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    getExercisePrescription(row) {
      this.sprotActiveName = '1'
      this.category = '热身'
      this.activeName = '1'
      this.isSave = false
      this.selectedRow = row

      var exercise_prescription = null

      if (this.selectedRow.pre_exercise_prescription) {
        exercise_prescription = this.selectedRow.pre_exercise_prescription
      } else {
        exercise_prescription = this.selectedRow.exercise_prescription
      }

      if (exercise_prescription != null) {
        this.$api.patients
          .getPatientExercisePrescription(exercise_prescription)
          .then((info) => {
            this.exerciseInfo = info.data
            this.exerciseInfo.selectedSprotTime = parseInt(info.data.exercise_duration)
            this.exerciseInfo.exercise_frequency = parseInt(info.data.exercise_frequency)
            if (row.ea_exercise_frequency) {
              this.ea_exercise_frequency = row.ea_exercise_frequency
            } else {
              this.ea_exercise_frequency = {}
            }
            this.getPpList()
            if (info.data.base_prescription) {
              this.$api.exercisePrescription
                .getDetail(info.data.base_prescription)
                .then((res) => {
                  this.exercisePrescription = res.data
                  let sprotTimes = []
                  for (let index = 10; index <= parseInt(this.exercisePrescription.exercise_duration.split('-')[1]); index++) {
                    sprotTimes.push(index)
                  }
                  this.sprotTimes = sprotTimes
                  if (!this.exerciseInfo.selectedSprotTime) this.exerciseInfo.selectedSprotTime = this.sprotTimes[this.sprotTimes.length - 1]
                  if (!this.exerciseInfo.high_thr) this.exerciseInfo.high_thr = parseInt(res.data.high_thr)
                  if (!this.exerciseInfo.low_thr) this.exerciseInfo.low_thr = parseInt(res.data.low_thr)
                  if (!this.exerciseInfo.exercise_frequency) this.exerciseInfo.exercise_frequency = parseInt(this.exercisePrescription.exercise_frequency.split('-')[1])
                  if (!this.exerciseInfo.note) this.exerciseInfo.note = res.data.note
                  this.exerciseDialogVisible = true
                })
                .catch((err) => {
                  this.$message.error(JSON.stringify(err))
                })
            }
          })
          .catch((error) => {
            this.$message.error(JSON.stringify(error))
          })
      }
    },
    sendExercise() {
      let message = '发布成功'
      let title = '发布处方'
      let detail = '确定发布运动处方给患者吗？'
      let exercise_state = 2
      this.$confirm(detail, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          let params = {
            exercise_state,
          }

          // this.$api.patients.createPatientExercisePrescription({
          //     people: this.exerciseInfo.people,
          //     age: this.exerciseInfo.age,
          //     bmi: this.exerciseInfo.bmi,
          //     rest_heartrate: this.exerciseInfo.rest_heartrate,
          //     hrr: this.exerciseInfo.hrr,
          //     low_heart_range: this.exerciseInfo.low_heart_range,
          //     high_heart_range: this.exerciseInfo.high_heart_range,
          //     patient: this.exerciseInfo.patient,
          //     exercise_duration: this.exerciseInfo.selectedSprotTime,
          //     high_thr: this.exerciseInfo.high_thr,
          //     low_thr: this.exerciseInfo.low_thr,
          //     exercise_frequency: this.exerciseInfo.exercise_frequency,
          //     note: this.exerciseInfo.note,
          //     exercise_time: this.exercisePrescription.exercise_time,
          //     max_heartrate: parseInt(this.exercisePrescription.max_heartrate),
          //     base_prescription: this.exerciseInfo.base_prescription
          //   }).then(res => {
          //     params.exercise_publish_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
          //     params.exercise_prescription = res.data.id
          //     this.$api.patients.patchPatientRecordState(this.selectedRow.patient.user_id, params)
          //       .then((res) => {
          //         this.$message.success('发送成功')
          //         this.exerciseDialogVisible = false
          //         this.getPatientRecordState({exercise_state: 1}, '待开运动处方')
          //       })
          //       .catch((err) => {
          //         this.$message.error(JSON.stringify(err))
          //       })
          //   }).catch(err => {
          //     this.$message.error(JSON.stringify(err))
          //   })

          this.$api.patients
            .patchPatientExercisePrescription(this.exerciseInfo.id, {
              exercise_duration: this.exerciseInfo.selectedSprotTime,
              high_thr: this.exerciseInfo.high_thr,
              low_thr: this.exerciseInfo.low_thr,
              exercise_frequency: this.exerciseInfo.exercise_frequency,
              note: this.exerciseInfo.note,
              exercise_time: this.exercisePrescription.exercise_time,
              max_heartrate: parseInt(this.exercisePrescription.max_heartrate),
              prescribe_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              state: exercise_state,
            })
            .then((res) => {
              this.$message.success('发送成功')
              this.exerciseDialogVisible = false
              this.getPatientRecordState({ exercise_state: 1, pre_exercise_prescription__isnull: false }, '待开运动处方')
            })
            .catch((err) => {
              this.$message.error(JSON.stringify(err))
            })
        })
        .catch((err) => {})
    },

    saveExercise() {
      this.$api.patients
        .patchPatientRecordState(this.selectedRow.patient.user_id, {
          exercise_duration: this.exerciseInfo.selectedSprotTime,
          high_thr: this.exerciseInfo.high_thr,
          low_thr: this.exerciseInfo.low_thr,
          exercise_frequency: this.exerciseInfo.exercise_frequency,
          note: this.exerciseInfo.note,
          exercise_time: this.exercisePrescription.exercise_time,
          max_heartrate: parseInt(this.exercisePrescription.max_heartrate),
        })
        .then((res) => {
          this.$message.success('保存成功')
          // this.getPatientRecordState({exercise_state: 1}, '待开运动处方')
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    handleClick(tab, event) {
      const active = this.actionsType.find((ele) => ele.code == this.activeName)
      this.category = active.label
      // this.getPpList()
    },
    // 动作详情
    getPpList() {
      this.$api.exerciseActions
        .getList({
          page: 1,
          page_size: 9999,
          ordering: 'id',
        })
        .then((res) => {
          let current_exercise_frequency = {}
          res.data.results.forEach((ele) => {
            if (this.ea_exercise_frequency.hasOwnProperty(ele.name)) {
              current_exercise_frequency[ele.name] = this.ea_exercise_frequency[ele.name]
            } else {
              current_exercise_frequency[ele.name] = ele.exercise_frequency
            }
          })
          this.current_exercise_frequency = current_exercise_frequency
          this.pptableData = res.data.results
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },

    // 待评估  待开营养处方  待开运动处方

    previewImage(url) {
      //预览图片
      this.previewSrc = url
      this.$nextTick(() => {
        this.$refs.previewImage.showViewer = true
      })
    },

    toSetPage(row) {
      this.dialogVisible = true
      //	https://cos.ap-shanghai.myqcloud.com/tangjistaging-1303867602/uploads/20230511/609076e0-f831-4db4-af77-7c932ae26a5e.mp4
      // this.videoUrl = "https://cos.ap-shanghai.myqcloud.com/tangjistaging-1303867602/uploads/20230511/609076e0-f831-4db4-af77-7c932ae26a5e.mp4"
      this.videoUrl = row.video
    },
    close() {
      this.videoUrl = ''
    },
  }, // methods end
  computed: {
    ...mapGetters(['userInfo']),
    actionsType() {
      return this.$dict.exerciseActionsType.data
    },
    exercise_duration_low() {
      if (this.exercisePrescription && this.exercisePrescription.exercise_duration) {
        return this.exercisePrescription.exercise_duration.split('-')[0]
      }
      return ''
    },
    exercise_duration_height() {
      if (this.exercisePrescription && this.exercisePrescription.exercise_duration) {
        return this.exercisePrescription.exercise_duration.split('-')[1]
      }
      return ''
    },
    exercise_frequency_low() {
      if (this.exercisePrescription && this.exercisePrescription.exercise_frequency) {
        return this.exercisePrescription.exercise_frequency.split('-')[0]
      }
      return ''
    },
    exercise_frequency_height() {
      if (this.exercisePrescription && this.exercisePrescription.exercise_frequency) {
        return this.exercisePrescription.exercise_frequency.split('-')[1]
      }
      return ''
    },
    exercise_time_low() {
      if (this.exercisePrescription && this.exercisePrescription.exercise_time) {
        return this.exercisePrescription.exercise_time.split('-')[0]
      }
      return ''
    },
    exercise_time_height() {
      if (this.exercisePrescription && this.exercisePrescription.exercise_time) {
        return this.exercisePrescription.exercise_time.split('-')[1]
      }
      return ''
    },
    nutritionFoodMap() {
      let food = {}
      this.mealType.forEach((ele) => {
        food[ele.name] = {
          ...ele,
          foods: [],
        }
      })
      if (this.nutritionFoods) {
        this.nutritionFoods.forEach((ele) => {
          for (const key in food) {
            if (Object.hasOwnProperty.call(food, key)) {
              const element = food[key]
              const mealTypeId = ele.meal_type.id
              if (element.code == mealTypeId) {
                element.foods.push(ele)
              }
            }
          }
        })
      }
      return food
    },
    nutritionDisheMap() {
      let food = {}
      this.mealType.forEach((ele) => {
        food[ele.name] = {
          ...ele,
          foods: [],
        }
      })
      if (this.nutritionDishes) {
        this.nutritionDishes.forEach((ele) => {
          for (const key in food) {
            if (Object.hasOwnProperty.call(food, key)) {
              const element = food[key]
              const mealTypeId = ele.meal_type
              if (element.label == mealTypeId) {
                element.foods.push(ele)
              }
            }
          }
        })
      }
      return food
    },
  },
}
</script>

<style scoped lang="less">
.panel {
  :deep(.el-card__body) {
    padding: 32px !important;
    height: calc(100% - 32px - 32px) !important;
  }
}

.todo-top {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .item {
    margin-right: 24px;
  }
  .selected-item {
    background-color: #00a29a !important;
    color: #ffffff;
  }
}

.diet-comment-dialog {
  :deep(.el-dialog) {
    width: 560px;
    height: 360px;
  }

  .submit-btn {
    background-color: @primaryColor;
    color: #fff;
    border-radius: 6px;
    float: right;
    margin-top: 4px;
  }
}

.diet-edit-dialog {
  :deep(.el-dialog) {
    margin-top: 5vh !important;
    margin-bottom: 0 !important;
    width: 900px;
    height: 90vh;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
      color: #5a6d86 !important;
    }
  }

  .mtext {
    position: relative;
    font-size: 16px;
    font-weight: 600;
    color: #5a6d86 !important;
    line-height: 40px;
  }

  .date {
  }

  .date-time {
  }

  .diet-image {
    display: flex;

    .box {
      width: 160px;
      height: 120px;
      background-color: #ebeef5;

      .el-image {
        width: 100%;
        height: 100%;
      }
    }

    .box.empty {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .remake {
    width: 400px;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #5a6d86;
    line-height: 20px;
  }

  .comment-num {
    display: flex;
    justify-content: space-between;
    width: 200px;
    height: 24px;
    line-height: 24px;

    .comment {
      line-height: inherit;
    }

    .like {
      line-height: inherit;

      .icon {
        float: right;
        zoom: 0.8;
      }
    }
  }

  .comment-list {
    .comment-item {
      .role-name {
      }

      .content {
        word-wrap: break-word;
        white-space: pre-line;
      }
    }
  }

  .comment-text-box {
    width: 460px;
    position: relative;

    .submit-btn {
      background-color: @primaryColor;
      color: #fff;
      border-radius: 6px;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  .food-table {
    position: relative;

    .record-btn {
      position: absolute;
      top: -50px;
      right: 0;
    }
  }
}

.diet-edit-dialog.exercise {
  :deep(.el-dialog) {
    margin-top: 5vh !important;
    margin-bottom: 0 !important;
    width: 780px;
    height: 90vh;

    .el-dialog__body {
      height: calc(100% - 68px - 98px);
      overflow: auto;
      color: #5a6d86 !important;
    }
  }
}

.sprot-info-title {
  font-size: 14px;
  line-height: 48px;
  font-weight: 600;
  color: #566085;
}

.sprot-info-title1 {
  margin-bottom: 10px;
}

.sprot-info-content {
  display: flex;
  flex-direction: row;
  // flex-wrap: wrap;
  .sprot-info-content-item {
    width: 45%;
    // .sprot-info-detail {
    //     font-size: 14px;
    //     line-height: 48px;
    //     font-weight: 600;
    //     color: #566085;
    // }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}

.sprot-info-save {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sprot-info-pre {
  width: 130px;
  display: inline-block;
}

.sprot-info-red {
  color: red;
}

.action-content {
  .action-item {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .action-item-left {
      display: flex;
      flex-direction: column;
      width: 35%;
      align-items: center;
      .action-item-image {
        width: 100%;
        height: 200px;
      }
      span {
        font-size: 14px;
        margin-top: 20px;
        margin-bottom: 20px;
        font-weight: 600;
      }
    }

    .action-item-right {
      display: flex;
      flex-direction: column;
      width: 35%;
      margin-left: 30px;
      span {
        font-size: 14px;
        margin-top: 15px;
        font-weight: 600;
      }
      span:nth-child(2n) {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}

.nutrition-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 85%;

  div {
    width: 100%;
  }
  .nutrition-info-border {
    text-align: center;
    border: 1px solid #eeeeee;

    span {
      display: block;
    }

    span:last-child {
      border-top: 1px solid #eeeeee;
    }
  }
  .nutrition-info-noborder {
    border-right-width: 0;
  }
  .nutrition-info-notopborder {
    border-top-width: 0;
  }
}

.nutrition-food {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 85%;
  margin-top: 20px;

  .nutrition-food1 {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    .nutrition-food-title {
      font-size: 14px;
      line-height: 28px;
      background-color: rgba(0, 153, 255, 1);
      color: #ffffff;
      padding-left: 14px;
      padding-right: 14px;
      border-radius: 14px;
    }
  }
}

.nutrition-food-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  .nutrition-food-img {
    width: 60px;
    height: 60px;
  }
  .nutrition-food-detail {
    font-size: 14px;
    margin-top: 5px;
  }
}

.nutrition-food2 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  border-top: 1px solid #eeeeee;
  overflow: scroll;
  flex: 1;
}

.show-foods {
  display: flex;
  flex-direction: column;
  height: 315px;
}

.nutrition-dish-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 85%;
  div {
    width: 50%;
    text-align: center;
    font-size: 14px;
    line-height: 34px;
    border: 1px solid #eeeeee;
    margin-top: 5px;
  }
}

.nutrition-dish-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 85%;
  div {
    width: 50%;
    text-align: center;
    font-size: 14px;
    line-height: 70px;
    border: 1px solid #eeeeee;
  }

  .nutrition-dish-imgdiv {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;

    .nutrition-dish-img {
      height: 80%;
    }
  }
}

.nutrition-edit-dialog {
  :deep(.el-dialog) {
    margin-top: 5vh !important;
    margin-bottom: 0 !important;
    width: 900px;
    height: 90vh;

    .el-dialog__body {
      height: calc(100% - 80px);
      overflow: auto;
      color: #5a6d86 !important;
    }
  }
}

.creation-dialog {
  :deep(.el-dialog) {
    width: 1080px;
    height: 90vh;
    margin-top: 5vh !important;
    background-color: transparent;

    .el-dialog__body {
      margin-top: 20px !important;
      height: 90vh;
    }
  }
}
</style>
