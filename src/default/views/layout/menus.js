const menus = [
  {
    path: '/project',
    name: 'Project',
    meta: { title: '项目管理', icon: 'menu_xmgl', codename: 'project.manage' },
  },
  {
    path: '/serviceTeam',
    name: 'ServiceTeam',
    meta: { title: '服务团队管理', icon: 'team', codename: 'serviceTeam.manage' },
  },
  {
    path: '#group',
    name: 'Group',
    meta: { title: '患者分组', icon: 'menu_hzfz', codename: 'grouping.manage' },
    children: [
      {
        path: '/project_distribution',
        name: 'ProjectDistribution',
        meta: { title: '项目分配', icon: 'menu_hzfz', codename: 'projectAssignment.list' },
      },
      {
        path: '/grouping',
        name: 'Grouping',
        meta: { title: '营养师分配', icon: 'menu_hzfz', codename: 'dietitianAssignment.list' },
      },
    ]
  },
  {
    path: '/patient',
    name: 'Patient',
    meta: { title: '我的患者', icon: 'menu_wdhz', codename: 'patient.manage' },
  },
  {
    path: '/todo_task',
    name: 'TodoTask',
    meta: { title: '待办任务', icon: 'menu_dbrw', codename: 'todoTask.manage' },
  },
  {
    path: '/im',
    name: 'IM',
    meta: { title: '消息', icon: 'menu_xiaoxi', codename: 'im.manage' },
  },
  {
    path: '#manage',
    name: 'Manage',
    meta: { title: '内容管理', icon: 'menu_zsk', codename: 'content.manage' },
    children: [
      {
        path: '/content_manage',
        name: 'ContentManage',
        meta: { title: '科普内容', icon: 'menu_zsk', codename: 'content.list' },
      },
      {
        path: '/common_problem',
        name: 'CommonProblem',
        meta: { title: '患者常见问题', icon: 'menu_zsk', codename: 'patientFaq.list' },
      },
    ]
  },
  {
    path: '#setting',
    name: 'Setting',
    meta: { title: '基础设置', icon: 'menu_jcsz', codename: 'nutrBase.manage' },
    children: [
      {
        path: '/solution',
        name: 'Solution',
        meta: { title: '干预方案', icon: 'menu_gyfa', codename: 'solution.list' },
      },
      {
        path: '#knowledge',
        name: 'Knowledge',
        meta: { title: '知识库', icon: 'menu_zsk', codename: 'nutrKnow.list' },
        children: [
          {
            path: '/food_calorie',
            name: 'Solution',
            meta: { title: '食物热量表', icon: 'menu_zsk', codename: 'nutrFoodCalorie.list' },
          },
          {
            path: '/exercise_calorie',
            name: 'Solution',
            meta: { title: '运动热量表', icon: 'menu_zsk', codename: 'nutrExerciseCalorie.list' },
          },
          {
            path: '/knowledge_card',
            name: 'Solution',
            meta: { title: '知识卡', icon: 'menu_zsk', codename: 'nutrKnowledgeCard.list' },
          },
          {
            path: '/tag_library',
            name: 'Solution',
            meta: { title: '标签库', icon: 'menu_zsk', codename: 'nutrTagLibrary.list' },
          },
          {
            path: '/recipe_library',
            name: 'Solution',
            meta: { title: '食谱库', icon: 'menu_zsk', codename: 'nutrRecipeLibrary.list' },
          },
        ]
      },
      {
        path: '/medical',
        name: 'Medical',
        meta: { title: '病历报告模板', icon: 'menu_blbgmb', codename: 'medical.list' },
      },
      {
        path: '/scale_manage',
        name: 'ScaleManage',
        meta: { title: '量表管理', icon: 'menu_lbgl', codename: 'nurtScaleManage.list' },
      },
    ]
  },
  {
    path: '#system',
    name: 'System',
    meta: { title: '系统配置', icon: 'menu_jcsz', codename: 'nurtSystem.list' },
    children: [
      {
        path: '/project_rule',
        name: 'ProjectRule',
        meta: { title: '患者项目关联规则', icon: 'menu_zsk', codename: 'projectRule.list' },
      },
    ]
  },
  {
    path: '/stat',
    name: 'Stat',
    meta: { title: '统计分析', icon: 'menu_tjfx', codename: 'nurtStat.list' },
  },
]

export default menus
