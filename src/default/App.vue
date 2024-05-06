<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import WaterMark from '@/common/utils/waterMark'
export default {
  name: 'App',
  data() {
   return {
      waterMark: null,
    };
  },
  methods: {
    // 设置水印
    showMark() {
      this.waterMark = new WaterMark({
        watermark_txt: `用户：`, // 水印的内容
        watermark_x: 50, // 水印起始位置x轴坐标
        watermark_y: 50, // 水印起始位置Y轴坐标
        watermark_rows: 0, // 水印行数
        watermark_cols: 0, // 水印列数
        watermark_x_space: 50, // 水印x轴间隔
        watermark_y_space: 50, // 水印y轴间隔
        watermark_width: 150, // 水印宽度
        watermark_height: 80, // 水印长度
        watermark_angle: 315, // 水印倾斜度数
        monitor: false,
      });
    },
  },
  mounted(){
    // this.showMark()
  }
}
</script>
