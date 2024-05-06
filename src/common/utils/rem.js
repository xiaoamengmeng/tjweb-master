const baseSize = 16

function setRem() {
  const screenWidth = window.screen.width
  let viewportWidth = 1680

  if (screenWidth >= 2560) {
    viewportWidth = 1680
  } else if (screenWidth >= 1920) {
    viewportWidth = 1920
  } else if (screenWidth >= 1680) {
    viewportWidth = 1920
  } else if (screenWidth >= 1440) {
    viewportWidth = 1920
  } else if (screenWidth >= 1360) {
    viewportWidth = 1920
  } else {
    viewportWidth = 1920
  }
  const scale = document.documentElement.clientWidth / viewportWidth
  document.documentElement.style.fontSize = baseSize * scale + 'px'
}

setRem()
window.onresize = function () {
  setRem()
}
