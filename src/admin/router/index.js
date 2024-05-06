import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/layout'
import store from '@/common/store'
import { PC_PERMISSION_INFO } from '@/common/utils/dict'
import menus from '../views/layout/menus'
import { getRoutes, getMeu } from '@/common/utils/routeUtils'

Vue.use(VueRouter)

// const vm = new Vue()

const routes = [
  {
    path: '/404',
    name: '404',
    meta: { title: '404 Not Found' },
    component: () => import(/* webpackChunkName: "404" */ '@/common/components/404')
  },
  {
    path: '/',
    name: 'Root',
    redirect: '/login',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        redirect: '/account'
      },
      {
        path: '/account',
        name: 'Account',
        meta: { title: '管理员管理' },
        component: () => import(/* webpackChunkName: "Account" */ '../views/account')
      },
      // {
      //   path: '/permission',
      //   name: 'Permission',
      //   meta: { title: '角色权限' },
      //   component: () => import(/* webpackChunkName: "Permission" */ '../views/permission')
      // },
      {
        path: '/access_consultation',
        name: 'AccessConsultation',
        meta: { title: '接入咨询' },
        component: () => import(/* webpackChunkName: "AccessConsultation" */ '../views/access_consultation')
      },
      {
        path: '/patient_list',
        name: 'PatientList',
        meta: { title: '患者列表' },
        component: () => import(/* webpackChunkName: "PatientList" */ '../views/patient_list')
      },
      {
        path: '/permission_manage',
        name: 'PermissionManage',
        meta: { title: '权限管理' },
        component: () => import(/* webpackChunkName: "PermissionManage" */ '../views/permission_manage')
      },
      {
        path: '/permission_manage/set_permission',
        name: 'SetPermission',
        meta: { title: '权限管理' },
        component: () => import(/* webpackChunkName: "SetSepartment" */ '../views/permission_manage/set_permission')
      },
      {
        path: '/permission_manage/member_manage',
        name: 'MemberManage',
        meta: { title: '成员管理' },
        component: () => import(/* webpackChunkName: "MemberManage" */ '../views/permission_manage/member_manage')
      },
      {
        path: '/permission_manage/add_member',
        name: 'AddMember',
        meta: { title: '添加成员' },
        component: () => import(/* webpackChunkName: "AddMember" */ '../views/permission_manage/add_member')
      },
      {
        path: '/doctor',
        name: 'Doctor',
        meta: { title: '医生列表' },
        component: () => import(/* webpackChunkName: "Doctor" */ '../views/doctor')
      },
      {
        path: '/doctor/details',
        name: 'DoctorDetails',
        meta: { title: '医生详情' },
        component: () => import(/* webpackChunkName: "DoctorDetails" */ '../views/doctor/details')
      },

      {
        path: '/doctor/details/components',
        name: 'SetDoctorDetails',
        meta: { title: '修改详情' },
        component: () => import(/* webpackChunkName: "SetDoctorDetails" */ '../views/doctor/components/SetDetail')
      },
      {
        path: '/doctor/details/components',
        name: 'DoctorPatientList',
        meta: { title: '患者列表' },
        component: () => import(/* webpackChunkName: "DoctorPatientList" */ '../views/doctor/components/PatientList')
      },
      {
        path: '/doctor/details/content_list',
        name: 'DoctorContentList',
        meta: { title: '内容列表' },
        component: () => import(/* webpackChunkName: "DoctorContentList" */ '../views/doctor/components/ContentList')
      },
      {
        path: '/doctor/details/content_stat',
        name: 'DoctorContentCount',
        meta: { title: '内容统计' },
        component: () => import(/* webpackChunkName: "DoctorContentCount" */ '../views/doctor/components/ContentCount')
      },

      {
        path: '/examine',
        name: 'Examine',
        meta: { title: '审核记录' },
        component: () => import(/* webpackChunkName: "Examine" */ '../views/examine')
      },
      {
        path: '/examine_detail',
        name: 'ExamineDetail',
        meta: { title: '审核详情' },
        component: () => import(/* webpackChunkName: "ExamineDetail" */ '../views/examine/set_details')
      },
      {
        path: '/account/set_details',
        name: 'SetAccount',
        meta: { title: '设置用户' },
        component: () => import(/* webpackChunkName: "SetAccount" */ '../views/account/set_account')
      },

      {
        path: '/food_calorie',
        name: 'FoodCalorie',
        meta: { title: '食物热量表' },
        component: () => import(/* webpackChunkName: "FoodCalorie" */ '../views/food_calorie')
      },
      {
        path: '/food_calorie/set_dish',
        name: 'SetDish',
        meta: { title: '设置菜品' },
        component: () => import(/* webpackChunkName: "SetDish" */ '../views/food_calorie/set_dish')
      },
      {
        path: '/exercise_calorie',
        name: 'ExerciseCalorie',
        meta: { title: '运动热量表' },
        component: () => import(/* webpackChunkName: "ExerciseCalorie" */ '../views/exercise_calorie')
      },
      {
        path: '/exercise_calorie/pp_exercise_detail',
        name: 'PpExerciseDetail',
        meta: { title: '推荐运动详情' },
        component: () => import(/* webpackChunkName: "PpExerciseDetail" */ '../views/exercise_calorie/pp_exercise_detail')
      },
      {
        path: '/exercise_calorie/set_exercise',
        name: 'SetExercise',
        meta: { title: '运动热量表' },
        component: () => import(/* webpackChunkName: "SetExercise" */ '../views/exercise_calorie/set_exercise')
      },
      {
        path: '/knowledge_card',
        name: 'KnowledgeCard',
        meta: { title: '知识卡' },
        component: () => import(/* webpackChunkName: "KnowledgeCard" */ '../views/knowledge_card')
      },
      {
        path: '/card_tpl_library',
        name: 'CardTplLibrary',
        meta: { title: '知识卡模板库' },
        component: () => import(/* cardTplLibrary: "CardTplLibrary" */ '../views/knowledge_card/card_tpl_library')
      },
      {
        path: '/tag_library',
        name: 'TagLibrary',
        meta: { title: '标签库' },
        component: () => import(/* webpackChunkName: "TagLibrary" */ '../views/tag_library')
      },
      {
        path: '/scale_manage',
        name: 'ScaleManage',
        meta: { title: '量表管理' },
        component: () => import(/* webpackChunkName: "ScaleManage" */ '../views/scale_manage')
      },
      {
        path: '/scale-record',
        name: 'ScaleRecord',
        meta: { title: '答题记录' },
        component: () => import(/* webpackChunkName: "ScaleRecord" */ '../views/scale_manage/scale_record')
      },
      {
        path: '/scale-detail',
        name: 'ScaleDetail',
        meta: { title: '答题详情' },
        component: () => import(/* webpackChunkName: "ScaleDetail" */ '../views/scale_manage/scale_detail')
      },
      {
        path: '/scale-stat',
        name: 'ScaleStat',
        meta: { title: '答题统计' },
        component: () => import(/* webpackChunkName: "ScaleStat" */ '../views/scale_manage/scale_stat')
      },
      {
        path: '/scale-setting',
        name: 'ScaleSetting',
        meta: { title: '问卷设置', isAdmin: true },
        component: () => import(/* webpackChunkName: "ScaleSetting" */ '../views/scale_manage/scale_setting')
      },
      {
        path: '/set-scale',
        name: 'SetScale',
        meta: { title: '设置量表' },
        component: () => import(/* webpackChunkName: "SetScale" */ '../views/scale_manage/set_scale')
      },
      {
        path: '/solution_tpl',
        name: 'SolutionTpl',
        meta: { title: '干预方案模板' },
        component: () => import(/* webpackChunkName: "SolutionTpl" */ '../views/solution_tpl')
      },
      {
        path: '/solution_tpl/set_solution_tpl',
        name: 'SetSolutionTpl',
        meta: { title: '设置干预方案模板' },
        component: () => import(/* webpackChunkName: "SetSolutionTpl" */ '../views/solution_tpl/set_solution_tpl')
      },
      {
        path: '/solution_tpl/set_exer_tpl',
        name: 'SetExerciseTpl',
        meta: { title: '设置运动模板' },
        component: () => import(/* webpackChunkName: "SetExerciseTpl" */ '../views/solution_tpl/set_exer_tpl')
      },
      {
        path: '/solution_tpl/set_diet_tpl',
        name: 'SetDietTpl',
        meta: { title: '设置营养模板' },
        component: () => import(/* webpackChunkName: "SetDietTpl" */ '../views/solution_tpl/set_diet_tpl')
      },
      {
        path: '/service_right',
        name: 'ServiceRight',
        meta: { title: '服务权益' },
        component: () => import(/* webpackChunkName: "ServiceRight" */ '../views/service_rights')
      },
      {
        path: '/service_right/set_service_rights',
        name: 'SetServiceRights',
        meta: { title: '服务权益' },
        component: () => import(/* webpackChunkName: "SetServiceRights" */ '../views/service_rights/set_service_rights')
      },
      {
        path: '/stat',
        name: 'Stat',
        meta: { title: '统计分析' },
        component: () => import(/* webpackChunkName: "Stat" */ '../views/stat')
      },
      {
        path: '/system',
        name: 'System',
        meta: { title: '统计分析' },
        component: () => import(/* webpackChunkName: "System" */ '../views/system')
      },

      {
        path: '/organization_manage',
        name: 'OrganizationManage',
        meta: { title: '机构管理' },
        component: () => import(/* webpackChunkName: "OrganizationManage" */ '../views/organization_manage')
      },
      {
        path: '/set_organization',
        name: 'SetOrganization',
        meta: { title: '新增机构' },
        component: () => import(/* webpackChunkName: "SetOrganization" */ '../views/organization_manage/set_organization')
      },
      {
        path: '/department_manage',
        name: 'DepartmentManage',
        meta: { title: '部门管理' },
        component: () => import(/* webpackChunkName: "DepartmentManage" */ '../views/department_manage')
      },
      {
        path: '/set_department',
        name: 'SetDepartment',
        meta: { title: '新增部门' },
        component: () => import(/* webpackChunkName: "SetDepartment" */ '../views/department_manage/set_department')
      },

      {
        path: '/dish_library',
        name: 'DishLibrary',
        meta: { title: '菜品库' },
        component: () => import(/* webpackChunkName: "DishLibrary" */ '../views/dish_library')
      },
      {
        path: '/nutritional_prescription',
        name: 'NutritionalPrescription',
        meta: { title: '营养处方', keepAlive: true },
        component: () => import(/* webpackChunkName: "NutritionalPrescription" */ '../views/nutritional_prescription')
      },
      {
        path: '/nutritional_prescription/details',
        name: 'NutritionalPrescriptionDetail',
        meta: { title: '处方详情' },
        component: () => import(/* webpackChunkName: "NutritionalPrescriptionDetail" */ '../views/nutritional_prescription/details')
      },
      {
        path: '/exercise_prescription',
        name: 'ExercisePrescription',
        meta: { title: '运动处方' },
        component: () => import(/* webpackChunkName: "ExercisePrescription" */ '../views/exercise_prescription')
      },
      {
        path: '/common_problem',
        name: 'CommonProblem',
        meta: { title: '常见问题' },
        component: () => import(/* webpackChunkName: "CommonProblem" */ '../views/common_problem')
      },
      {
        path: '/tips',
        name: 'Tips',
        meta: { title: '打卡Tips管理' },
        component: () => import(/* webpackChunkName: "Tips" */ '../views/tips')
      },
      {
        path: '/banner_manage',
        name: 'BannerManage',
        meta: { title: 'banner管理' },
        component: () => import(/* webpackChunkName: "BannerManage" */ '../views/banner_manage')
      },
      {
        path: '/mailing_address',
        name: 'MailingAddress',
        meta: { title: '支架寄回地址' },
        component: () => import(/* webpackChunkName: "MailingAddress" */ '../views/mailing_address')
      },
      {
        path: '/mission_curriculum_category',
        name: 'MissionCurriculumCategory',
        meta: { title: '宣教课程集合' },
        component: () => import(/* webpackChunkName: "MissionCurriculumCategory" */ '../views/mission_curriculum_category')
      },
      {
        path: '/patient_faq_category',
        name: 'PatientFaqCategory',
        meta: { title: '宣教课程集合' },
        component: () => import(/* webpackChunkName: "PatientFaqCategory" */ '../views/patient_faq_category')
      },


      {
        path: '/set_info',
        name: 'SetInfo',
        meta: { title: '修改个人信息' },
        component: () => import(/* webpackChunkName: "SetInfo" */ '@/common/views/set-info')
      },
      {
        path: '/set_pwd',
        name: 'SetPwd',
        meta: { title: '修改密码' },
        component: () => import(/* webpackChunkName: "SetPwd" */ '@/common/views/set-pwd')
      },


      {
        path: '/coupe_cont_check',
        name: 'CoupeContCheck',
        meta: { title: '科普内容审核' },
        component: () => import(/* webpackChunkName: "SetPwd" */ '../views/content_manage')
      },

      {
        path: '/feedback',
        name: 'Feedback',
        meta: { title: '举报及意见反馈' },
        component: () => import(/* webpackChunkName: "Feedback" */ '../views/feedback_manage')
      },
      {
        path: '/log_info',
        name: 'LogInfo',
        meta: { title: '日志管理' },
        component: () => import(/* webpackChunkName: "LogInfo" */ '../views/log_info_manage')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录', isAdmin: true },
    component: () => import(/* webpackChunkName: "Login" */ '@/common/views/login')
  },
  {
    path: '/scale/:no',
    name: 'Scale',
    meta: { title: '问卷调查' },
    component: () => import(/* webpackChunkName: "Scale" */ '../views/scale_preview')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const sysTitle = window.config.SYSTEM_TITLE
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = sysTitle + ' - ' + to.meta.title
  }
  if (from.name === 'Login' && to.redirectedFrom === "/home") {
    const lists = getRoutes(PC_PERMISSION_INFO);
    const permissions = store.getters.userInfo.func_permissions.split(",")
    let pushName = "";
    for (let i = 0; i < lists.length; i++) {
      const element = lists[i];
      if (permissions.includes(element)) {
        pushName = getMeu(menus, element);
        break
      }
    }
    if (pushName) {
      next({
        name: pushName,
      })
    }
  } else {
    next()
  }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
