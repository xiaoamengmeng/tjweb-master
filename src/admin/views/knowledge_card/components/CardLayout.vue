<template>
  <div class="card-carousel--card card-layout-wrapper">
    <template v-if="title !== ''">
      <div class="layout-card-title">{{ title }}</div>
    </template>
    <div
      class="grid"
      :style="`width: ${width}px; height: ${height}px;`"
      :class="[{bg: bgColor}, 'kcard__' + config.layout]"
    >
      <template v-if="config.layout">
        <div class="title">
          <!--          {{ config.title ? config.title : '标题XXXXX' }}-->
          {{ '标题XXXXX' }}
        </div>
        <div class="desc">
          <!--          {{ config.desc ? config.desc : '描述描述描述描述描述描述描述' }}-->
          {{ '描述描述描述描述描述描述描述' }}
        </div>
      </template>
    </div>
    <m-button v-if="!hideBtn" plain :w="`${width}px`" h="40px" @click="handleUse">{{ btnText }}</m-button>
  </div>
</template>

<script>
export default {
  name: 'CardLayout',
  props: {
    config: {
      type: Object,
      required: true
    },
    width: {
      type: [Number, String],
      default: 200
    },
    height: {
      type: [Number, String],
      default: 200
    },
    hideBtn: {
      type: Boolean,
      default: false,
    },
    btnText: {
      type: String,
      default: '使 用'
    },
    bgColor: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '',
    }
  },
  methods: {
    handleUse() {
      this.$emit('use', this.config)
    }
  },
}
</script>

<style scoped lang="less">
@import "./kcard-layout.less";

.card-layout-wrapper {
  border-radius: @kcardBorderRadius;

  .grid {
    pointer-events: none;
    margin-bottom: 5px;
    box-sizing: border-box;
    border-radius: @kcardBorderRadius;
    //background-color: #e8eaee;
    width: calc(100% - @kcardBorderRadius - @kcardBorderRadius);
    height: calc(100% - @kcardBorderRadius - @kcardBorderRadius);
    padding: 12px;
  }
}

.title {
  font-size: 15px;
  font-weight: bold;
  color: #191D51;
}

.desc {
  color: #191D51;
  font-size: 13px;
}

.bg {
  background-color: #e8eaee;
}

//.kcard__center {
//  display: flex;
//  flex-direction: column;
//  justify-content: center;
//  align-items: center;
//}
//
//.kcard__top-center {
//  display: flex;
//  flex-direction: column;
//  justify-content: flex-start;
//  align-items: center;
//}
//
//.kcard__top-left {
//  display: flex;
//  flex-direction: column;
//  justify-content: flex-start;
//  align-items: flex-start;
//}
//
//.kcard__top-right {
//  display: flex;
//  flex-direction: column;
//  justify-content: flex-start;
//  align-items: flex-end;
//}

.kcard__v-between {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.kcard__rtl {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;

  .title {
    width: 15px;
  }

  .desc {
    width: 18px;
  }
}

.kcard__bottom-center {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.layout-card-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  cursor: default !important;
  border: unset !important;
  color: #191D51 !important;
}
</style>
