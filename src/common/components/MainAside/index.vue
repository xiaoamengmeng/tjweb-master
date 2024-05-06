<template>
  <el-menu class="el-menu-top" :default-active="defaultActive" :default-openeds="localDefaultOpeneds" @select="menuItemSelect" @open="subMenuOpen" @close="subMenuClose">
    <template v-for="menu in menus">
      <main-menu-item :key="menu.path" :menu="menu"></main-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainMenuItem from './components/MainMenuItem'
import LocalStore from '@/common/utils/LocalStore'

const menuLocal = new LocalStore('menu', true)

export default {
  name: 'MainAside',
  components: {
    MainMenuItem,
  },
  props: {
    menus: {
      type: Array,
      required: true,
    },
    defaultOpeneds: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      index: '',
      defaultActive: '',
      localDefaultOpeneds: [],
    }
  },
  mounted() {
    this.localDefaultOpeneds = this.defaultOpeneds
    const cacheIndex = menuLocal.get('index')
    if (cacheIndex) {
      this.index = cacheIndex
    } else {
      this.index = this.asideIndex
    }
    this.defaultActive = this.index
    this.setAsideIndex(this.index)
  },
  computed: {
    ...mapGetters(['asideIndex']),
  },
  watch: {
    asideIndex(n) {
      this.index = n
      menuLocal.set('index', n)
      this.defaultActive = n
    },
  },
  methods: {
    ...mapActions({
      setAsideIndex: 'common/setAsideIndex',
    }),
    menuItemSelect(index) {
      this.index = index
      menuLocal.set('index', index)
      this.setAsideIndex(index)
      this.$router.push(index)
    },
    subMenuOpen(index, indexPath) {
      // if(index === this.index)
      // this.localDefaultOpeneds = indexPath
      // console.log({indexPath, index})
    },
    subMenuClose(index, indexPath) {
      // this.localDefaultOpeneds = indexPath
      // console.log({indexPath, index})
    },
  }, // methods end
}
</script>

<style scoped lang="less">
.menu-item-style {
  position: relative;
  width: 210px;
  height: 50px;
  line-height: 50px;
  border-radius: 10px;
  margin-left: 20px;
  margin-bottom: 10px;
  padding-left: 22px;
  color: #5a607f;
  user-select: none;

  &:hover,
  &:focus {
    background-color: #ffffff;
  }

  &.is-active {
    background: #ffffff;
    color: @primaryColor;
  }

  &.is-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50px - 25px - 6px);
    width: 2px;
    height: 12px;
    background: @primaryColor;
  }

  .el-submenu__icon-arrow.el-icon-arrow-down::before {
    content: '\e791';
  }
}

.el-menu {
  background-color: @bgColor !important;

  :deep(.el-menu) {
    background-color: @bgColor !important;
  }

  :deep(.el-menu-item, .el-submenu__title) {
    .menu-item-style();
  }

  :deep(.el-submenu) {
    background-color: @bgColor;

    .el-submenu__title {
      .menu-item-style();
    }
  }
}

.el-menu-top {
  border: none;
}
</style>
<style>
.main-aside {
  border-right: solid 1px #e6e6e6;
}
</style>
