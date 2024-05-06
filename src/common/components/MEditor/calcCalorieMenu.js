import $ from 'jquery'

export default class MyMenu {
  constructor() {
    this.title = '热量计算器'
    // this.iconSvg = '<svg >...</svg>'
    this.tag = 'button'
    this.showModal = true
    this.modalWidth = 300
  }

  getValue(editor) {
    return ''
  }

  isActive(editor) {
    return false // or true
  }

  isDisabled(editor) {
    return false // or true
  }

  exec(editor, value) {
    // do nothing 什么都不用做
  }

  getModalPositionNode(editor) {
    return null // modal 依据选区定位
  }

  getModalContentElem(editor) {
    const $container = $('<div></div>')

    const inputId1 = `input-${Math.random().toString(16).slice(-8)}`
    const inputId2 = `input-${Math.random().toString(16).slice(-8)}`
    const buttonId = `button-${Math.random().toString(16).slice(-8)}`

    const $inputContainer1 = $(`<label class="babel-container">
            <span>体重（kg）</span>
            <input type="text" id="${inputId1}" placeholder="请输入体重" oninput = "value=value.replace(/[^\\d]/g,'')" value="">
          </label>`)
    const $inputContainer2 = $(`<label class="babel-container">
            <span>推荐热量（kcal)</span>
            <input type="text" readonly id="${inputId2}" placeholder="依据体重自动计算" value="">
          </label>`)
    const $buttonContainer = $(`<div class="button-container">
            <button id="${buttonId}">插入</button>
          </div>`)

    $container
      .append($inputContainer1)
      .append($inputContainer2)
      .append($buttonContainer)

    $inputContainer1.on('input', e => {
      const val = $(`#${inputId1}`).val()
      const min = val * 20
      const max = val * 25
      $(`#${inputId2}`).val(`${min}~${max}千卡`)
    })

    $container.on('click', `#${buttonId}`, e => {
      e.preventDefault()

      const text = $(`#${inputId2}`).val()
      if (!text) return

      editor.restoreSelection() // 恢复选区
      editor.insertText(text)
      editor.insertText(' ')
    })

    setTimeout(() => {
      $(`#${inputId1}`).focus()
    })

    return $container[0]

    // PS：也可以把 $container 缓存下来，这样不用每次重复创建、重复绑定事件，优化性能
  }
}
