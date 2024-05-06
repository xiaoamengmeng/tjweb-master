import base from '../base'
import axios from '../http'

export default {
  getList(payload) {
    return axios.get(`${base}/patients/`, {
      params: payload,
    })
  },
  getDetail(id) {
    return axios.get(`${base}/patients/${id}/`)
  },
  create(payload) {
    return axios.post(`${base}/patients/`, payload)
  },
  update(id, payload) {
    return axios.put(`${base}/patients/${id}/`, payload)
  },
  patch(id, payload) {
    return axios.patch(`${base}/patients/${id}/`, payload)
  },
  delete(id) {
    return axios.delete(`${base}/patients/${id}/`)
  },
  getStat(user_id, payload) {
    return axios.get(`${base}/patients/${user_id}/stats/`, {
      params: payload,
    })
  },
  getgetPatientRecordList(payload) {
    return axios.get(`${base}/patient_record_state/`, {
      params: payload,
    })
  },
  // 查看用户是健康评估状态
  getPatientRecordState(patient_id) {
    return axios.get(`${base}/patient_record_state/${patient_id}/`)
  },
  patchPatientRecordState(patient_id, payload) {
    return axios.patch(`${base}/patient_record_state/${patient_id}/`, payload)
  },
  // 交换食材
  getNutritionFoodCommutative(payload) {
    return axios.get(`${base}/nutrition_food_commutative/`, {
      params: payload,
    })
  },
  // 获取患者运动处方
  getPatientExercisePrescription(id) {
    return axios.get(`${base}/patient_exercise_prescription/${id}/`)
  },
  // 更新患者运动处方
  patchPatientExercisePrescription(id, payload) {
    return axios.patch(`${base}/patient_exercise_prescription/${id}/`, payload)
  },
  // 撤回患者运动处方
  recallPatientExercisePrescription(id) {
    return axios.post(`${base}/patient_exercise_prescription/${id}/recall/`)
  },
  // 获取患者运动处方列表
  getPatientExercisePrescriptionList(payload) {
    return axios.get(`${base}/patient_exercise_prescription/`, {
      params: payload,
    })
  },
  // 生成患者运动处方
  createPatientExercisePrescription(payload) {
    return axios.post(`${base}/patient_exercise_prescription/`, payload)
  },

  // 获取患者营养处方
  getPatientNutritionPrescription(id) {
    return axios.get(`${base}/patient_nutrition_prescription/${id}/`)
  },
  // 更新患者营养处方
  patchPatientNutritionPrescription(id, payload) {
    return axios.patch(`${base}/patient_nutrition_prescription/${id}/`, payload)
  },
  // 撤回患者营养处方
  recallPatientNutritionPrescription(id) {
    return axios.post(`${base}/patient_nutrition_prescription/${id}/recall/`)
  },

  assignProject(payload) {
    return axios.post(`${base}/patients/assign_project/`, payload)
  },

  bulkAssignProject(payload) {
    return axios.post(`${base}/patients/bulk_assign_project/`, payload)
  },

  leaveProject(payload) {
    return axios.post(`${base}/patients/leave_project/`, payload)
  },

  leaveOnlyProject(payload) {
    return axios.post(`${base}/patients/leave_only_project/`, payload)
  }

}
