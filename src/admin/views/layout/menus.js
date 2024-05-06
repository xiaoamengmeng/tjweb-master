const menus = [
  {
    path: '#user',
    name: 'User',
    meta: { title: '用户管理', icon: 'menu_wdhz', codename: 'user.manage' },
    children: [
      {
        path: '/account',
        name: 'Account',
        meta: { title: '管理员管理', icon: 'menu_wdhz', codename: 'account.list' },
      },
      // {
      //   path: '/permission',
      //   name: 'Solution',
      //   meta: { title: '角色权限', icon: 'menu_wdhz', codename: 'permissions.view_rolepermission'},
      // },
      {
        path: '/patient_list',
        name: 'PatientList',
        meta: { title: '患者列表', icon: 'menu_wdhz', codename: 'patient.list' },
      },
      {
        path: '/permission_manage',
        name: 'PermissionManage',
        meta: { title: '权限管理', icon: 'menu_wdhz', codename: 'permission.list' },
      },
      {
        path: '/doctor',
        name: 'Doctor',
        meta: { title: '医生列表', icon: 'menu_wdhz', codename: 'doctor.list' },
      },
      {
        path: '/examine',
        name: 'Examine',
        meta: { title: '审核记录', icon: 'menu_wdhz', codename: 'examine.list' },
      },
    ]
  },
  {
    path: '#organization',
    name: 'Organization',
    meta: { title: '机构管理', icon: 'menu_zsk', codename: 'origanization.manage' },
    children: [
      {
        path: '/organization_manage',
        name: 'OrganizationManage',
        meta: { title: '机构管理', icon: 'menu_zsk', codename: 'origanization.list' },
      },
      {
        path: '/department_manage',
        name: 'DepartmentManage',
        meta: { title: '部门管理', icon: 'menu_zsk', codename: 'department.list' },
      },
    ]
  },
  {
    path: '#contentManage',
    name: 'ContentManage',
    meta: { title: '内容管理', icon: 'menu_zsk', codename: 'contentManage.manage' },
    children: [
      {
        path: '/coupe_cont_check',
        name: 'CoupeContCheck',
        meta: { title: '科普内容审核', icon: 'menu_zsk', codename: 'coupeContCheck.list' },
      },
    ]
  },
  {
    path: '#setting',
    name: 'Setting',
    meta: { title: '基础设置', icon: 'menu_zsk', codename: 'base.manage' },
    children: [
      {
        path: '/food_calorie',
        name: 'Solution',
        meta: { title: '食物热量表', icon: 'menu_zsk', codename: 'foodCalorie.list' },
      },
      {
        path: '/exercise_calorie',
        name: 'Solution',
        meta: { title: '运动热量表', icon: 'menu_zsk', codename: 'exerciseCalorie.list' },
      },
      {
        path: '/dish_library',
        name: 'DishLibrary',
        meta: { title: '菜品库', icon: 'menu_zsk', codename: 'dishLibrary.list' },
      },
      {
        path: '/nutritional_prescription',
        name: 'NutritionalPrescription',
        meta: { title: '营养处方', icon: 'menu_zsk', codename: 'nutritional.list' },
      },
      {
        path: '/exercise_prescription',
        name: 'ExercisePrescription',
        meta: { title: '运动处方', icon: 'menu_zsk', codename: 'exercise.list' },
      },
      {
        path: '/common_problem',
        name: 'CommonProblem',
        meta: { title: '常见问题', icon: 'menu_zsk', codename: 'commonProblem.list' },
      },
      {
        path: '/tips',
        name: 'Tips',
        meta: { title: '打卡Tips管理', icon: 'menu_zsk', codename: 'tips.list' },
      },
      {
        path: '/knowledge_card',
        name: 'Solution',
        meta: { title: '知识卡管理', icon: 'menu_zsk', codename: 'knowledgeCard.list' },
      },
      {
        path: '/tag_library',
        name: 'Solution',
        meta: { title: '标签管理', icon: 'menu_zsk', codename: 'tagLibrary.list' },
      },
      {
        path: '/scale_manage',
        name: 'ScaleManage',
        meta: { title: '量表管理', icon: 'menu_lbgl', codename: 'scaleManage.list' },
      },
      {
        path: '/solution_tpl',
        name: 'Solution',
        meta: { title: '干预方案模板', icon: 'menu_gyfa', codename: 'solutionTpl.list' },
      },
      {
        path: '/service_right',
        name: 'ServiceRight',
        meta: { title: '服务权益', icon: 'menu_gyfa', codename: 'serviceRight.list' },
      },
    ]
  },
  {
    path: '#system',
    name: 'System',
    meta: { title: '系统配置', icon: 'menu_zsk', codename: 'system.manage' },
    children: [
      {
        path: '/banner_manage',
        name: 'BannerManage',
        meta: { title: 'banner管理', icon: 'menu_zsk', codename: 'banner.list' },
      },
      // {
      //   path: '/exercise_calorie',
      //   name: 'Solution',
      //   meta: { title: '旅途任务每日任务清单', icon: 'menu_zsk', codename: 'exerciseCalorie.list' },
      // },
      {
        path: '/mailing_address',
        name: 'MailingAddress',
        meta: { title: '支架寄回地址', icon: 'menu_zsk', codename: 'address.list' },
      },
      {
        path: '/mission_curriculum_category',
        name: 'MissionCurriculumCategory',
        meta: { title: '宣教课程集合', icon: 'menu_zsk', codename: 'curriculumCa.list' },
      },
      {
        path: '/patient_faq_category',
        name: 'PatientFaqCategory',
        meta: { title: '患者常见问题分类', icon: 'menu_zsk', codename: 'patientFaqCa.list' },
      },
    ]
  },
  {
    path: '/stat',
    name: 'Stat',
    meta: { title: '统计分析', icon: 'menu_tjfx', codename: 'stat.list' },
  },

  {
    path: '/feedback',
    name: 'Feedback',
    meta: { title: '举报及意见反馈', icon: 'menu_zsk', codename: 'feedback.list' },
  },
  {
    path: '/log_info',
    name: 'LogInfo',
    meta: { title: '日志管理', icon: 'menu_zsk', codename: 'logInfo.list' },
  },

]
export default menus
