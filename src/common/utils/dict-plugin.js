import {
  STATUS_PROJECT,
  STATUS_AUTHORIZE,
  PROJECT_TYPE,
  CARD_LAYOUT,
  PRODUCT,
  SEX,
  PATIENT_SERVICE_STATUS,
  STATUS_TEAM,
  MEAL_TYPE,
  MEDICAL_RECORD_TYPE,
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
  STATUS_USER,
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
} from './dict'

const dictGenerate = function (dict) {
  return {
    getLabel: (code) => {
      const target = dict.find(item => item.code === code)
      if (target) {
        return target.label
      } else {
        return null
      }
    },
    getCode: (label) => {
      const target = dict.find(item => item.label === label)
      if (target) {
        return target.code
      } else {
        return null
      }
    },
    data: dict
  }
}

const install = Vue => {
  Vue.prototype.$dict = {
    project: dictGenerate(STATUS_PROJECT),
    auth: dictGenerate(STATUS_AUTHORIZE),
    projectType: dictGenerate(PROJECT_TYPE),
    cardLayout: dictGenerate(CARD_LAYOUT),
    product: dictGenerate(PRODUCT),
    sex: dictGenerate(SEX),
    patientServiceStatus: dictGenerate(PATIENT_SERVICE_STATUS),
    teamStatus: dictGenerate(STATUS_TEAM),
    mealType: dictGenerate(MEAL_TYPE),
    medicalRecordType: dictGenerate(MEDICAL_RECORD_TYPE),
    weightRecordTimePeriod: dictGenerate(WEIGHT_RECORD_TIME_PERIOD),
    patientServiceRightsStatus: dictGenerate(PATIENT_SERVICE_RIGHTS_STATUS),
    organizationManageStatus: dictGenerate(ORGANIZATION_MANAGE_STATUS),
    departmentManageStatus: dictGenerate(DEPARTMENT_MANAGE_STATUS),
    nutritionalSexStatus: dictGenerate(NUTRITIONAL_SEX_STATUS),
    nutritionalAgeStatus: dictGenerate(NUTRITIONAL_AGE_STATUS),
    nutritionalBMIStatus: dictGenerate(NUTRITIONAL_BMI_STATUS),
    nutritionalBloodPressureStatus: dictGenerate(NUTRITIONAL_BLOOD_PRESSURE_STATUS),
    nutritionalBloodGlucoseStatus: dictGenerate(NUTRITIONAL_BLOOD_GLUCOSE_STATUS),
    nutritionalBloodFatStatus: dictGenerate(NUTRITIONAL_BLOOD_FAT_STATUS),
    nutritionalBloodPalStatus: dictGenerate(NUTRITIONAL_BLOOD_PAL_STATUS),
    userStatus: dictGenerate(STATUS_USER),
    personnelType: dictGenerate(PERSONNEL_TYPE),
    nutritionalBloodMealType: dictGenerate(NUTRITIONAL_BLOOD_MEAL_TYPE),
    exerciseActionsType: dictGenerate(EXERCISE_ACTIONS_TYPE),
    exercisePeopleType: dictGenerate(EXERCISE_PEOPLE_TYPE),
    commonProblemType: dictGenerate(COMMON_PROBLEM_TYPE),
    permissionDataType: dictGenerate(PERMISSION_DATA_TYPE),
    pcPermissionInfo: dictGenerate(PC_PERMISSION_INFO),
    nutrPermissionInfo: dictGenerate(NUTR_PERMISSION_INFO),
    followUpAdverseType: dictGenerate(FOLLOW_UP_ADVERSE_TYPE),
    tipsType: dictGenerate(TIPS_TYPE),
    doctorAuthentication: dictGenerate(DOCTOR_AUTHENTICATION),
    bannerType: dictGenerate(BANNER_TYPE),
    contentCheckType: dictGenerate(CONTENTCHECK_DATA_TYPE),
  }
}
export default {
  install
}

