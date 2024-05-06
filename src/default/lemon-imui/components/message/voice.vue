<script>
export default {
  name: "lemonMessageVoice",
  inheritAttrs: false,
  render() {
    return (
      <lemon-message-basic
        class="lemon-message-voice"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: props => {
            return <span on-click={e=>{this.playSound(props.tim.payload)}}>{props.tim.payload.second}"&nbsp;&nbsp;<i class="el-icon-microphone"></i></span>
          }
        }}
      />
    );
  },
  methods:{
    playSound(payload){
      // console.log(payload)
      let audio = document.createElement("audio");
      audio.setAttribute("src", payload.remoteAudioUrl);
      audio.play();
    }
  }
};
</script>
<style lang="stylus">
@import '../../styles/utils/index'
+b(lemon-message-voice)
  +b(lemon-message)
    +e(content)
      padding 10px
      cursor pointer
      overflow hidden
      img
        max-width 100%
        min-width 100px
        display block
</style>
