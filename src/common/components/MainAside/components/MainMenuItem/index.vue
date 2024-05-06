<template>
  <el-submenu
    v-if="menu.children && menu.children.length !== 0"
    :index="menu.path"
    v-auth="menu.meta.codename"
    :class="[menu.name]"
  >
    <template slot="title">
      <icon-box :icon-name="menu.path === asideIndex ? menu.meta.icon + '_active' : menu.meta.icon"></icon-box>
      <span class="ml_16">{{ menu.meta.title }}</span>
    </template>
    <main-menu-item
      v-for="child in menu.children"
      :key="child.path"
      :menu="child"
      :index="child.path"
      v-auth="child.meta.codename"
      :class="[child.name]"
    />
  </el-submenu>
  <el-menu-item
    v-else
    :index="menu.path"
    v-auth="menu.meta.codename"
    :class="[menu.name]"
  >
    <icon-box :icon-name="menu.path === asideIndex ? menu.meta.icon + '_active' : menu.meta.icon"></icon-box>
    <el-badge
      v-if="showBage"
      :value="bageNum"
      :hidden="bageNum<=0"
      class="menu-badge"
    >
      <span class="ml_16">{{ menu.meta.title }}</span>
    </el-badge>
    <span
      v-else
      class="ml_16"
    >{{ menu.meta.title }}</span>
  </el-menu-item>
</template>

<script>
import { TSCallSignatureDeclaration } from "babel-types";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MainMenuItem",
  props: {
    menu: {
      type: Object,
    },
  },
  mounted() {
    this.getBage();
    this.$bus.$on("updateBage", () => {
      this.getBage();
    });
  },
  destroyed() {
    this.$bus.$off("updateBage");
  },
  methods: {
    ...mapActions({
      setAsideIndex: "common/setAsideIndex",
      setProjectDistributionNum: "user/setProjectDistributionNum",
      setGroupingNum: "user/setGroupingNum",
    }),
    getBage() {
      if (this.menu.name == "ProjectDistribution") {
        const params = {
          page: 1,
          page_size: 1,
          department_id: this.userInfo.selectedDepartment.id,
          project__isnull: true,
        };
        this.$api.patients.getList(params).then((res) => {
          this.setProjectDistributionNum(res.data.count);
        });
      } else if (this.menu.name == "Grouping") {
        const params = {
          page: 1,
          page_size: 1,
          asgmt_status: 0,
          project__dpt: this.userInfo.selectedDepartment.id,
          project__dpt__organization: this.userInfo.selectedOrganization.id,
        };
        this.$api.projectPatient.getList(params).then((res) => {
          this.setGroupingNum(res.data.count);
        });
      }
    },
  },
  computed: {
    ...mapGetters([
      "asideIndex",
      "userInfo",
      "projectDistributionNum",
      "groupingNum",
    ]),
    bageNum() {
      if (this.menu.name == "ProjectDistribution") {
        return this.projectDistributionNum;
      } else if (this.menu.name == "Grouping") {
        return this.groupingNum;
      }
      return 0;
    },
    showBage() {
      if (
        this.menu.name == "ProjectDistribution" ||
        this.menu.name == "Grouping"
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped lang="less">
.menu-badge {
  :deep(.el-badge__content) {
    top: 10px
  }
}
</style>
