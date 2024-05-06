<template>
  <div class="m-category-wrapper">
    <div class="header">
      <div class="title">{{ title }}</div>
      <div class="btn-group">
        <el-button v-auth="addAuth" circle icon="el-icon-plus" @click="addClick"></el-button>
        <el-button v-auth="deleteAuth" circle icon="el-icon-minus" @click="minusClick"></el-button>
      </div>
    </div>
    <div class="body">
      <div
        v-for="(item, index) in data"
        :key="'cateItem' + index"
        class="item"
        :class="{active: index === currIndex}"
        @click="itemClick(item, index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MCategory',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    select: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '分类',
    },
    addAuth: {
      type: String,
      default: '',
    },
    deleteAuth: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      curr: {},
      currIndex: null,
    }
  },
  methods: {
    addClick() {
      this.$emit('add')
    },
    minusClick() {
      this.$emit('minus')
    },
    itemClick(item, index) {
      this.curr = item
      if (index === this.currIndex) {
        this.currIndex = null
        this.$emit('update:select', {})
        this.$emit('click', {})
      } else {
        this.currIndex = index
        this.$emit('update:select', item)
        this.$emit('click', item, index)
      }
    }
  },
}
</script>

<style scoped lang="less">
.m-category-wrapper {
  :deep(::-webkit-scrollbar) {
    width: 8px; /*对垂直流动条有效*/
    height: 8px; /*对水平流动条有效*/
    cursor: pointer;
    background-color: transparent;
    position: absolute;
  }

  /*定义滚动条的轨道颜色、内阴影及圆角*/

  :deep(::-webkit-scrollbar-track) {
    background-color: transparent;
  }

  /*定义滑块颜色、内阴影及圆角*/

  :deep(::-webkit-scrollbar-thumb) {
    background-color: #aaaaaa;

    &:hover {
      background-color: #aaaaaa;
    }
  }

  :deep(.card) {
    margin-top: 32px;
    height: calc(100% - 32px - 32px);
    box-shadow: 0 10px 20px 0 rgb(0 0 0 / 10%);

    .el-card__body {
      height: 100% !important;
      padding: 0;
    }
  }

  box-sizing: border-box;
  width: 200px;
  height: 100%;
  //border-radius: 12px;
  border-radius: 8px;
  border: 1px solid #D9E1EC;
  background-color: #ffffff;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    height: 40px;
    line-height: 40px;
    background-color: #f4f5fa;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;

    .title {
      line-height: 32px;
      color: #4F5D74;
      font-size: 16px;
    }

    .btn-group {
      .el-button {
        padding: 0;
        width: 24px;
        height: 24px;
        font-size: 14px;
        color: #5A6D86;

        i {
          font-weight: bold;
        }

        &:hover, &:focus {
          color: #5A607F;
          background-color: #e9edfa !important;
          border-color: #a2a8c3;

        }

        &:active {
          background-color: #fff !important;
        }
      }
    }
  }

  .body {
    height: calc(100% - 40px - 10px);
    overflow-x: hidden;
    overflow-y: auto;

    .item {
      .text-cut();
      padding-left: 5px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #4F5D74;
      cursor: pointer;
    }
  }

}

.text-cut {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.active {
  background-color: #e9edfa;
}
</style>
