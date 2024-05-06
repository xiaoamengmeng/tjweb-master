<template>
	<div class="panel">
		<el-breadcrumb separator="-" class="breadcrumb-reset">
		  <el-breadcrumb-item>
		    <icon-box icon-name="menu_tjfx" w="20" h="20" box-w="20" box-h="90"></icon-box>
		    <b>统计分析</b>
		  </el-breadcrumb-item>

		</el-breadcrumb>
		<div class="card">
			<div class="flex">
				<div class="search-box">
					<el-form class="form-box" :model="form" :rules="rules" ref="form" label-position="top">
						<div class="search-bar">
							<el-row class="search-bar-row"
								style="width: 100%; height: 100%">
								<el-col class="mt_20" :span="24">
									<el-row class="label-t">统计时间</el-row>
									<el-row >
										<el-form-item prop="range">
											<el-date-picker
											  v-model="form.range"
											  type="daterange"
											  range-separator="至"
											  start-placeholder="开始日期"
											  end-placeholder="结束日期"
												value-format="yyyy-MM-dd">
											</el-date-picker>
										</el-form-item>
									</el-row>
								</el-col>
								<el-col class="mt_20" :span="24">
									<el-row class="label-t">统计项目</el-row>
									<el-row >
										<el-form-item prop="project">
											<el-select v-model="form.project" placeholder="全部" clearable>
												<template v-for="item in projectList">
													<el-option
														:key="item.id"
														:label="item.name"
														:value="item.id"
													 ></el-option>
												</template>
											</el-select>
										</el-form-item>
									</el-row>
								</el-col>
								<el-col class="mt_20" :span="24">
									<el-row class="label-t">统计对象</el-row>
									<el-row>
										<el-form-item prop="result">
											<el-radio-group v-model="form.result">
											  <el-radio label="patient">患者</el-radio>
											  <el-radio label="dietitian">营养师</el-radio>
											  <el-radio label="doctor">医生</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-row>
								</el-col>
								<div class="sub-btnbox">
									<m-button v-auth="'stat.commit'" icon="el-icon-search" @click="saveDataFunc" h="40px" w="100px">提交
									</m-button>
								</div>
							</el-row>
						</div>
					</el-form>
				</div>
				<div class="content">
					<el-form
					  :model="statsData"
					  label-position="top"
					>
					  <el-row>
					    <el-col :span="24">
					      <div class="grid-content bg-purple base2 mt_10">
					        <div class="item">统计周期：<span v-if="statsData">{{statsData.range[0]}} ~ {{statsData.range[1]}}</span></div>
					      </div>
					    </el-col>
					    <el-col :span="24">
					      <div class="grid-content bg-purple base2 mt_10">
					        <div class="item">统计对象：
                    <span v-if="statsData && statsData.result==='patient'">患者</span>
                    <span v-if="statsData && statsData.result==='dietitian'">营养师</span>
                  </div>
					      </div>
					    </el-col>
							<el-col :span="24">
							  <div class="grid-content bg-purple base2 mt_10">
							    <div class="item">统计项目：<span v-if="statsData">{{statsData.project}}</span></div>
							  </div>
							</el-col>

							<el-col :span="24" v-if="statsData && statsData.result !== ''">
								<div class="grid-content bg-purple base2 mt_20">
									<div class="item">
										<span class="line-sp"></span>
										<span class="title-sp">{{statsData.result==='patient'?'基本信息摘要':'基本信息'}}</span>
									</div>
									<div class="item">
										<template v-if="statsData && statsData.result==='patient'">
											<!-- 患者统计 -->
											<div class="mt_10">
												<table border="1" align="center" cellspacing="1" cellspadding= "1" class="my-table">
													<thead>
														<tr>
															<th style="width: 70px;">患者总数</th>
															<th>阶段</th>
															<th></th>
															<th></th>
															<th>性别</th>
															<th></th>
															<th></th>
															<th>年龄</th>
															<th></th>
															<th></th>
															<th></th>
															<th>BMI</th>
															<th></th>
															<th>腰围(男)</th>
															<th></th>
															<th>腰围(女)</th>
															<th></th>
														</tr>
													</thead>
													<tbody v-if="patientSummaryData">
														<tr>
															<td>{{patientSummaryData.total}}</td>
															<td v-for="item in patientSummaryData.stage" :key="item.stage">{{item.stage}}</td>
															<td v-for="item in patientSummaryData.sex" :key="item.sex">{{item.sex}}</td>
															<td v-for="item in patientSummaryData.age" :key="item.age">{{item.age}}</td>
															<td v-for="item in patientSummaryData.bmi" :key="item.bmi">{{item.bmi}}</td>
															<td v-for="item in patientSummaryData.waistline_male" :key="item.waistline">{{item.waistline}}</td>
															<td v-for="item in patientSummaryData.waistline_female" :key="item.waistline">{{item.waistline}}</td>
														</tr>
														<tr>
															<td></td>
															<td v-for="item in patientSummaryData.stage" :key="item.stage">{{item.count}}</td>
															<td v-for="item in patientSummaryData.sex" :key="item.sex">{{item.count}}</td>
															<td v-for="item in patientSummaryData.age" :key="item.age">{{item.count}}</td>
															<td v-for="item in patientSummaryData.bmi" :key="item.bmi">{{item.count}}</td>
															<td v-for="item in patientSummaryData.waistline_male" :key="item.waistline">{{item.count}}</td>
															<td v-for="item in patientSummaryData.waistline_female" :key="item.waistline">{{item.count}}</td>
														</tr>
													</tbody>
												</table>
											</div>


											<!-- 患者信息详情 -->
											<div class="mt_10">
												<span class="line-sp"></span>
												<span class="title-sp">基本信息详情</span>
												<div>
													<el-table
														:data="patientSummaryDetailData"
														border
														height="300px"
													>
														<el-table-column prop="name" label="患者"	align="center"></el-table-column>
														<el-table-column prop="sex" label="性别"	align="center">
															<template slot-scope="scope">
																<span v-if="scope.row.sex==='M'">男</span>
																<span v-else-if="scope.row.sex==='F'">女</span>
																<span v-else>未知</span>
															</template>
														</el-table-column>
														<el-table-column prop="age" label="年龄"	align="center"></el-table-column>
														<el-table-column prop="bmi" label="BMI"	align="center"></el-table-column>
														<el-table-column prop="height" label="身高"	align="center"></el-table-column>
														<el-table-column prop="initial_weight" label="初始体重"	align="center"></el-table-column>
														<el-table-column prop="latest_weight" label="最新体重"	align="center"></el-table-column>
														<el-table-column prop="change_weight" label="体重变化"	align="center"></el-table-column>
														<el-table-column prop="first_waistline" label="初始腰围"	align="center" show-overflow-tooltip></el-table-column>
														<el-table-column prop="latest_waistline" label="最新腰围"	align="center"></el-table-column>
														<el-table-column prop="change_waistline" label="腰围变化"	align="center"></el-table-column>
														<el-table-column prop="stages" label="阶段"	align="center">
															<template slot-scope="scope">
																<span v-if="scope.row.stages && scope.row.stages[0] !== null">{{scope.row.stages[0]}}</span>
															</template>
														</el-table-column>
													</el-table>
												</div>
											</div>


										</template>

										<template v-if="statsData && statsData.result==='dietitian'">
											<!-- 营养师 -->
											<el-table
												:data="[dietitianSummary]"
												border
											>
												<el-table-column prop="rd_count" label="责任营养师人数"	align="center"></el-table-column>
												<el-table-column prop="patient_count" label="患者人数"	align="center"></el-table-column>
												<el-table-column prop="rd_patient_ratio" label="责任营养师患者比"	align="center"></el-table-column>
											</el-table>

										</template>
									</div>
								</div>
							</el-col>
							<el-col :span="24" v-if="statsData && statsData.result !== ''">
								<div class="grid-content bg-purple base2 mt_20">
									<div class="item">
										<span class="line-sp"></span>
										<span class="title-sp">{{statsData.result==='patient'?'用户分析':'营养师明细'}} </span>
									</div>
									<div class="item">
										<template v-if="statsData && statsData.result==='patient'">
											<!-- 用户详情 -->
											<el-table
												:data="patientUsageData"
												border
											>
												<el-table-column prop="total" label="患者打卡总天数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.total.days}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="total" label="患者打卡总次数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.total.count}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="饮食打卡天数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.days}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="饮食打卡次数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.count}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="运动打卡天数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.days}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="运动打卡次数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.count}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="weight_stats" label="体重打卡天数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.weight_stats.days}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="weight_stats" label="体重打卡次数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.weight_stats.count}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="摄入热量总和"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.total_caloric_intake}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="人均摄入热量"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.average_caloric_intake}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="单次最高摄入热量"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.highest_caloric_intake}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="单次最低摄入热量"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.lowest_caloric_intake}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="消耗热量综合"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.total_caloric_burn}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="人均消耗热量"	align="center" show-overflow-tooltip>
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.average_caloric_burn}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="运动时长总和"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.total_exercise_duration}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="人均时长"	align="center" show-overflow-tooltip>
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.average_exercise_duration}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="单次最高消耗热量"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.highest_caloric_burn}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="单次最低消耗热量"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.lowest_caloric_burn}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="单次最高运动时长"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.highest_exercise_duration}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="单次最低运动时长"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.lowest_exercise_duration}}</span>
													</template>
												</el-table-column>
											</el-table>


											<!-- 用户明细 -->
											<div class="mt_10">
												<span class="line-sp"></span>
												<span class="title-sp">用户明细</span>
												<div>
													<el-table
														:data="patientUsageDetailData"
														border
														height="300px"
													>
														<el-table-column prop="name" label="患者"	align="center"></el-table-column>
														<el-table-column prop="total" label="患者打卡总天数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.total.days}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="total" label="患者打卡总次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.total.count}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="total" label="患者日均打卡次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.total.avg}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="diet_stats" label="饮食打卡天数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.diet_stats.days}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="diet_stats" label="饮食打卡次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.diet_stats.count}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="diet_stats" label="日均饮食打卡次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.diet_stats.avg}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="运动打卡天数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.days}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="运动打卡次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.count}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="日均运动打卡次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.avg}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="weight_stats" label="体重打卡天数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.weight_stats.days}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="weight_stats" label="体重打卡次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.weight_stats.count}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="weight_stats" label="日均体重打卡次数"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.weight_stats.avg}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="diet_stats" label="摄入热量总和"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.diet_stats.total_caloric_intake}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="diet_stats" label="每日人均摄入热量"	align="center" show-overflow-tooltip>
															<template slot-scope="scope">
																<span>{{scope.row.diet_stats.average_caloric_intake}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="diet_stats" label="单次最高摄入热量"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.diet_stats.highest_caloric_intake}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="diet_stats" label="单次最低摄入热量"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.diet_stats.lowest_caloric_intake}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="消耗热量总和"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.total_caloric_burn}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="每日人均消耗热量"	align="center" show-overflow-tooltip>
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.average_caloric_burn}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="运动时长总和"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.total_exercise_duration}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="每日人均时长"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.average_exercise_duration}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="单次最高消耗热量"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.highest_caloric_burn}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="单次最低消耗热量"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.lowest_caloric_burn}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="单次最高运动时长"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.highest_exercise_duration}}</span>
															</template>
														</el-table-column>
														<el-table-column prop="exercise_stats" label="单次最低运动时长"	align="center">
															<template slot-scope="scope">
																<span>{{scope.row.exercise_stats.lowest_exercise_duration}}</span>
															</template>
														</el-table-column>
													</el-table>
												</div>
											</div>

										</template>


										<!-- 营养师明细 -->
										<template v-if="statsData && statsData.result==='dietitian'">
											<el-table
												:data="dietitianDetailData"
												border
												height="400"
											>
												<el-table-column prop="name" label="责任营养师"	align="center"></el-table-column>
												<el-table-column prop="patient_count" label="患者人数"	align="center"></el-table-column>
												<el-table-column prop="comment_count" label="点评次数"	align="center"></el-table-column>
												<el-table-column prop="follow_up_count" label="随访次数"	align="center"></el-table-column>
												<el-table-column prop="weight_loss" label="服务对象累计减重"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.weight_loss.total}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="weight_loss" label="服务对象平均减重"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.weight_loss.avg}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="weight_stats" label="服务对象累计体重打卡天数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.weight_stats.days}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="weight_stats" label="服务对象累计体重打卡次数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.weight_stats.count}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="服务对象累计饮食打卡天数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.days}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="diet_stats" label="服务对象累计饮食打卡次数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.diet_stats.count}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="服务对象累计运动打卡天数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.days}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="服务对象累计运动打卡次数"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.count}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="服务对象累计运动时长"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.total_duration}}</span>
													</template>
												</el-table-column>
												<el-table-column prop="exercise_stats" label="服务对象平均运动时长"	align="center">
													<template slot-scope="scope">
														<span>{{scope.row.exercise_stats.avg_duration}}</span>
													</template>
												</el-table-column>
											</el-table>

										</template>

									</div>
								</div>
							</el-col>

						</el-row>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Stat',
		data() {
			return {
				form: {
					range: '',
					project: '',
					result: ''
				},
				rules: {
					range: [{required: true, message: '请选择具体起止时间', trigger: 'blur'}],
					project: [{required: true, message: '请选择具体统计项目', trigger: 'blur'}],
					result: [{required: true, message: '请选择统计对象', trigger: 'blur'}],
				},
				projectList: [],
				statsData: null,
				patientUsageData: null,
				patientUsageDetailData: [],
				patientSummaryData: null,
				patientSummaryDetailData: [],
				dietitianDetailData: [],
				dietitianSummary: null
			}
		},
		filters: {

		},
		mounted() {
			this.getProjectList()
		},
		methods: {
			getProjectList() {
			  this.$api.project.getList({
			    page: 1,
			    page_size: 9999,
			    ordering: 'id',
			  })
			    .then((res) => {
			      this.projectList = res.data.results
			    })
			    .catch((err) => {
			      this.$message.error(JSON.stringify(err))
			    })
			},
			saveDataFunc() {
				this.$refs['form'].validate((val)=>{
					if(val){
						if(this.form.result === 'patient') {
							this.getPatientSummary()
							this.getPatientSummaryDetail()
							this.getPatientUsage()
							this.getPatientUsageDetail()
						}else if(this.form.result === 'dietitian') {
							this.getDietitianDetail()
							this.getDietitianSummary()
						}else {

						}

						this.statsData = this.$clone(this.form)
						let	obj = this.projectList.find(item=>item.id===this.form.project)

						this.statsData.project = obj.name
					}else{
						return false
					}
				})
			},
			getPatientSummary() {
				this.$api.stats.getPatientSummary({
					date_from: this.form.range[0],
					date_to: this.form.range[1],
					project: this.form.project
				})
				.then((res) => {
					this.patientSummaryData = res.data
				})
				.catch((err) => {
					this.$message.error(JSON.stringify(err))
				})
			},
			getPatientSummaryDetail() {
				this.$api.stats.getPatientSummaryDetail({
					page: 1,
					page_size: 9999,
					ordering: '',
					project_id: this.form.project,
					recorded_at_from: this.form.range[0],
					recorded_at_to: this.form.range[1],
					search: '',
					stage: '',
				})
				.then((res) => {
					this.patientSummaryDetailData = res.data.results
				})
				.catch((err) => {
					this.$message.error(JSON.stringify(err))
				})
			},
			getPatientUsage() {
				this.$api.stats.getPatientUsage({
					date_from: this.form.range[0],
					date_to: this.form.range[1],
					project: this.form.project
				})
				.then((res) => {
					this.patientUsageData = [res.data]
					console.log('patientUsageData',this.patientUsageData)
				})
				.catch((err) => {
					this.$message.error(JSON.stringify(err))
				})
			},
			getPatientUsageDetail() {
				this.$api.stats.getPatientUsageDetail({
					date_from: this.form.range[0],
					date_to: this.form.range[1],
					project: this.form.project,
					ordering: '',
					page: 1,
					page_size: 9999,
					search: ''
				})
				.then((res) => {
					this.patientUsageDetailData = res.data.results
				})
				.catch((err) => {
					this.$message.error(JSON.stringify(err))
				})
			},
			getDietitianDetail() {
				this.$api.stats.getDietitianDetail({
					date_from: this.form.range[0],
					date_to: this.form.range[1],
					project: this.form.project,
					ordering: '',
					page: 1,
					page_size: 9999,
					search: ''
				})
				.then((res) => {
					this.dietitianDetailData = res.data.results
				})
				.catch((err) => {
					this.$message.error(JSON.stringify(err))
				})
			},
			getDietitianSummary() {
				this.$api.stats.getDietitianSummary({
					date_from: this.form.range[0],
					date_to: this.form.range[1],
					project: this.form.project
				})
				.then((res) => {
					this.dietitianSummary = res.data
				})
				.catch((err) => {
					this.$message.error(JSON.stringify(err))
				})
			},

		}
	}
</script>

<style scoped lang="less">
	.panel {
		overflow: auto hidden;
		height: calc(100vh - 50px);

		.card {
			min-width: calc(1440px - 250px - 64px - 64px);
			height: calc(100vh - 90px - 64px - 20px);
			background: #feffff !important;
			box-shadow: 0 10px 20px 0 rgb(0 0 0 / 4%);
			border-radius: 12px;
			margin: 32px;
			padding: 10px;
			overflow: hidden;
			margin-top: 0;
			.container {
				width: 100%;
				height: calc(100% - 64px);
				margin: 32px;
				overflow: hidden;
			}

			.flex {
				height: 100%;
			}
		}
	}

	.search-box {
		height: 100%;
		.form-box{
			width: 260px;
			height: 100%;
			.search-bar{
				height: 100%;
				padding: 0 10px;
				background: transparent;
				.sub-btnbox{
					position: absolute;
					bottom: 10px;
					left: 50%;
					margin-left: -50px;
				}
			}
		}
	}
	.content {
		flex: 1;
		margin-left: 20px;
		border-radius: 10px;
		border: 1px solid #E9EDF0;
		box-sizing: border-box;
		padding: 10px;
		overflow: auto;
	}
	.line-sp {
		display: inline-block;
		width: 6px;
		height: 29px;
		float: left;
		background: #0000ff;

		margin-top: 3px;
	}
	.title-sp {
		line-height: 35px;
		margin: 0 20px;
	}
	.my-table{
		width: 100%;
		border-collapse: collapse;/*用于合并表格边框*/
		font-size: 14px;
		text-align: center;
		margin-top: 10px;
		th,td{
			padding: 5px 8px;
		}
	}
	/deep/.el-table{
		margin-top: 10px;
		border: 1px solid grey !important;

		td.el-table__cell, th.el-table__cell.is-leaf {
			border-bottom: 1px solid grey;
			color: #000 !important;
			font-size: 14px;
		}
		.el-table__cell{
			border-right: 1px solid grey;
		}
	}

</style>
