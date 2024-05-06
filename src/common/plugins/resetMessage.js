import { Message } from 'element-ui';

// message单例
let messageInstance = null;
const resetMessage = (options) => {
  if (messageInstance) {
    // messageInstance.close()
  }
  messageInstance = Message(options)
}
['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        offset: 70,
        duration: 3000,
      }
    }
    options.type = type
    return resetMessage(options)
  }
})
export const message = resetMessage
