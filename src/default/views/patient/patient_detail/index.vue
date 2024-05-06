<template>
  <div id="scollcard" class="panel scroll">
    <el-breadcrumb separator="-" class="breadcrumb-reset">
      <el-breadcrumb-item :to="{ path: '/patient' }">
        <icon-box icon-name="menu_wdhz" w="20" h="20" box-h="90" box-w="20" style="margin-left: 16px"></icon-box>
        <b>我的患者</b>
      </el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="card" v-loading="loading" style="margin-top: 0; min-height: calc(100vh - 240px)">
      <div class="patient-info">
        <div class="base">
          <div class="avatar">
            <el-avatar fit="cover" :size="62" :src="patient.avatar_url"></el-avatar>
          </div>
          <div class="name">{{ patient.name }}</div>
          <div class="sex">
            <icon-box v-if="patient.sex === $enum.SEX.M" icon-name="sex_male" w="42" h="25" box-w="42" box-h="62"></icon-box>
            <icon-box v-if="patient.sex === $enum.SEX.F" icon-name="sex_female" w="42" h="25" box-w="42" box-h="62"></icon-box>
          </div>
          <div class="tag age">{{ patient.user_profile.birthday | calcAge }}岁</div>
          <div v-if="ppInfo.stage" class="tag stage">{{ ppInfo.stage }}</div>
          <div class="tag id">No.{{ patient.user_id }}</div>

          <div class="btn-group right">
            <m-button v-auth="'patient.weightLossReport'" plain @click="toLoseWeightPage">减重报告</m-button>
            <m-button v-auth="'patient.followUpRecord'" plain @click="toFollowUpPage">随访</m-button>
            <m-button v-auth="'patient.sendMessage'" @click="sendMessageClick">
              <icon-box icon-name="message" w="20" h="20" box-w="20"></icon-box>
              <span style="line-height: 23px; margin-left: 5px">发消息</span>
            </m-button>
            <m-button @click="toSetRecipe" v-if="treatResultViews === '饮食结果'"> 为TA配餐 </m-button>
            <m-button @click="recommendExerciseClick" v-if="treatResultViews === '运动结果'"> 推荐运动 </m-button>
          </div>
        </div>
        <div class="base2">
          <div class="item">手机号：{{ patient.phone_number | phoneFilter }}</div>
          <!-- <div class="item">身份证：{{ patient.id_number }}</div> -->
          <div class="item">出生日期：{{ patient.user_profile.birthday | dateFormatCN }}</div>
        </div>
        <div class="tags">
          <span>患者标签：</span>
          <span v-if="patient.tags && patient.tags.length === 0">暂无</span>
          <template v-else>
            <span class="tag mr_8" v-for="tag in patient.tags" :key="tag.id">#{{ tag.name }}</span>
          </template>
        </div>
        <div class="remake">
          <span>服务备注：</span>
          <span>{{ lastMemoTexe }}</span>
        </div>
      </div>

      <div class="treat-info" style="margin-bottom: 20px">
        <div class="title-info flex mb_14">
          <div class="project-name">{{ project.name }}</div>
          <el-tag>{{ $dict.projectType.getLabel(project.project_type) }}</el-tag>
          <m-tag circle :status="project.status" style="margin-left: 6px; border-radius: 13px !important"></m-tag>
          <el-tag v-if="ppInfo.stage" style="margin-left: 6px">{{ ppInfo.stage }}</el-tag>
          <div class="date">{{ ppInfo.joined_at | dateFormatCN }}-{{ new Date() | dateFormatCN }}</div>
        </div>

        <div class="team-list flex" v-if="project.team">
          <div class="team-name flex mr_20" v-for="team in [project.teams]" :key="team.id">
            <div class="avatar">
              <el-avatar fit="cover" :size="20" :src="team.leader && team.leader.avatar_url ? team.leader.avatar_url : require('@/common/assets/bg/default_team_avatar.png')"></el-avatar>
            </div>
            <div class="name">{{ team.leader && team.leader.name }}</div>
            <icon-box icon-name="tuanduivibiao" w="10" h="11" box-h="20"></icon-box>
          </div>
        </div>

        <div class="stat-info flex">
          <div class="stat-card ysdk">
            <div class="bg"></div>
            <div class="icon">
              <icon-box icon-name="lj_ysdk" w="31" h="35"></icon-box>
            </div>
            <div class="sub desc">饮食打卡</div>
            <div class="count">
              <span>{{ patientStat.diet_stats.count }}</span>
              <span class="sub">次</span>
              <span>{{ patientStat.diet_stats.days }}</span>
              <span class="sub">天</span>
            </div>
          </div>
          <div class="stat-card yddk">
            <div class="bg"></div>
            <div class="icon">
              <icon-box icon-name="lj_yddk" w="31" h="35"></icon-box>
            </div>
            <div class="sub desc">运动打卡</div>
            <div class="count">
              <span>{{ patientStat.exercise_stats.count }}</span>
              <span class="sub">次</span>
              <span>{{ patientStat.exercise_stats.days }}</span>
              <span class="sub">天</span>
              <!--              <span>3235</span>-->
              <!--              <span class="sub">分</span>-->
            </div>
          </div>
          <div class="stat-card tzdk">
            <div class="bg"></div>
            <div class="icon">
              <icon-box icon-name="lj_tzdk" w="31" h="35"></icon-box>
            </div>
            <div class="sub desc">体重打卡</div>
            <div class="count">
              <span>{{ patientStat.weight_stats.count }}</span>
              <span class="sub">次</span>
              <span>{{ patientStat.weight_stats.days }}</span>
              <span class="sub">天</span>
            </div>
          </div>
          <div class="stat-card ysdk">
            <div class="bg"></div>
            <div class="icon">
              <icon-box icon-name="lj_ywdk" w="31" h="35"></icon-box>
            </div>
            <div class="sub desc">腰围打卡</div>
            <div class="count">
              <span>{{ patientStat.weight_stats.count }}</span>
              <span class="sub">次</span>
              <span>{{ patientStat.weight_stats.days }}</span>
              <span class="sub">天</span>
            </div>
          </div>
          <div class="stat-card zx">
            <div class="bg"></div>
            <div class="icon">
              <icon-box icon-name="lj_zxsc" w="31" h="35"></icon-box>
            </div>
            <div class="sub desc">累计在线时长（分）</div>
            <div class="count">
              <span>{{ patientStat.online_minutes }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="treat-result-btn-group" :style="'position: ' + positionFiexd + ';' + (positionFiexd == 'fixed' ? 'top: 60px' : '')">
        <el-radio-group @change="treatResultViewsChange" class="radio-group" v-model="treatResultViews">
          <el-radio-button v-auth="'patient.healthRecord'" class="radio-group-item" label="健康档案"></el-radio-button>
          <el-radio-button v-auth="'patient.exercisePrescription'" class="radio-group-item" label="运动处方"></el-radio-button>
          <el-radio-button v-auth="'patient.nutritionalPrescription'" class="radio-group-item" label="营养处方"></el-radio-button>
          <el-radio-button v-auth="'patient.healthAssessment'" class="radio-group-item" label="健康评估"></el-radio-button>
          <el-radio-button v-auth="'patient.interventionProgram'" class="radio-group-item" label="干预方案"></el-radio-button>
          <el-radio-button v-auth="'patient.reportingCenter'" class="radio-group-item" label="报告中心"></el-radio-button>
        </el-radio-group>
      </div>

      <div v-if="positionFiexd == 'fixed'" style="height: 46px"></div>

      <!-- 健康档案 -->
      <div class="patient-archive" v-if="treatResultViews === '健康档案'">
        <healthRecord v-if="!loading" :ppInfo="ppInfo" :previewImage="previewImage" />
      </div>
      <!-- 健康档案结束 -->

      <!-- 运动处方 -->
      <div v-if="treatResultViews === '运动处方'">
        <!-- 0 待评估  1 待填写  2 未完成  3 已评估 -->
        <div v-if="report_state == 3 && exercise_state == 0" class="sprot-info-title" style="margin-top: 30px">用户当前为禁止运动状态，无需开具运动处方</div>
        <div v-else-if="report_state == 0 && exercise_id == null" class="sprot-info-title" style="margin-top: 30px">待评估</div>
        <div v-else-if="report_state == 1 && exercise_id == null" class="sprot-info-title" style="margin-top: 30px">待填写问卷</div>
        <div v-else-if="report_state == 2 && exercise_id == null" class="sprot-info-title" style="margin-top: 30px">问卷填写中</div>
        <div v-else-if="report_state == 3 && exercise_id == null" class="sprot-info-title" style="margin-top: 30px">系统暂未生成运动处方</div>
        <div v-else-if="exercise_id != null" style="padding: 20px; position: relative">
          <m-button @click="sendExercise" style="position: absolute; right: 20px; top: 14px; z-index: 999" h="36px">{{ exercise_state == 1 ? '发送给患者' : '撤回' }}</m-button>
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
                      <el-select :disabled="exercise_state != 1" v-model="exerciseInfo.selectedSprotTime" style="width: 200px" placeholder="请选择运动时长">
                        <el-option v-for="(item, index) in sprotTimes" :key="index" :label="item" :value="item"> </el-option>
                      </el-select>
                      <span> 分钟</span>
                    </el-form-item>
                    <el-form-item label-width="130px" label=" 靶心率范围： " prop="name">
                      <el-input :disabled="exercise_state != 1" v-model="exerciseInfo.low_thr" type="text" placeholder="请输入" style="width: 90px"></el-input>
                      <span> ~ </span>
                      <el-input :disabled="exercise_state != 1" v-model="exerciseInfo.high_thr" type="text" placeholder="请输入" style="width: 90px"></el-input>
                      <span> 次/分钟</span>
                    </el-form-item>
                    <el-form-item label-width="130px" label=" 训练频率： " prop="name">
                      <el-select :disabled="exercise_state != 1" v-model="exerciseInfo.exercise_frequency" style="width: 200px" placeholder="请选择训练频率">
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
                  <el-input :disabled="exercise_state != 1" v-model="exerciseInfo.note" type="textarea" :rows="4" placeholder="请输入注意事项" style="width: 500px"></el-input>
                </el-form-item>
              </el-form>
              <!-- <div class="sprot-info-save">
                  <m-button v-if="exercise_state != 2" plain @click="saveExercise">保存</m-button>
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
                <m-button v-if="exercise_state != 2" plain @click="saveAction">{{ isSave ? '保存' : '编辑' }}</m-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 运动处方结束 -->

      <!-- 营养处方 -->
      <div v-if="treatResultViews === '营养处方'">
        <div v-if="report_state == 0 && nutrition_id == null" class="sprot-info-title" style="margin-top: 30px">待评估</div>
        <div v-else-if="report_state == 1 && nutrition_id == null" class="sprot-info-title" style="margin-top: 30px">待填写问卷</div>
        <div v-else-if="report_state == 2 && nutrition_id == null" class="sprot-info-title" style="margin-top: 30px">问卷填写中</div>
        <div v-else-if="report_state == 3 && nutrition_id == null" class="sprot-info-title" style="margin-top: 30px">系统暂未生成营养处方</div>
        <div v-else-if="nutrition_id != null" style="padding-top: 20px; position: relative">
          <m-button @click="sendNutrition" style="position: absolute; right: 20px; top: 14px; z-index: 999" h="36px">{{ nutrition_state == 1 ? '发送给患者' : '撤回' }}</m-button>
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
      </div>
      <!-- 营养处方结束 -->

      <!-- 健康评估 -->
      <div v-if="treatResultViews === '健康评估'">
        <div v-if="report_state == 0 && exercise_id == null && nutrition_id == null" class="sprot-info-title" style="margin-top: 30px">待评估</div>
        <div v-if="report_state == 1 && exercise_id == null && nutrition_id == null" class="sprot-info-title" style="margin-top: 30px">待填写问卷</div>
        <div v-if="report_state == 2 && exercise_id == null && nutrition_id == null" class="sprot-info-title" style="margin-top: 30px">问卷填写中</div>
        <div v-if="report_state == 3 || (exercise_id != null && nutrition_id != null)" class="evaluationreport-content">
          <div @click="toEvaluationreport" class="evaluationreport-info">
            <img src="@/common/assets/icons/Evaluationreport.svg" />
            <div>查看评估报告</div>
          </div>
          <div @click="toQuestionnaire" class="evaluationreport-info">
            <img src="@/common/assets/icons/questionnaire.svg" />
            <div>查看问卷</div>
          </div>
        </div>
      </div>
      <!-- 健康评估结束 -->

      <!-- 干预方案 -->
      <div class="patient-solution" v-if="treatResultViews === '干预方案'">
        <div>
          <m-button h="40px" class="right mb_20" @click="toSetSolutionPage('create')">创建干预方案</m-button>
        </div>
        <m-view-table class="mt_20" ref="patientSolutionTable" :data="solutionData" height="303" :total="solutionTotal" :page-sizes="[10, 15, 20]" :page-size.sync="solutionPageSize" :current-page.sync="solutionPage" :get-data-func="getPpIntervs">
          <el-table-column prop="id" label="干预方案编号" align="center" width="140"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="方案名称" align="center"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="created_at" label="配置日期" align="center" min-width="160">
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="is_enabled" label="状态" width="70" align="center">
            <template v-slot="scope">
              <el-tag v-if="scope.row.is_enabled" type="success" effect="dark">启用</el-tag>
              <el-tag v-else type="info" effect="dark">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="编辑" @click.native="toSetSolutionPage('edit', scope.row)"></icon-box>
                <icon-box icon-name="table_delete" w="39" h="39" box-w="39" style="cursor: pointer" title="删除" @click.native="deletePatientSolution(scope.row)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-view-table>
      </div>
      <!-- 干预方案结束 -->

      <!-- 报告中心 -->
      <div class="patient-report" v-if="treatResultViews === '报告中心'">
        <el-tabs v-model="reportActiveName" @tab-click="reportTabsClick">
          <el-tab-pane v-for="(pane, index) in reportPanes" :label="pane.label" :name="pane.name" :key="index"></el-tab-pane>
        </el-tabs>
        <m-view-table ref="reportTable" :data="reviewTableData" height="303" :total="reviewTotal" :page-sizes="[10, 15, 20]" :page-size.sync="reviewPageSize" :current-page.sync="reviewPage" :get-data-func="getReportData">
          <el-table-column prop="id" label="报告记录ID" align="center" min-width="70"> </el-table-column>
          <el-table-column show-overflow-tooltip prop="col2" label="上传时间" align="center" min-width="100">
            <template v-slot="scope">
              {{ scope.row.created_at | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="col3" label="包含图片" align="center" min-width="80">
            <template v-slot="scope">
              {{ scope.row.images.length }}
            </template>
          </el-table-column>
          <el-table-column prop="col4" label="包含报告" min-width="220" align="center">
            <template v-slot="scope">
              {{ recordTypes(scope.row.include_record_types) }}
            </template>
          </el-table-column>
          <el-table-column prop="col5" label="审录状态" min-width="70" align="center">
            <template v-slot="scope">
              <el-tag v-if="scope.row.status == 'pending'" color="#8B96A9">待审录</el-tag>
              <el-tag v-else color="#09C582">已审录</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160px">
            <template v-slot="scope">
              <div class="flex justify_center">
                <icon-box v-if="scope.row.status == 'pending'" icon-name="table_edit" w="39" h="39" box-w="39" style="cursor: pointer" title="审录" @click.native="toOcrDetailPage('proof', scope.row.id)"></icon-box>
                <icon-box v-else icon-name="table_detail" w="39" h="39" box-w="39" style="cursor: pointer" title="详情" @click.native="toOcrDetailPage('view', scope.row.id)"></icon-box>
              </div>
            </template>
          </el-table-column>
        </m-view-table>
      </div>
      <!-- 报告中心结束 -->
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

    <el-dialog title="记录饮食" :visible.sync="todayDietRecordDialogVisible" class="today-record-dialog">
      <el-form>
        <el-row>
          <el-col :span="9">
            <el-form-item label="选择餐段" required>
              <el-select v-model="todayDietRecordMeal" placeholder="请选择餐段" @change="todayDietRecordAddFoodTableData = []" style="width: 220px">
                <el-option v-for="(meal, index) in $dict.mealType.data" :key="'meal' + index" :label="meal.label" :value="meal.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用餐时间" required>
              <el-time-picker v-model="todayDietRecordedAt" placeholder="请选择用餐时间" value-format="HH:mm:ss"> </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="备注">
              <el-input class="mt_20" type="textarea" :rows="5" resize="none" placeholder="请输入备注" v-model="todayDietRecordedInfo" style="width: 420px; position: relative; top: -20px"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="food-table">
        <m-button class="record-btn" @click="todayDietRecordAddFoodClick" h="40px"> 添加食物/菜肴 </m-button>
        <m-view-table :data="todayDietRecordAddFoodTableData" height="303" highlight-current-row hide-loading hide-pagination>
          <el-table-column show-overflow-tooltip label="餐段" align="center" min-width="80">
            <template v-slot="scope">
              {{ scope.row.meal | mealType }}
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
              <m-button type="danger" w="54px" h="32px" class="p_0" @click="todayDietRecordAddFoodTableData.splice(scope.$index, 1)"> 删除 </m-button>
            </template>
          </el-table-column>
        </m-view-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="todayDietRecordDialogVisible = false">关 闭</m-button>
        <m-button @click="saveTodayDiet">保 存</m-button>
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

    <el-dialog title="记录体重" :visible.sync="todayWeightRecordDialogVisible" class="today-record-dialog weight">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="选择时段" required>
              <el-select v-model="todayWeightRecordTimerPeriod" placeholder="请选择时段" style="width: 100%">
                <el-option v-for="(period, index) in $dict.weightRecordTimePeriod.data" :key="'period' + index" :label="period.label" :value="period.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="体重" required>
              <el-input v-model="todayWeightRecordWeightValue" placeholder="请输入体重" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测量时间" required>
              <el-time-picker v-model="todayDietRecordedAt" placeholder="请选择测量时间" value-format="HH:mm:ss" style="width: 100%"> </el-time-picker>
            </el-form-item>
            <el-form-item label="腰围" required>
              <el-input v-model="todayWeightRecordWaistlineValue" placeholder="请输入腰围" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="todayWeightRecordDialogVisible = false">关 闭</m-button>
        <m-button @click="saveTodayWeight">保 存</m-button>
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
    <el-dialog title="生活习惯历史记录" :visible.sync="scaleHistoryVisible" class="scale-history-dialog">
      <el-table ref="scaleHistoryTable" :data="patientInfoRecords" height="350">
        <el-table-column prop="id" label="记录ID" width="80"> </el-table-column>
        <el-table-column show-overflow-tooltip prop="creator.name" label="反馈者" min-width="120"> </el-table-column>
        <el-table-column show-overflow-tooltip prop="title" label="完成时间" min-width="200">
          <template v-slot="scope">
            <span>{{ scope.row.created_at | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template v-slot="scope">
            <div class="flex justify_center">
              <icon-box icon-name="table_detail" w="39" h="39" box-w="39" style="cursor: pointer" title="详情" @click.native="toDetailPage(scope.row)"></icon-box>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <m-button type="default" @click="scaleHistoryVisible = false">关 闭</m-button>
      </span>
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

    <calendar v-if="patient.user_id" ref="calendar" :patientId="patient.user_id" @change="changeDate"></calendar>
  </div>
</template>

<script>
import archiveMixin from './archiveMixin'
import solutionMixin from './solutionMixin'
import weightMixin from './weightMixin'
import dietMixin from './dietMixin'
import exerciseMixin from './exerciseMixin'
import reportMixin from './reportMixin'
import { mapActions, mapGetters } from 'vuex'
import image from '../../../lemon-imui/components/message/image.vue'
import dayjs from 'dayjs'
import calendar from './components/calendar.vue'
import healthRecord from './components/healthRecord.vue'

export default {
  components: { image, calendar, healthRecord },
  name: 'PatientDetail',
  mixins: [archiveMixin, solutionMixin, weightMixin, dietMixin, exerciseMixin, reportMixin],
  data() {
    return {
      ppid: '',
      treatResultViews: '健康档案',

      patientStat: {
        diet_stats: {
          stats: [],
        },
        weight_stats: {
          stats: [],
        },
        exercise_stats: {
          stats: [],
        },
      },
      chartOptions: {},
      loading: true,

      previewSrc: '',
      ppInfo: {
        project: {
          teams: {},
        },
        patient: {
          user_profile: {},
        },
        team: {
          leader: {},
        },
      },
      // 吸顶参数
      positionFiexd: 'relative',

      sprotActiveName: '1',

      // 动作详情
      category: '热身',
      activeName: '1',
      isSave: false,
      pptableData: [],

      ea_exercise_frequency: {},
      current_exercise_frequency: {},

      // 营养处方
      dishActiveName: '1',
      mealType: [],
      showFoods: false,

      report_state: 0, // 0 待评估  1 待填写  2 未完成  3 已评估
      exercise_state: 0, // 0 无需开通  1 未开  2 已开
      nutrition_state: 1, // 1 未开  2 已开
      exercise_id: null,
      nutrition_id: null,

      exercisePrescription: {},

      // 运动时长选择
      sprotTimes: [],
      exerciseInfo: {},
      sprotFrequencys: [1, 2, 3, 4, 5, 6, 7],

      nutritionInfo: {},
      nutritionDishes: [],
      nutritionFoods: [],

      // 可交换食材
      nutritionFoodInfo: {},
      commutatives: [],

      dialogVisible: false,
      videoUrl: '',
      changeDateFiled: '',
    }
  },
  watch: {
    $route({ query }) {
      this.setViews()
    },
  },
  filters: {
    phoneFilter: function (v) {
      if (v && v.length >= 7) {
        return v.substring(0, 3) + '****' + v.substring(7)
      }
      return v
    },
  },
  mounted() {
    const permissions = this.userInfo.func_permissions.split(',')
    if (permissions.includes('patient.reportingCenter')) {
      this.treatResultViews = '报告中心'
    }
    if (permissions.includes('patient.interventionProgram')) {
      this.treatResultViews = '干预方案'
    }
    if (permissions.includes('patient.healthAssessment')) {
      this.treatResultViews = '健康评估'
    }
    if (permissions.includes('patient.nutritionalPrescription')) {
      this.treatResultViews = '营养处方'
    }
    if (permissions.includes('patient.exercisePrescription')) {
      this.treatResultViews = '运动处方'
    }
    if (permissions.includes('patient.healthRecord')) {
      this.treatResultViews = '健康档案'
    }

    this.ppid = this.$route.params.id
    // this.setViews()
    this.getPpInfo()
    // 吸顶效果
    setTimeout(() => {
      document.getElementById('scollcard').addEventListener('scroll', (e) => {
        if (e.target.scrollTop > 470) {
          this.positionFiexd = 'fixed'
        } else {
          this.positionFiexd = 'relative'
        }
      })
    }, 2000)

    this.getMealType()
  },
  methods: {
    changeDate(e) {
      if (this.changeDateFiled == 'todayWeightDatePicker') {
        this.todayWeightDatePicker = e
        this.getTodayWeightRecord()
      } else if (this.changeDateFiled == 'todayDietDatePicker') {
        this.todayDietDatePicker = e
        this.getTodayDietRecord()
      } else if (this.changeDateFiled == 'todayExerciseDatePicker') {
        this.todayExerciseDatePicker = e
        this.getTodayExerciseRecord()
      }
    },
    openCalendar(filed) {
      this.changeDateFiled = filed
      this.$refs['calendar'].open(this[filed])
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
        this.patchPatientRecordState(
          {
            ea_exercise_frequency: current,
          },
          '保存成功'
        )
      } else {
        this.isSave = true
      }
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
    sendNutrition() {
      let message = '发布成功'
      let title = '发布处方'
      let detail = '确定发布营养处方给患者吗？'
      let nutrition_state = 2
      // 发送
      if (this.nutrition_state == 1) {
        // 撤回
      } else {
        message = '撤回成功'
        title = '撤回处方'
        detail = '确定撤回营养处方吗？\n撤回后患者将无法看到处方'
        nutrition_state = 1
      }
      this.$confirm(detail, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          let params = {
            nutrition_state,
          }

          if (this.nutrition_state == 1) {
            this.$api.patients
              .patchPatientNutritionPrescription(this.nutritionInfo.id, {
                prescribe_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                state: nutrition_state,
              })
              .then((res) => {
                this.$message.success(message)
                this.isSave = false
                this.getPatientRecordState()
              })
              .catch((err) => {
                this.isSave = false
                this.$message.error(JSON.stringify(err))
              })
          } else {
            this.$api.patients
              .recallPatientNutritionPrescription(this.nutritionInfo.id)
              .then((res) => {
                this.$message.success(message)
                this.isSave = false
                this.getPatientRecordState()
              })
              .catch((err) => {
                this.isSave = false
                this.$message.error(JSON.stringify(err))
              })
            // this.patchPatientRecordState(params, message)
          }

          // if (this.nutrition_state == 1) {
          //   params.nutrition_publish_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
          // }
          // this.patchPatientRecordState(params, message)
        })
        .catch(() => {})
    },
    getNutritionDeatil(id) {
      this.$api.patients
        .getPatientNutritionPrescription(id)
        .then((res) => {
          this.nutritionInfo = res.data
          this.getNutritionFoods()
          this.getNutritionDishes()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    sendExercise() {
      let message = '发布成功'
      let title = '发布处方'
      let detail = '确定发布运动处方给患者吗？'
      let exercise_state = 2
      // 发送
      if (this.exercise_state == 1) {
        // 撤回
      } else {
        message = '撤回成功'
        title = '撤回处方'
        detail = '确定撤回运动处方吗？\n撤回后患者将无法看到处方'
        exercise_state = 1
      }
      this.$confirm(detail, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          let params = {
            exercise_state,
          }
          if (this.exercise_state == 1) {
            // this.$api.patients.createPatientExercisePrescription({
            //   people: this.exerciseInfo.people,
            //   age: this.exerciseInfo.age,
            //   bmi: this.exerciseInfo.bmi,
            //   rest_heartrate: this.exerciseInfo.rest_heartrate,
            //   hrr: this.exerciseInfo.hrr,
            //   low_heart_range: this.exerciseInfo.low_heart_range,
            //   high_heart_range: this.exerciseInfo.high_heart_range,
            //   patient: this.exerciseInfo.patient,
            //   exercise_duration: this.exerciseInfo.selectedSprotTime,
            //   high_thr: this.exerciseInfo.high_thr,
            //   low_thr: this.exerciseInfo.low_thr,
            //   exercise_frequency: this.exerciseInfo.exercise_frequency,
            //   note: this.exerciseInfo.note,
            //   exercise_time: this.exercisePrescription.exercise_time,
            //   max_heartrate: parseInt(this.exercisePrescription.max_heartrate),
            //   base_prescription: this.exerciseInfo.base_prescription
            // }).then(res => {
            //   params.exercise_publish_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
            //   params.exercise_prescription = res.data.id
            //   this.patchPatientRecordState(params, message)
            // }).catch(err => {
            //   this.$message.error(JSON.stringify(err))
            // })

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
                // params.exercise_publish_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
                // this.patchPatientRecordState(params, message)
                this.$message.success(message)
                this.isSave = false
                this.getPatientRecordState()
              })
              .catch((err) => {
                this.isSave = false
                this.$message.error(JSON.stringify(err))
              })

            // params.exercise_duration = this.exerciseInfo.selectedSprotTime
            // params.high_thr = this.exerciseInfo.high_thr
            // params.low_thr = this.exerciseInfo.low_thr
            // params.exercise_frequency = this.exerciseInfo.exercise_frequency
            // params.note = this.exerciseInfo.note
            // params.exercise_time = this.exercisePrescription.exercise_time
            // params.max_heartrate = parseInt(this.exercisePrescription.max_heartrate)
          } else {
            this.$api.patients
              .recallPatientExercisePrescription(this.exerciseInfo.id)
              .then((res) => {
                this.$message.success(message)
                this.isSave = false
                this.getPatientRecordState()
              })
              .catch((err) => {
                this.isSave = false
                this.$message.error(JSON.stringify(err))
              })
            // this.patchPatientRecordState(params, message)
          }
        })
        .catch(() => {})
    },
    saveExercise() {
      this.patchPatientRecordState(
        {
          exercise_duration: this.exerciseInfo.selectedSprotTime,
          high_thr: this.exerciseInfo.high_thr,
          low_thr: this.exerciseInfo.low_thr,
          exercise_frequency: this.exerciseInfo.exercise_frequency,
          note: this.exerciseInfo.note,
          exercise_time: this.exercisePrescription.exercise_time,
          max_heartrate: parseInt(this.exercisePrescription.max_heartrate),
        },
        '保存成功'
      )
    },
    patchPatientRecordState(payload, message) {
      this.$api.patients
        .patchPatientRecordState(this.patient.user_id, payload)
        .then((res) => {
          this.$message.success(message)
          this.isSave = false
          this.getPatientRecordState()
        })
        .catch((err) => {
          this.isSave = false
          this.$message.error(JSON.stringify(err))
        })
    },
    getPatientRecordState() {
      this.$api.patients
        .getPatientRecordState(this.patient.user_id)
        .then((res) => {
          this.report_state = res.data.report_state
          this.exercise_state = res.data.exercise_state
          this.nutrition_state = res.data.nutrition_state
          if (res.data.pre_exercise_prescription) {
            this.exercise_id = res.data.pre_exercise_prescription
          } else {
            this.exercise_id = res.data.exercise_prescription
          }
          if (res.data.pre_nutrition_prescription) {
            this.nutrition_id = res.data.pre_nutrition_prescription
          } else {
            this.nutrition_id = res.data.nutrition_prescription
          }
          if (this.exercise_id != null) {
            this.$api.patients
              .getPatientExercisePrescription(this.exercise_id)
              .then((info) => {
                this.exerciseInfo = info.data
                this.exerciseInfo.selectedSprotTime = parseInt(info.data.exercise_duration)
                this.exerciseInfo.exercise_frequency = parseInt(info.data.exercise_frequency)
                if (info.data.base_prescription) {
                  this.getExercisePrescription(info.data.base_prescription)
                }
              })
              .catch((error) => {
                this.$message.error(JSON.stringify(error))
              })
          }
          if (this.nutrition_id) {
            this.getNutritionDeatil(this.nutrition_id)
          }
          if (res.data.ea_exercise_frequency) {
            this.ea_exercise_frequency = res.data.ea_exercise_frequency
          }
          this.getPpList()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    getExercisePrescription(id) {
      this.$api.exercisePrescription
        .getDetail(id)
        .then((res) => {
          this.exercisePrescription = res.data
          let sprotTimes = []
          for (let index = 10; index <= parseInt(this.exercisePrescription.exercise_duration.split('-')[1]); index++) {
            sprotTimes.push(index)
          }
          this.sprotTimes = sprotTimes
          if (this.exercise_state == 1) {
            if (!this.exerciseInfo.selectedSprotTime) this.exerciseInfo.selectedSprotTime = this.sprotTimes[this.sprotTimes.length - 1]
            if (!this.exerciseInfo.high_thr) this.exerciseInfo.high_thr = parseInt(res.data.high_thr)
            if (!this.exerciseInfo.low_thr) this.exerciseInfo.low_thr = parseInt(res.data.low_thr)
            if (!this.exerciseInfo.exercise_frequency) this.exerciseInfo.exercise_frequency = parseInt(this.exercisePrescription.exercise_frequency.split('-')[1])
            if (!this.exerciseInfo.note) this.exerciseInfo.note = res.data.note
          }
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
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
    // 查看报告
    toEvaluationreport() {
      window.open('/evaluationReport/index.html' + '?' + btoa('user_id=' + this.patient.user_id), '_blank')
    },
    // 查看问卷
    toQuestionnaire() {
      window.open('/questionnaire/index.html' + '?' + btoa('user_id=' + this.patient.user_id), '_blank')
    },
    showFoodDetails(row) {
      this.nutritionFoodInfo = row
      this.commutatives = row.commutative_foods
      this.showFoods = true
    },
    getMealType() {
      this.mealType = this.$dict.nutritionalBloodMealType.data
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
    handleClick(tab, event) {
      const active = this.actionsType.find((ele) => ele.code == this.activeName)
      this.category = active.label
      // this.getPpList()
    },
    ppInfoLoadDone() {
      this.getPatientStat()
      this.getPatientRecordState()
      this.treatResultViewsChange(this.treatResultViews)
    },
    setViews() {
      let index = 0
      if (this.$route.query.views) {
        index = parseInt(this.$route.query.views)
      }
      switch (index) {
        case 0:
          this.treatResultViews = '健康档案'
          break
        case 1:
          this.treatResultViews = '运动处方'
          break
        case 2:
          this.treatResultViews = '营养处方'
          break
        case 3:
          this.treatResultViews = '健康评估'
          break
        case 4:
          this.treatResultViews = '干预方案'
          break
        case 5:
          this.treatResultViews = '报告中心'
          break
        default:
          this.treatResultViews = '健康档案'
      }
    },
    getPpInfo() {
      this.loading = true
      this.$api.myProjectPatient
        .getDetail(this.ppid)
        .then((res) => {
          this.ppInfo = res.data
          this.loading = false
          this.ppInfoLoadDone()
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    /**
     * 获取患者统计数据（页面加载时使用）
     * @param kind 统计粒度
     * @param gte 大于等于
     * @param lte 小于等于
     */
    getPatientStat(kind = 'month', gte = '', lte = '') {
      const params = {
        kind: kind,
      }
      this.$api.patients
        .getStat(this.patient.user_id, params)
        .then((res) => {
          this.patientStat = res.data
          this.loading = false
        })
        .catch((err) => {
          this.$message.error(JSON.stringify(err))
        })
    },
    /**
     * 获取患者统计数据（子模块渲染图表时使用）
     * @param kind 统计粒度
     * @param gte 大于等于
     * @param lte 小于等于
     */
    getPatientStatByChart(kind = 'month', gte = '', lte = '') {
      const params = {
        kind: kind,
      }
      if (gte !== '' && new Date(gte).toString() !== 'Invalid Date') {
        params.recorded_at__gte = gte + ' 00:00:00'
      }
      if (gte !== '' && new Date(lte).toString() !== 'Invalid Date') {
        params.recorded_at__lte = lte + ' 23:59:59'
      }
      return new Promise((resolve, reject) => {
        this.$api.patients
          .getStat(this.patient.user_id, params)
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            this.$message.error(JSON.stringify(err))
            resolve(null)
          })
      })
    },
    treatResultViewsChange(val) {
      this.treatResultViews = val
      switch (val) {
        case '运动处方': {
          this.$router.push(`${this.$route.path}?views=${1}`)
          // this.getReportData()
          break
        }
        case '营养处方': {
          this.$router.push(`${this.$route.path}?views=${2}`)
          // this.getReportData()
          break
        }
        case '健康评估': {
          this.$router.push(`${this.$route.path}?views=${3}`)
          // this.getReportData()
          break
        }
        case '健康档案': {
          this.$router.push(`${this.$route.path}?views=${0}`)
          this.initArchiveData()
          break
        }
        case '干预方案': {
          this.$router.push(`${this.$route.path}?views=${4}`)
          this.initSolutionData()
          break
        }
        case '报告中心': {
          this.$router.push(`${this.$route.path}?views=${5}`)
          this.getReportData()
          break
        }
      }
    },
    toLoseWeightPage() {
      this.$router.push({
        name: 'PatientLowsWeight',
        params: {
          ppid: this.ppid,
          userId: this.patient.user_id,
        },
      })
    },
    toFollowUpPage() {
      this.$router.push({
        name: 'PatientFollowUp',
        params: {
          ppid: this.ppid,
          projectId: this.project.id,
          userId: this.patient.user_id,
          stage: this.ppInfo.stage,
        },
      })
    },
    toOcrDetailPage(type, id) {
      this.$router.push({
        name: 'PatientOcrDetail',
        params: {
          type: type, // proof去审录、view查看
          ppid: this.ppid,
          userId: this.patient.user_id,
          recordId: id,
        },
      })
    },
    toSetRecipe() {
      this.$router.push({
        name: 'PatientSetRecipe',
        params: {
          type: 'create',
          ppid: this.ppid,
          projectId: this.project.id,
          userId: this.patient.user_id,
          stage: this.ppInfo.stage,
        },
      })
    },
    recommendExerciseClick() {
      this.$router.push({
        name: 'PatientRecommendExercise',
        params: {
          ppid: this.ppid,
          userId: this.patient.user_id,
        },
      })
    },
    previewImage(url) {
      //预览图片
      this.previewSrc = url
      this.$nextTick(() => {
        this.$refs.previewImage.showViewer = true
      })
    },
    sendMessageClick() {
      document.querySelector('.el-menu-item.IM').click()
      console.log(this.patient.im_user_id)
      this.$router.push({
        path: '/im',
        query: {
          active: 0,
          im: window.btoa(this.patient.im_user_id),
        },
      })
    },
    historyTableIsMyLiked(likes) {
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
    ...mapGetters(['userInfo', 'token']),
    userId() {
      return this.patient.user_id
    },
    patient() {
      if (Object.keys(this.ppInfo).length !== 0 && this.ppInfo.patient) {
        return this.ppInfo.patient
      } else {
        return {
          avatar_url: '',
          user_profile: {},
        }
      }
    },
    project() {
      if (Object.keys(this.ppInfo).length !== 0 && this.ppInfo.project) {
        return this.ppInfo.project
      } else {
        return {
          teams: {
            leader: {},
          },
        }
      }
    },
    showResultViews() {
      return this.treatResultViews === '体重结果' || this.treatResultViews === '饮食结果' || this.treatResultViews === '运动结果'
    },
    lastMemoTexe() {
      const memos = this.ppInfo.memos
      if (memos && memos.length > 0) {
        return memos[memos.length - 1].content
      } else {
        return '暂无'
      }
    },
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

<style lang="less" scoped>
.patient-info {
  width: 100%;

  .base {
    position: relative;
    display: flex;
    align-items: center;
    height: 62px;
    margin-bottom: 22px;

    .name {
      height: 28px;
      font-size: 20px;
      font-weight: 500;
      color: #344563;
      line-height: 28px;
      margin-left: 16px;
    }

    .sex {
      margin-left: 8px;
    }

    .tag {
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 13px;
      border: 1px solid #d9e1ec;
      font-size: 12px;
      font-weight: 600;
      color: #1e242c;
      margin-left: 4px;
    }

    .tag.age {
      min-width: 42px;
    }

    .tag.stage {
      min-width: 52px;
    }

    .tag.id {
      min-width: 76px;
    }

    .btn-group {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .font-mixin {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #5a607f;
    line-height: 20px;
  }

  .base2 {
    display: flex;
    margin-bottom: 22px;

    .item {
      .font-mixin();
      margin-right: 38px;
    }
  }

  .tags {
    .font-mixin();

    .tag {
      height: 27px;
      line-height: 27px;
      text-align: center;
      border-radius: 6px;
      border: 1px solid #d9e1ec;
      padding: 4px 8px;
    }

    margin-bottom: 32px;
  }

  .remake {
    .font-mixin();
    margin-bottom: 24px;
  }
}

.treat-info {
  position: relative;
  left: -18px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  border: 1px solid #d3d6e9;
  padding: 16px;

  .title-info {
    position: relative;

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

    .date {
      position: absolute;
      top: 7px;
      right: 0;
      height: 14px;
      font-size: 14px;
      font-weight: 400;
      color: #344563;
      line-height: 14px;
    }
  }

  .team-name {
    margin-bottom: 24px;

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

      .count {
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        font-weight: 400;
        color: #344563;
        margin: 10px 0;
        margin-left: 10px;
      }

      .sub {
        height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: #344563;
        line-height: 14px;
        margin: 0 2px;
      }
      .desc {
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

  margin-bottom: 36px;
}

.treat-result-btn-group {
  z-index: 1000;
  .radio-group {
    // width: 1040px;
    height: 46px;
    padding-left: 25px;
    border-radius: 23px;
    background-color: #f4f5fa;
    display: inline-flex;
    justify-content: space-around;
    align-items: center;

    .radio-group-item {
      padding-right: 25px;
    }

    .el-radio-button :deep(.el-radio-button__inner) {
      width: 91px;
      height: 34px;
      line-height: 34px;
      padding: 0;
      border-radius: 17px;
      border: none;
      user-select: none;
      color: #000;
      background-color: #f4f5fa;

      &:hover {
        color: #797979;
      }
    }

    .el-radio-button.is-active {
      border: none;

      :deep(.el-radio-button__inner) {
        height: 34px;
        line-height: 34px;
        padding: 0;
        background: #344563;
        border: none;
        user-select: none;
        color: #fff;
      }
    }

    .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
      box-shadow: unset;
    }
  }
}

.patient-archive {
  .el-link {
    float: right;
    color: #00b386;
    text-decoration: none;
  }

  .el-descriptions {
    :deep(th.el-descriptions-item__cell) {
      width: 140px;
    }
  }

  .el-input {
    :deep(.el-input__inner) {
      border: none;
      padding-left: 0;
      font-size: 14px;
      font-weight: 600;
      height: 24px;
      color: #5a6d86 !important;
    }

    &.edit-mode {
      :deep(.el-input__inner) {
        border: 1px solid #d9e1ec;
        padding: 5px;
      }
    }
  }
}

.patient-solution {
}

.treat-result-view {
  width: 100%;

  .chart-box {
    margin-top: 20px;
    width: calc(100% + 36px);
    min-width: 1102px;
    position: relative;
    left: -18px;
    display: flex;

    .box:first-child {
      margin-right: 8px;
    }

    .box {
      box-sizing: border-box;
      padding: 20px;
      width: calc(50% - 6px);
      height: 458px;
      background: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      border: 1px solid #d3d6e9;
    }

    .box.box-left {
      position: relative;

      .number-view {
        display: flex;
        justify-content: space-between;

        .number-item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 60px;
          min-width: 80px;

          .num {
            font-size: 24px;
            font-weight: bold;
            color: #344563;

            .unit {
              width: 36px;
              font-size: 16px;
              font-weight: bold;
              color: #a1a7c4;
            }
          }

          .desc {
            font-size: 14px;
            font-weight: 400;
            color: #344563;
          }
        }
      }

      .weight-waistline-unit-text {
        position: absolute;
        right: 20px;
        font-size: 12px;
        color: #a1a7c4;
      }
    }
  }

  .box.box-right {
    .el-date-editor {
      width: 247px;
    }

    .chart-wrapper {
      height: calc(100% - 20px - 20px - 20px);

      .echarts {
        width: 100%;
        height: 100%;
      }
    }
  }

  .today-weight-record-table {
    :deep(.el-table__body-wrapper) {
      overflow-x: auto;
    }
  }
}

.patient-report {
  margin-top: 20px;
}

.ocrlist-dialog {
  :deep(.el-dialog) {
    width: 680px;
    height: 500px;

    .el-dialog__body {
    }
  }
}

.el-avatar {
  background-color: #fff;
}

.dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
  position: relative;
  top: -2px;
}

.el-link {
  color: #00b386;
  text-decoration: none;
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

.scale-history-dialog {
  :deep(.el-dialog) {
    width: 800px;
    height: 550px;
  }
}

.today-record-dialog {
  :deep(.el-dialog) {
    width: 900px;
    height: 660px;
  }

  .food-table {
    .record-btn {
      float: right;
      position: relative;
      bottom: 10px;
    }
  }
}

.today-record-dialog.weight {
  :deep(.el-dialog) {
    width: 700px;
    height: 460px;
  }
}

.el-link.delete-link {
  color: #f36d6f;
  line-height: 20px;
  position: relative;
  top: -1px;

  &::after {
    border-color: #f36d6f;
  }
}

.year-right {
  position: relative;
  .year-right-picker {
    position: absolute;
    top: 0;
    right: 0;
    width: 67px;
    height: 32px;
    opacity: 0;

    .el-date-editor {
      width: 67px !important;
      height: 32px !important;
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
    width: 40%;
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
  width: 70%;

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
  width: 70%;
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
  width: 70%;
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
  width: 70%;
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

.evaluationreport-content {
  display: flex;
  flex-direction: row;
  .evaluationreport-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    margin-top: 30px;
    div {
      font-size: 14px;
      margin-top: 10px;
    }

    img {
      width: 80px;
      height: 80px;
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
