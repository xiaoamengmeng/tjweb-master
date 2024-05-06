import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/layout'
import store from '@/common/store'
import { NUTR_PERMISSION_INFO } from '@/common/utils/dict'
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
    // redirect: '/home',
    redirect: '/login',
    meta: { title: 'Root' },
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        redirect: '/project'
      },
      {
        path: '/project',
        name: 'Project',
        meta: { title: '项目管理' },
        component: () => import(/* webpackChunkName: "Project" */ '../views/project')
      },
      {
        path: '/project_detail/:id',
        name: 'ProjectDetail',
        meta: { title: '项目详情' },
        component: () => import(/* webpackChunkName: "ProjectDetail" */ '../views/project/project_detail')
      },
      {
        path: '/project/set_project',
        name: 'SetProject',
        meta: { title: '设置项目' },
        component: () => import(/* webpackChunkName: "SetProject" */ '../views/project/set_project')
      },
      {
        path: '/project/set_solution',
        name: 'ProjectSetSolution',
        meta: { title: '设置项目' },
        component: () => import(/* webpackChunkName: "ProjectSetSolution" */ '../views/project/set_solution')
      },
      {
        path: '/team_detail/:id',
        name: 'TeamDetail',
        meta: { title: '团队详情' },
        component: () => import(/* webpackChunkName: "TeamDetail" */ '../views/team/team_detail')
      },
      {
        path: '/team/set_team',
        name: 'SetTeam',
        meta: { title: '设置团队' },
        component: () => import(/* webpackChunkName: "SetTeam" */ '../views/team/set_team')
      },
      {
        path: '/serviceTeam',
        name: 'ServiceTeam',
        meta: { title: '服务团队管理' },
        component: () => import(/* webpackChunkName: "Project" */ '../views/service_team')
      },
      {
        path: '/grouping',
        name: 'Grouping',
        meta: { title: '营养师分配' },
        component: () => import(/* webpackChunkName: "Grouping" */ '../views/grouping')
      },
      {
        path: '/project_distribution',
        name: 'ProjectDistribution',
        meta: { title: '项目分配' },
        component: () => import(/* webpackChunkName: "ProjectDistribution" */ '../views/project_distribution')
      },
      {
        path: '/patient',
        name: 'Patient',
        meta: { title: '我的患者' },
        component: () => import(/* webpackChunkName: "Patient" */ '../views/patient')
      },
      {
        path: '/patient_detail/:id',
        name: 'PatientDetail',
        meta: { title: '患者详情' },
        component: () => import(/* webpackChunkName: "PatientDetail" */ '../views/patient/patient_detail')
      },
      {
        path: '/patient/set_recipe',
        name: 'PatientSetRecipe',
        meta: { title: '为患者配餐' },
        component: () => import(/* webpackChunkName: "PatientSetRecipe" */ '../views/patient/set_recipe')
      },
      {
        path: '/patient/set_solution',
        name: 'PatientSetSolution',
        meta: { title: '设置患者干预方案' },
        component: () => import(/* webpackChunkName: "PatientSetSolution" */ '../views/patient/set_solution')
      },
      {
        path: '/patient/lows_weight',
        name: 'PatientLowsWeight',
        meta: { title: '减重报告' },
        component: () => import(/* webpackChunkName: "PatientLowsWeight" */ '../views/patient/lose_weight')
      },
      {
        path: '/patient/follow_up',
        name: 'PatientFollowUp',
        meta: { title: '随访记录' },
        component: () => import(/* webpackChunkName: "PatientFollowUp" */ '../views/patient/follow_up')
      },
      {
        path: '/patient/set_follow_up',
        name: 'PatientSetFollowUp',
        meta: { title: '创建随访' },
        component: () => import(/* webpackChunkName: "PatientSetFollowUp" */ '../views/patient/follow_up/set_follow_up')
      },
      {
        path: '/patient/ocr_detail',
        name: 'PatientOcrDetail',
        meta: { title: '报告审录' },
        component: () => import(/* webpackChunkName: "PatientOcrDetail" */ '../views/patient/ocr_detail')
      },
      {
        path: '/patient/recommend_exercise',
        name: 'PatientRecommendExercise',
        meta: { title: '推荐运动' },
        component: () => import(/* webpackChunkName: "PatientRecommendExercise" */ '../views/patient/recommend_exercise')
      },
      {
        path: '/todo_task',
        name: 'TodoTask',
        meta: { title: '待办任务' },
        component: () => import(/* webpackChunkName: "TodoTask" */ '../views/todo_task')
      },
      {
        path: '/im',
        name: 'IM',
        meta: { title: '消息' },
        component: () => import(/* webpackChunkName: "IM" */ '../views/im')
      },
      {
        path: '/solution',
        name: 'Solution',
        meta: { title: '干预方案' },
        component: () => import(/* webpackChunkName: "Solution" */ '../views/solution')
      },
      {
        path: '/solution/set_solution',
        name: 'SetSolution',
        meta: { title: '设置干预方案' },
        component: () => import(/* webpackChunkName: "SetSolution" */ '../views/solution/set_solution')
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
        path: '/exercise_calorie/set_exercise',
        name: 'SetExercise',
        meta: { title: '设置运动项目' },
        component: () => import(/* webpackChunkName: "SetExercise" */ '../views/exercise_calorie/set_exercise')
      },
      {
        path: '/exercise_calorie/pp_exercise_detail',
        name: 'PpExerciseDetail',
        meta: { title: '推荐运动详情' },
        component: () => import(/* webpackChunkName: "PpExerciseDetail" */ '../views/exercise_calorie/pp_exercise_detail')
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
        path: '/recipe_library',
        name: 'RecipeLibrary',
        meta: { title: '食谱库' },
        component: () => import(/* webpackChunkName: "RecipeLibrary" */ '../views/recipe_library')
      },
      {
        path: '/recipe_library/set_recipe',
        name: 'SetRecipe',
        meta: { title: '设置食谱' },
        component: () => import(/* webpackChunkName: "SetRecipe" */ '../views/recipe_library/set_recipe')
      },
      {
        path: '/recipe_library/set_patient_recipe',
        name: 'SetPatientRecipe',
        meta: { title: '设置患者配餐' },
        component: () => import(/* webpackChunkName: "SetPatientRecipe" */ '../views/recipe_library/set_patient_recipe')
      },
      {
        path: '/content_manage',
        name: 'ContentManage',
        meta: { title: '内容管理' },
        component: () => import(/* webpackChunkName: "ContentManage" */ '../views/content_manage')
      },
      {
        path: '/content_manage/set_article',
        name: 'SetArticle',
        meta: { title: '上传文章' },
        component: () => import(/* webpackChunkName: "ContentManage" */ '../views/content_manage/set_article')
      },
      {
        path: '/content_manage/set_video',
        name: 'SetVideo',
        meta: { title: '发布视频' },
        component: () => import(/* webpackChunkName: "ContentManage" */ '../views/content_manage/set_video')
      },
      {
        path: '/medical',
        name: 'Medical',
        meta: { title: '病历报告模板' },
        component: () => import(/* webpackChunkName: "Medical" */ '../views/medical')
      },
      {
        path: '/medical/set_medical',
        name: 'SetMedical',
        meta: { title: '设置报告模板' },
        component: () => import(/* webpackChunkName: "SetMedical" */ '../views/medical/set_medical')
      },
      {
        path: '/scale_manage',
        name: 'ScaleManage',
        meta: { title: '量表管理' },
        component: () => import(/* webpackChunkName: "ScaleManage" */ '../views/scale_manage')
      },
      {
        path: '/scale_manage/scale-record',
        name: 'ScaleRecord',
        meta: { title: '答题记录' },
        component: () => import(/* webpackChunkName: "ScaleRecord" */ '../views/scale_manage/scale_record')
      },
      {
        path: '/scale_manage/scale-detail',
        name: 'ScaleDetail',
        meta: { title: '答题详情' },
        component: () => import(/* webpackChunkName: "ScaleDetail" */ '../views/scale_manage/scale_detail')
      },
      {
        path: '/scale_manage/scale-stat',
        name: 'ScaleStat',
        meta: { title: '答题统计' },
        component: () => import(/* webpackChunkName: "ScaleStat" */ '../views/scale_manage/scale_stat')
      },
      {
        path: '/scale_manage/scale-setting',
        name: 'ScaleSetting',
        meta: { title: '问卷设置', isAdmin: false },
        component: () => import(/* webpackChunkName: "ScaleSetting" */ '../views/scale_manage/scale_setting')
      },
      {
        path: '/scale_manage/set-scale',
        name: 'SetScale',
        meta: { title: '设置量表' },
        component: () => import(/* webpackChunkName: "ScaleStat" */ '../views/scale_manage/set_scale')
      },
      {
        path: '/stat',
        name: 'Stat',
        meta: { title: '统计分析' },
        component: () => import(/* webpackChunkName: "Stat" */ '../views/stat')
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
        path: '/common_problem',
        name: 'CommonProblem',
        meta: { title: '患者常见问题' },
        component: () => import(/* webpackChunkName: "CommonProblem" */ '../views/common_problem')
      },
      {
        path: '/project_rule',
        name: 'ProjectRule',
        meta: { title: '患者项目关联规则' },
        component: () => import(/* webpackChunkName: "ProjectRule" */ '../views/project_rule')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录', isAdmin: false },
    component: () => import(/* webpackChunkName: "Login" */ '@/common/views/login')
  },
  {
    path: '/scale/:no',
    name: 'Scale',
    meta: { title: '问卷调查' },
    component: () => import(/* webpackChunkName: "Scale" */ '../views/scale_preview')
  },
  {
    path: '/demo',
    name: 'Demo',
    meta: { title: 'Demo' },
    component: () => import(/* webpackChunkName: "Demo" */ '@/common/components/Demo')
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
  next()
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = sysTitle + ' - ' + to.meta.title
  }
  if (from.name === 'Login' && to.redirectedFrom === "/home") {
    const lists = getRoutes(NUTR_PERMISSION_INFO, ["list", "manage"]);
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
