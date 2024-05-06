<template>
  <div class="health-record-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in actives"
        :key="index"
        :label="item.label"
        :name="item.id"
      >
        <component
          :is="item.com"
          :ppInfo="ppInfo"
          :previewImage="previewImage"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import calendar from "./calendar.vue";
import weightRecord from "./weightRecord.vue";
import dietRecord from "./dietRecord.vue";
import exerciseRecord from "./exerciseRecord.vue";
import bloodPressureRecord from "./bloodPressureRecord.vue";
import waterRecord from "./waterRecord.vue";
import emotionRecord from "./emotionRecord.vue";
import sleepRecord from "./sleepRecord.vue";
import menstrualPeriodRecord from "./menstrualPeriodRecord.vue";
import bodyCompositionRecord from "./bodyCompositionRecord.vue";
import bodyCircumferenceRecord from "./bodyCircumferenceRecord.vue";
import bloodSugarRecord from "./bloodSugarRecord.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    calendar,
    weightRecord,
    dietRecord,
    exerciseRecord,
    bloodPressureRecord,
    waterRecord,
    emotionRecord,
    sleepRecord,
    menstrualPeriodRecord,
    bodyCompositionRecord,
    bodyCircumferenceRecord,
    bloodSugarRecord,
  },
  props: ["ppInfo", "previewImage"],
  data() {
    return {
      activeName: "1",
      actives: [
        {
          id: "1",
          label: "体重",
          com: "weightRecord",
        },
        {
          id: "2",
          label: "饮食",
          com: "dietRecord",
        },
        {
          id: "3",
          label: "运动",
          com: "exerciseRecord",
        },
        {
          id: "4",
          label: "体成分",
          com: "bodyCompositionRecord",
        },
        {
          id: "5",
          label: "五围",
          com: "bodyCircumferenceRecord",
        },
        {
          id: "6",
          label: "血压",
          com: "bloodPressureRecord",
        },
        {
          id: "7",
          label: "血糖",
          com: "bloodSugarRecord",
        },
        {
          id: "8",
          label: "饮水",
          com: "waterRecord",
        },
        {
          id: "9",
          label: "心情",
          com: "emotionRecord",
        },
        {
          id: "10",
          label: "睡眠",
          com: "sleepRecord",
        },
      ],
    };
  },
  created() {
    if (this.ppInfo.patient.sex == "F") {
      this.actives.push({
        id: "11",
        label: "经期",
        com: "menstrualPeriodRecord",
      });
    }
  },
};
</script>

<style lang="less" scoped>
.health-record-container {
  padding-top: 20px;
}
</style>
