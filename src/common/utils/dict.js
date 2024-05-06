const STATUS_PROJECT = [
  { code: 1, label: '进行中' },
  { code: 2, label: '已关闭' },
]

// 患者服务状态
const PATIENT_SERVICE_RIGHTS_STATUS = [
  { code: 1, label: '进行中' },
  { code: 2, label: '已结束' },
  { code: 3, label: '延续服务' },
]

const STATUS_AUTHORIZE = [
  { code: 0, label: '未启用' },
  { code: 1, label: '有效' },
  { code: 2, label: '待生效' },
  { code: 3, label: '已过期' },
  { code: 4, label: '已作废' },
]

const STATUS_USER = [
  { code: true, label: '启用' },
  { code: false, label: '禁用' },
]

const ROLE = [
  { code: 'rd', label: '责任营养师' },
  { code: 'ld', label: '主责营养师' },
  { code: 'dr', label: '医生' },
  { code: 'user', label: '用户' },
  { code: 'admin', label: '管理员' },
]

const PERSONNEL_TYPE = [
  { code: 'admin', label: '管理员' },
  { code: 'dr', label: '医生' },
  { code: 'da', label: '医生助理' },
  { code: 'ld', label: '主管营养师' },
  { code: 'rd', label: '责任营养师' },
]

const PROJECT_TYPE = [
  { code: 'listing', label: '上市' },
  { code: 'trails', label: '临床试验' },
]

const PRODUCT = [
  { code: 'qi_ta', label: '无' },
  { code: 'jian_zhong_shou_shu', label: '减重手术' },
  { code: 'wei_zhuan_liu', label: '胃转流支架' },
  // { code: 'shui_qiu', label: '水球' },
  // { code: 'wei_pang_lu', label: '胃旁路手术' },
]

const BANNER_TYPE = [
  { code: "Link", label: 'url链接' },
  { code: "Knowledge", label: '科普知识' },
  { code: "Mini", label: '小程序' },
]

const STATUS_SERVICE_RIGHTS = [
  { code: 1, label: '启用' },
  { code: 2, label: '禁用' },
]

const STATUS_TEAM = [
  { code: 1, label: '启用' },
  { code: 2, label: '禁用' },
]

const STATUS_SOLUTION = [
  { code: 1, label: '启用' },
  { code: 2, label: '禁用' },
]

// 项目患者的分配状态
const ASGMT_STATUS = [
  { code: 0, label: '待分配' },
  { code: 1, label: '已分配' },
  { code: -1, label: '已驳回' },
]

const QUESTION_TYPE = [
  { code: 0, label: '单选题' },
  { code: 1, label: '多选题' },
  { code: 2, label: '填空题' },
]

const STATUS_EXERCISE = [
  { code: 1, label: '启用' },
  { code: 0, label: '禁用' },
]

const MEDICAL_RECORD_TYPE = [
  { code: 'mzbl', label: '门诊病历' },
  { code: 'ryjl', label: '入院记录' },
  { code: 'cyxj', label: '出院小结' },
  { code: 'jcbg', label: '检查报告' },
  { code: 'jybg', label: '检验报告' },
]

// 餐段
const MEAL_TYPE = [
  { code: 'breakfast', label: '早餐' },
  { code: 'mid_moor', label: '早加餐' },
  { code: 'lunch', label: '午餐' },
  { code: 'mid_afternoon', label: '午加餐' },
  { code: 'dinner', label: '晚餐' },
  { code: 'late_night', label: '晚加餐' },
]

// 知识卡的布局，目前只实现4种
const CARD_LAYOUT = [
  { code: 'top-center', layout: 'top-center', label: '顶部居中' },
  { code: 'top-left', layout: 'top-left', label: '顶部左上' },
  { code: 'center', layout: 'center', label: '全局居中' },
  { code: 'top-right', layout: 'top-right', label: '顶部右上' },
]

const SEX = [
  { code: 'M', label: '男' },
  { code: 'F', label: '女' },
  { code: 'U', label: '未知' },
]

// 项目患者服务状态
const PATIENT_SERVICE_STATUS = [
  { code: 1, label: '进行中' },
  { code: 2, label: '已结束' },
  { code: 3, label: '延续服务' },
]

// 体重打卡的时间段
const WEIGHT_RECORD_TIME_PERIOD = [
  { code: 'empty_stomach', label: '空腹' },
  { code: 'before_breakfast', label: '早餐前' },
  { code: 'after_breakfast', label: '早餐后' },
  { code: 'before_lunch', label: '午餐前' },
  { code: 'after_lunch', label: '午餐后' },
  { code: 'before_dinner', label: '晚餐前' },
  { code: 'after_dinner', label: '晚餐后' },
  { code: 'before_sleep', label: '睡前' },
  // { code: 'unknown', label: '未知' },
]

// 机构管理启用状态
const ORGANIZATION_MANAGE_STATUS = [
  { code: true, label: '启用' },
  { code: false, label: '禁用' },
]

// 部门管理启用状态
const DEPARTMENT_MANAGE_STATUS = [
  { code: true, label: '启用' },
  { code: false, label: '禁用' },
]

// 营养处方性别
const NUTRITIONAL_SEX_STATUS = [
  { code: 'N/A', label: '男+女' },
  { code: '男', label: '男' },
  { code: '女', label: '女' },
]

// 营养处方年龄
const NUTRITIONAL_AGE_STATUS = [
  // { code: 'wcn', label: '未成年' },
  { code: 'cn', label: '成年' },
  { code: 'ln', label: '老年' },
]

// 营养处方BMI
const NUTRITIONAL_BMI_STATUS = [
  { code: '1', label: 'BMI<18.5' },
  { code: '2', label: '18.5≤BMI<24' },
  { code: '3', label: 'BMI≥24' },
]

// 营养处方血压
const NUTRITIONAL_BLOOD_PRESSURE_STATUS = [
  { code: '1', label: '正常' },
  { code: '2', label: '高血压' },
]

// 营养处方血糖
const NUTRITIONAL_BLOOD_GLUCOSE_STATUS = [
  { code: '1', label: '正常' },
  { code: '2', label: '糖尿病' },
]

// 营养处方血脂
const NUTRITIONAL_BLOOD_FAT_STATUS = [
  { code: '1', label: '正常' },
  { code: '2', label: '高血脂' },
]

// 营养处方PAL
const NUTRITIONAL_BLOOD_PAL_STATUS = [
  { code: '1', label: 'PAL0' },
  { code: '2', label: 'PAL1' },
  { code: '3', label: 'PAL2' },
  { code: '4', label: 'PAL3' },
]

// 营养处方餐类型 breakfast lunch  extraMeal  dinner
const NUTRITIONAL_BLOOD_MEAL_TYPE = [
  { code: 1, label: '早餐', name: 'breakfast' },
  { code: 2, label: '午餐', name: 'lunch' },
  { code: 3, label: '加餐', name: 'extraMeal' },
  { code: 4, label: '晚餐', name: 'dinner' },
]

// 运动处方人群：健康人群、超重人群、肥胖人群、高血压、糖尿病前期、1型糖尿病、2型糖尿病、甘油三酯异常、总胆固醇异常、密度脂蛋白异常、骨质疏松、恶性肿瘤、心血管疾病
const EXERCISE_PEOPLE_TYPE = [
  { code: 1, label: '健康人群' },
  { code: 2, label: '超重人群' },
  { code: 3, label: '肥胖人群' },
  { code: 4, label: '高血压' },
  { code: 5, label: '糖尿病前期' },
  { code: 6, label: '1型糖尿病' },
  { code: 7, label: '2型糖尿病' },
  { code: 8, label: '甘油三酯异常' },
  { code: 9, label: '总胆固醇异常' },
  { code: 10, label: '密度脂蛋白异常' },
  { code: 11, label: '骨质疏松' },
  { code: 12, label: '恶性肿瘤' },
  { code: 13, label: '心血管疾病' },
  { code: 14, label: '其他' },
]

// 动作库类型
const EXERCISE_ACTIONS_TYPE = [
  { code: 1, label: '热身' },
  { code: 2, label: '上肢力量训练' },
  { code: 3, label: '下肢力量训练' },
  { code: 4, label: '核心肌训练' },
  // { code: 5, label: '伸展训练' },
  { code: 6, label: '平衡训练' },
]

// 常见问题分类
const COMMON_PROBLEM_TYPE = [
  { code: 1, label: '饮食' },
  { code: 2, label: '运动' },
  { code: 3, label: '支架' },
  { code: 4, label: '生活方式' },
  { code: 5, label: '体重数据' },
  { code: 6, label: '疾病' },
]

// 打卡Tips分类
const TIPS_TYPE = [
  {
    code: 1, label: '饮食', map: {
      '未达到推荐热量': {
        usage: '未达到推荐热量',
        common: ['未完成饮食记录！', '今天还能摄入热量：XXX kcal']
      },
      '超过推荐热量': {
        usage: '超过推荐热量',
        common: ['完成饮食记录！', '今日热量摄入超过推荐值，超了XXX kcal!'],
      }
    }
  },
  {
    code: 2, label: '运动', map: {
      '完成': {
        usage: '',
        common: ['完成运动记录！', '本次运动消耗了 XXX kcal'],
      }
    }
  },
  {
    code: 3, label: '体重', map: {
      '完成': {
        usage: '',
        common: ['完成体重记录！'],
      }
    }
  },
  {
    code: 4, label: '心情', map: {
      '完成': {
        usage: '',
        common: ['完成心情记录！'],
      }
    }
  },
]

// 随访不良反应
const FOLLOW_UP_ADVERSE_TYPE = [
  { code: 1, label: '恶心' },
  { code: 2, label: '呕吐' },
  { code: 3, label: '打嗝' },
  { code: 4, label: '腹痛' },
  { code: 5, label: '腹泻' },
  { code: 6, label: '胃痛' },
  { code: 7, label: '胃胀' },
  { code: 8, label: '排气增多' },
  { code: 9, label: '乏力' },
  // { code: 10, label: '其他' },
]


// 权限管理 数据权限type
const PERMISSION_DATA_TYPE = [
  { code: 'all', label: '全部机构' },
  { code: 'org', label: '账号所属机构下的所有部门' },
  { code: 'dpt', label: '账号所属机构+部门' },
  { code: 'pjt', label: '账号参与的项目' },
]


// 内容管理 科普知识审核type
const CONTENTCHECK_DATA_TYPE = [
  { code: 'approved', label: '审核通过' },
  { code: 'pending', label: '待审核' },
  { code: 'rejected', label: '审核未通过' },
]

// pcPermissionInfo

// PC功能权限
const PC_PERMISSION_INFO = [{
  name: '用户管理',
  codename: 'user.manage',
  items: [{
    name: '管理员管理',
    codename: 'account.list',
    items: [{
      name: '新建',
      codename: 'account.create'
    }, {
      name: '修改信息',
      codename: 'account.update'
    }, {
      name: '修改密码',
      codename: 'account.updatePassword'
    }, {
      name: '删除账号',
      codename: 'account.delete'
    }, {
      name: '接入咨询',
      codename: 'account.consult'
    }]
  }, {
    name: '患者列表',
    codename: 'patient.list',
    items: [{
      name: '删除账号',
      codename: 'patient.delete'
    }]
  }, {
    name: '权限管理',
    codename: 'permission.list',
    items: [{
      name: '添加',
      codename: 'permission.create',
    }, {
      name: '权限设置',
      codename: 'permission.setPermission',
    }, {
      name: '成员管理',
      codename: 'permission.member',
    }, {
      name: '修改',
      codename: 'permission.update',
    }, {
      name: '删除',
      codename: 'permission.delete',
    }]
  }, {
    name: '医生列表',
    codename: 'doctor.list',
    items: [{
      name: '详情',
      codename: 'doctor.info',
    }, {
      name: '二维码',
      codename: 'doctor.qrcode',
    }]
  }, {
    name: '审核记录',
    codename: 'examine.list',
    items: [{
      name: '审核',
      codename: 'examine.audit',
    }, {
      name: '修改',
      codename: 'examine.update',
    }, {
      name: '查看',
      codename: 'examine.info',
    }, {
      name: '取消',
      codename: 'examine.delete',
    }]
  },]
}, {
  name: '内容管理',
  codename: 'contentManage.manage',
  items: [{
    name: '科普内容审核',
    codename: 'coupeContCheck.list',
    items: [
      {
        name: '审核内容',
        codename: 'coupeContCheck.check',
      }
    ]
  },

  ]
}, {
  name: '机构管理',
  codename: 'origanization.manage',
  items: [{
    name: '机构管理',
    codename: 'origanization.list',
    items: [{
      name: '添加',
      codename: 'origanization.create',
    }, {
      name: '修改',
      codename: 'origanization.update',
    }, {
      name: '删除',
      codename: 'origanization.delete',
    }]
  }, {
    name: '部门管理',
    codename: 'department.list',
    items: [{
      name: '添加',
      codename: 'department.create',
    }, {
      name: '修改',
      codename: 'department.update',
    }, {
      name: '删除',
      codename: 'department.delete',
    }]
  }]
}, {
  name: '基础设置',
  codename: 'base.manage',
  items: [{
    name: '食物热量表',
    codename: 'foodCalorie.list',
    items: [{
      name: '查看食物详情',
      codename: 'foodCalorie.foodDetail',
    }, {
      name: '添加食物',
      codename: 'foodCalorie.createFood',
    }, {
      name: '修改食物',
      codename: 'foodCalorie.updateFood',
    }, {
      name: '删除食物',
      codename: 'foodCalorie.deleteFood',
    }, {
      name: '添加分类',
      codename: 'foodCalorie.createCategory',
    }, {
      name: '删除分类',
      codename: 'foodCalorie.deleteCategory',
    }]
  }, {
    name: '运动热量表',
    codename: 'exerciseCalorie.list',
    items: [{
      name: '添加',
      codename: 'exerciseCalorie.create',
    }, {
      name: '修改',
      codename: 'exerciseCalorie.update',
    }, {
      name: '删除',
      codename: 'exerciseCalorie.delete',
    }]
  }, {
    name: '菜品库',
    codename: 'dishLibrary.list',
    items: [{
      name: '添加',
      codename: 'dishLibrary.create',
    }, {
      name: '修改',
      codename: 'dishLibrary.update',
    }, {
      name: '删除',
      codename: 'dishLibrary.delete',
    }]
  }, {
    name: '营养处方',
    codename: 'nutritional.list',
    items: [{
      name: '查看详情',
      codename: 'nutritional.info',
    }]
  }, {
    name: '运动处方',
    codename: 'exercise.list',
  }, {
    name: '常见问题',
    codename: 'commonProblem.list',
    items: [{
      name: '添加',
      codename: 'commonProblem.create',
    }, {
      name: '修改',
      codename: 'commonProblem.update',
    }, {
      name: '删除',
      codename: 'commonProblem.delete',
    }, {
      name: '添加分类',
      codename: 'commonProblem.createCategory',
    }, {
      name: '删除分类',
      codename: 'commonProblem.deleteCategory',
    }]
  }, {
    name: '打卡Tips管理',
    codename: 'tips.list',
  },
  // {
  //   name: '提示内容',
  //   codename: 'prompt.list',
  //   items: [{
  //     name: '修改',
  //     codename: 'prompt.update',
  //   }]
  // }, 
  {
    name: '知识卡管理',
    codename: 'knowledgeCard.list',
    items: [{
      name: '修改',
      codename: 'knowledgeCard.update',
    }, {
      name: '删除',
      codename: 'knowledgeCard.delete',
    }, {
      name: '知识卡模板库',
      codename: 'knowledgeCard.templateLibrary',
    }, {
      name: '按模板创作',
      codename: 'knowledgeCard.templateCreate',
    }, {
      name: '上传图片',
      codename: 'knowledgeCard.uploadImg',
    }]
  }, {
    name: '标签管理',
    codename: 'tagLibrary.list',
    items: [{
      name: '添加',
      codename: 'tagLibrary.create',
    }, {
      name: '修改',
      codename: 'tagLibrary.update',
    }, {
      name: '删除',
      codename: 'tagLibrary.delete',
    }, {
      name: '添加分类',
      codename: 'tagLibrary.createCategory',
    }, {
      name: '删除分类',
      codename: 'tagLibrary.deleteCategory',
    }]
  }, {
    name: '量表管理',
    codename: 'scaleManage.list',
    items: [{
      name: '添加量表',
      codename: 'scaleManage.create',
    }, {
      name: '预览量表',
      codename: 'scaleManage.info',
    }, {
      name: '编辑量表',
      codename: 'scaleManage.update',
    },
    // {
    //   name: '问卷设置',
    //   codename: 'scaleManage.questionnaire',
    // }, 
    {
      name: '答题记录',
      codename: 'scaleManage.answer',
    }, {
      name: '答题统计',
      codename: 'scaleManage.answerStatistics',
    }, {
      name: '复制',
      codename: 'scaleManage.copy',
    }, {
      name: '删除',
      codename: 'scaleManage.delete',
    }]
  }, {
    name: '干预方案模板',
    codename: 'solutionTpl.list',
    items: [{
      name: '添加营养模板',
      codename: 'solutionTpl.createNutritional',
    }, {
      name: '修改营养模板',
      codename: 'solutionTpl.updateNutritional',
    }, {
      name: '删除营养模板',
      codename: 'solutionTpl.deleteNutritional',
    }, {
      name: '添加运动模板',
      codename: 'solutionTpl.createExercise',
    }, {
      name: '修改运动模板',
      codename: 'solutionTpl.updateExercise',
    }, {
      name: '删除运动模板',
      codename: 'solutionTpl.deleteExercise',
    }, {
      name: '新建干预方案模板',
      codename: 'solutionTpl.create',
    }, {
      name: '修改干预方案模板',
      codename: 'solutionTpl.update',
    }, {
      name: '删除干预方案模板',
      codename: 'solutionTpl.delete',
    }]
  }, {
    name: '服务权益',
    codename: 'serviceRight.list',
    items: [{
      name: '添加',
      codename: 'serviceRight.create',
    }, {
      name: '修改',
      codename: 'serviceRight.update',
    }, {
      name: '删除',
      codename: 'serviceRight.delete',
    }]
  }]
}, {
  name: '系统配置',
  codename: 'system.manage',
  items: [{
    name: 'banner管理',
    codename: 'banner.list',
    items: [{
      name: '添加',
      codename: 'banner.create',
    }, {
      name: '修改',
      codename: 'banner.update',
    }, {
      name: '删除',
      codename: 'banner.delete',
    }]
  }, {
    name: '支架寄回地址',
    codename: 'address.list',
    items: [{
      name: '修改',
      codename: 'address.update',
    }]
  }, {
    name: '宣教课程集合',
    codename: 'curriculumCa.list',
    items: [{
      name: '添加',
      codename: 'curriculumCa.create',
    }, {
      name: '修改',
      codename: 'curriculumCa.update',
    }, {
      name: '删除',
      codename: 'curriculumCa.delete',
    }]
  }, {
    name: '患者常见问题分类',
    codename: 'patientFaqCa.list',
    items: [{
      name: '添加',
      codename: 'patientFaqCa.create',
    }, {
      name: '修改',
      codename: 'patientFaqCa.update',
    }, {
      name: '删除',
      codename: 'patientFaqCa.delete',
    }]
  }]
}, {
  name: '统计分析',
  codename: 'stat.list',
  count: 1,
  items: [{
    name: '提交统计',
    codename: 'stat.commit',
  }]
}, {
  name: '举报及意见反馈',
  codename: 'feedback.list',
  count: 1,
},
{
  name: '日志管理',
  codename: 'logInfo.list',
  count: 1,
}]

// 营养师功能权限
const NUTR_PERMISSION_INFO = [{
  name: '项目管理',
  count: 1,
  codename: 'project.manage',
  items: [{
    name: '新建项目',
    codename: 'project.create'
  }, {
    name: '编辑项目',
    codename: 'project.update'
  }, {
    name: '删除项目',
    codename: 'project.delete'
  }, {
    name: '查看项目详情',
    codename: 'project.info'
  }]
}, {
  name: '服务团队管理',
  count: 1,
  codename: 'serviceTeam.manage',
  items: [{
    name: '创建团队',
    codename: 'serviceTeam.create'
  }, {
    name: '编辑团队',
    codename: 'serviceTeam.edit'
  }, {
    name: '删除团队',
    codename: 'serviceTeam.delete'
  }]
},
// {
//   name: '患者分组',
//   count: 1,
//   codename: 'grouping.manage',
//   items: [{
//     name: '单个分配',
//     codename: 'grouping.one'
//   }, {
//     name: '批量分配',
//     codename: 'grouping.all'
//   }]
// }, 
{
  name: '患者分组',
  codename: 'grouping.manage',
  items: [{
    name: '项目分配',
    codename: 'projectAssignment.list',
    count: 1,
    items: [{
      name: '单个分配',
      codename: 'projectAssignment.one',
    }, {
      name: '批量分配',
      codename: 'projectAssignment.all',
    }]
  }, {
    name: '营养师分配',
    codename: 'dietitianAssignment.list',
    count: 1,
    items: [{
      name: '单个分配',
      codename: 'dietitianAssignment.one',
    }, {
      name: '批量分配',
      codename: 'dietitianAssignment.all',
    }]
  }]
}, {
  name: '我的患者',
  count: 1,
  codename: 'patient.manage',
  items: [{
    name: '导出健康数据',
    codename: 'patient.export'
  }, {
    name: '标签查看及管理',
    codename: 'patient.tag'
  }, {
    name: '服务备注查看及管理',
    codename: 'patient.serviceRemarks'
  }, {
    name: '健康评估查看及管理',
    codename: 'patient.healthAssessmentInfo'
  }, {
    name: '运动开始日期查看及管理',
    codename: 'patient.startDate'
  }, {
    name: '随访查看及管理',
    codename: 'patient.followUp'
  }, {
    name: '方案查看及管理',
    codename: 'patient.scheme'
  }, {
    name: '配餐查看及管理',
    codename: 'patient.catering'
  }, {
    name: '取消分配',
    codename: 'patient.unallotment'
  }, {
    name: '延续服务',
    codename: 'patient.continuationService'
  }, {
    name: '结束服务',
    codename: 'patient.endService'
  }, {
    name: '运动处方',
    codename: 'patient.exercisePrescription'
  }, {
    name: '营养处方',
    codename: 'patient.nutritionalPrescription'
  }, {
    name: '健康评估',
    codename: 'patient.healthAssessment'
  }, {
    name: '健康档案',
    codename: 'patient.healthRecord'
  }, {
    name: '干预方案',
    codename: 'patient.interventionProgram'
  },
  // {
  //   name: '体重结果',
  //   codename: 'patient.weight'
  // }, {
  //   name: '饮食结果',
  //   codename: 'patient.diet'
  // }, {
  //   name: '运动结果',
  //   codename: 'patient.sprot'
  // }, 
  {
    name: '报告中心',
    codename: 'patient.reportingCenter'
  }, {
    name: '减重报告',
    codename: 'patient.weightLossReport'
  }, {
    name: '随访记录',
    codename: 'patient.followUpRecord'
  }, {
    name: '发消息',
    codename: 'patient.sendMessage'
  }]
}, {
  name: '待办任务',
  count: 1,
  codename: 'todoTask.manage',
  items: [{
    name: '处理',
    codename: 'todoTask.update'
  }]
}, {
  name: '消息',
  count: 1,
  codename: 'im.manage',
},
{
  name: '内容管理',
  codename: 'content.manage',
  items: [
    {
      name: '科普内容',
      codename: 'content.list',
      count: 1,
      items: [{
        name: '上传文章',
        codename: 'content.uploadContent',
      }, {
        name: '发布视频',
        codename: 'content.createVideo',
      }, {
        name: '修改内容',
        codename: 'content.update',
      }, {
        name: '删除内容',
        codename: 'content.delete',
      },
      {
        name: '审核内容',
        codename: 'content.check',
      }, {
        name: '查看视频库',
        codename: 'content.videoInfo',
      }, {
        name: '上传视频',
        codename: 'content.uploadVideo',
      }, {
        name: '删除视频',
        codename: 'content.deleteVideo',
      }]
    }, {
      name: '患者常见问题',
      codename: 'patientFaq.list',
      count: 1,
      items: [{
        name: '添加',
        codename: 'patientFaq.create',
      }, {
        name: '修改',
        codename: 'patientFaq.update',
      }, {
        name: '删除',
        codename: 'patientFaq.delete',
      }]
    },
  ]
},
{
  name: '基础设置',
  codename: 'nutrBase.manage',
  items: [{
    name: '干预方案',
    count: 1,
    codename: 'solution.list',
    items: [{
      name: '添加',
      codename: 'solution.create'
    }, {
      name: '修改',
      codename: 'solution.update'
    }, {
      name: '删除',
      codename: 'solution.delete'
    }]
  }, {
    name: '知识库',
    codename: 'nutrKnow.list',
    items: [{
      name: '食物热量表',
      codename: 'nutrFoodCalorie.list',
      items: [{
        name: '查看食物详情',
        codename: 'nutrFoodCalorie.info',
      }, {
        name: '添加食物',
        codename: 'nutrFoodCalorie.create',
      }, {
        name: '修改食物',
        codename: 'nutrFoodCalorie.update',
      }, {
        name: '删除食物',
        codename: 'nutrFoodCalorie.delete',
      }]
    }, {
      name: '运动热量表',
      codename: 'nutrExerciseCalorie.list',
      items: [{
        name: '添加',
        codename: 'nutrExerciseCalorie.create',
      }, {
        name: '修改',
        codename: 'nutrExerciseCalorie.update',
      }, {
        name: '删除',
        codename: 'nutrExerciseCalorie.delete',
      }]
    }, {
      name: '知识卡',
      codename: 'nutrKnowledgeCard.list',
      items: [{
        name: '修改',
        codename: 'nutrKnowledgeCard.update',
      }, {
        name: '删除',
        codename: 'nutrKnowledgeCard.delete',
      }, {
        name: '知识卡模板库',
        codename: 'nutrKnowledgeCard.templateLibrary',
      }, {
        name: '按模板创作',
        codename: 'nutrKnowledgeCard.templateCreate',
      }, {
        name: '上传图片',
        codename: 'nutrKnowledgeCard.uploadImg',
      }]
    }, {
      name: '标签库',
      codename: 'nutrTagLibrary.list',
      items: [{
        name: '添加',
        codename: 'nutrTagLibrary.create',
      }, {
        name: '修改',
        codename: 'nutrTagLibrary.update',
      }, {
        name: '删除',
        codename: 'nutrTagLibrary.delete',
      }]
    }, {
      name: '食材库',
      codename: 'nutrRecipeLibrary.list',
      items: [{
        name: '添加',
        codename: 'nutrRecipeLibrary.create',
      }, {
        name: '详情',
        codename: 'nutrRecipeLibrary.info',
      }, {
        name: '修改',
        codename: 'nutrRecipeLibrary.update',
      }, {
        name: '删除',
        codename: 'nutrRecipeLibrary.delete',
      }]
    }]
  }, {
    name: '病例报告模板',
    count: 1,
    codename: 'medical.list',
    items: [{
      name: '修改',
      codename: 'medical.update'
    }, {
      name: '导入',
      codename: 'medical.import'
    }, {
      name: '导出',
      codename: 'medical.export'
    }]
  }, {
    name: '量表管理',
    count: 1,
    codename: 'nurtScaleManage.list',
    items: [{
      name: '添加量表',
      codename: 'nurtScaleManage.create'
    }, {
      name: '预览量表',
      codename: 'nurtScaleManage.info'
    }, {
      name: '编辑量表',
      codename: 'nurtScaleManage.update'
    },
    // {
    //   name: '问卷设置',
    //   codename: 'nurtScaleManage.questionnaire'
    // }, 
    {
      name: '答题记录',
      codename: 'nurtScaleManage.answer'
    }, {
      name: '答题统计',
      codename: 'nurtScaleManage.answerStatistics'
    }, {
      name: '复制',
      codename: 'nurtScaleManage.copy'
    }, {
      name: '删除',
      codename: 'nurtScaleManage.delete'
    }]
  }]
}, {
  name: '系统配置',
  codename: 'nurtSystem.list',
  items: [
    {
      name: '患者项目关联规则',
      codename: 'projectRule.list',
      count: 1,
      items: [{
        name: '添加',
        codename: 'projectRule.create',
      }, {
        name: '修改',
        codename: 'projectRule.update',
      }, {
        name: '删除',
        codename: 'projectRule.delete',
      }]
    }
  ]
}, {
  name: '统计分析',
  codename: 'nurtStat.list',
  count: 1,
  items: [{
    name: '体重统计',
    codename: 'nurtStat.weight',
  }, {
    name: '答题统计',
    codename: 'nurtStat.answer',
  }, {
    name: '依从性统计',
    codename: 'nurtStat.compliance',
  }]
}]

const DOCTOR_AUTHENTICATION = [
  {
    code: 'DP',
    label: '主任医师',
  }, {
    code: 'ADP',
    label: '副主任医师',
  }, {
    code: 'CP',
    label: '主治医师',
  }, {
    code: 'AP',
    label: '住院医师',
  }, {
    code: 'DN',
    label: '护师',
  }, {
    code: 'ADN',
    label: '主管护师',
  }, {
    code: 'CN',
    label: '主任护师',
  }, {
    code: 'ACN',
    label: '副主任护师',
  },
]


export {
  STATUS_PROJECT,
  STATUS_AUTHORIZE,
  STATUS_USER,
  ROLE,
  PROJECT_TYPE,
  PRODUCT,
  STATUS_SERVICE_RIGHTS,
  STATUS_TEAM,
  ASGMT_STATUS,
  QUESTION_TYPE,
  STATUS_EXERCISE,
  STATUS_SOLUTION,
  MEDICAL_RECORD_TYPE,
  MEAL_TYPE,
  CARD_LAYOUT,
  SEX,
  PATIENT_SERVICE_STATUS,
  WEIGHT_RECORD_TIME_PERIOD,
  PATIENT_SERVICE_RIGHTS_STATUS,
  ORGANIZATION_MANAGE_STATUS,
  DEPARTMENT_MANAGE_STATUS,
  NUTRITIONAL_SEX_STATUS,
  NUTRITIONAL_AGE_STATUS,
  NUTRITIONAL_BMI_STATUS,
  NUTRITIONAL_BLOOD_PRESSURE_STATUS,
  NUTRITIONAL_BLOOD_GLUCOSE_STATUS,
  NUTRITIONAL_BLOOD_FAT_STATUS,
  NUTRITIONAL_BLOOD_PAL_STATUS,
  PERSONNEL_TYPE,
  NUTRITIONAL_BLOOD_MEAL_TYPE,
  EXERCISE_ACTIONS_TYPE,
  EXERCISE_PEOPLE_TYPE,
  COMMON_PROBLEM_TYPE,
  PERMISSION_DATA_TYPE,
  PC_PERMISSION_INFO,
  NUTR_PERMISSION_INFO,
  FOLLOW_UP_ADVERSE_TYPE,
  TIPS_TYPE,
  DOCTOR_AUTHENTICATION,
  BANNER_TYPE,
  CONTENTCHECK_DATA_TYPE
}
