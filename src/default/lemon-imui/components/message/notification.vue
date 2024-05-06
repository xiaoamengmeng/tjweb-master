<script>
export default {
  name: "lemonMessageNotification",
  inheritAttrs: false,
  inject: ["IMUI"],
  props:{
    timeFormat: {
      type: Function,
      default: () => "",
    },
  },
  render() {
    const { content,sendTime } = this.$attrs.message;
    return (
      <div class="lemon-message lemon-message-notification">
        <div class="lemon-message-notification__wrap">
          <div
            class="lemon-message-notification__time"
          >
            {this.timeFormat(sendTime)}
          </div>
          <div
            class="lemon-message-notification__content"
            on-click={e => this._emitClick(e, "content")}
          >
            {content}
          </div>
        </div>
      </div>
    );
  },
  methods: {
    _emitClick(e, key) {
      this.IMUI.$emit("message-click", e, key, this.$attrs.message, this.IMUI);
    }
  }
};
</script>
<style lang="stylus">
@import '../../styles/utils/index'
+b(lemon-message-notification)
  +e(wrap)
    width 100%
    text-align: center
  +e(time)
    display inline-block
    user-select none
    background #e9e9e9
    color #aaa
    font-size 12px
    padding 5px 10px
    border-radius 4px
    margin 5px auto
  +e(content)
    background #fff
    font-size 14px
    color #333
    padding 20px 15px
    line-height 20px
    border-radius 4px
    text-align left
    width 80%
</style>
