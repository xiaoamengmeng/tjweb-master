import {clearHtml } from '@/default/lemon-imui/utils';
export default {
  file(message) {
    return "[文件]";
  },
  image(message) {
    return "[图片]";
  },
  text(message) {
    return this.emojiNameToImage(clearHtml(message.content));
  },
  event(message){
    return '[通知]';
  },
  video(message) {
    return '[视频]'
  },
  sound(message) {
    return '[语音]'
  },
  unknown(message) {
    return '[未知消息]'
  },
  custom(message){
    return `[${message.content}]`;
  },
};
