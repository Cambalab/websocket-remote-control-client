
require('normalize.css/normalize.css')
require('./styles/index.scss')
const jsQR = require('jsqr')
const WebControlController = require('websocket-remote-control-client').WebControlController
const webcontrol = new WebControlController('https://localhost:8000')

function linkController () {
  const specialNumber = document.getElementById('specialNumberInput').value
  webcontrol.linkController(specialNumber)
};
window.linkController = linkController
document.querySelector('#button').addEventListener('click', linkController)

const widgetOn = (value) => {
  document.getElementById('widget').hidden = !value
  document.getElementById('specialNumber').hidden = value
}
webcontrol.postAlreadyLinked(widgetOn)

/// ///////
// sendurl
/// ///////
function useSendUrl () {
  // show button and input y el boton
  const sendUrl = document.getElementById('sendUrl')
  const sendUrlStatus = sendUrl.hidden
  sendUrl.hidden = !sendUrlStatus
}

function urlRedirect () {
  // send url value
  const value = document.getElementById('urlValue').value
  webcontrol.send(value)
}
window.urlRedirect = urlRedirect
window.useSendUrl = useSendUrl

/// //
// qr
/// //
function useQr () {
  const qr = document.getElementById('qr')
  const qrStatus = qr.hidden
  qr.hidden = !qrStatus
  toggleQR()
}
window.useQr = useQr

function toggleQR () {
  canvasElement.hidden ? startVideo() : stopStreamedVideo(video)
}

function hideElement (id, status) {
  document.getElementById(id).hidden = status
}

function sendData (value) {
  // called from qr2.js
  webcontrol.send(value)
}
window.sendData = sendData

///
//
///

function startVideo () {
  canvasElement.hidden = false
  navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: facingMode } }).then(function (stream) {
    video.srcObject = stream
    video.setAttribute('playsinline', true) // required to tell iOS safari we don't want fullscreen
    video.play()
    requestAnimationFrame(tick)
  }).catch(function (_err) {
    canvasElement.hidden = true
    document.getElementById('permission-error').textContent = 'Error: camera permission refused'
  })
}

const camQrResult = document.getElementById('cam-qr-result')
var video = document.createElement('video')
var canvasElement = document.getElementById('canvas')
var canvas = canvasElement.getContext('2d')
const facingMode = isMobileDevice() ? { exact: 'environment' } : 'environment'

function isMobileDevice () {
  return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)
};

function tick () {
  canvasElement.height = video.videoHeight | 1
  canvasElement.width = video.videoWidth | 1

  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)
  var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height)

  // eslint-disable-next-line no-undef
  var code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert'
  })

  if (code) {
    camQrResult.textContent = code.data
    // eslint-disable-next-line no-undef
    sendData(code.data)
    stopStreamedVideo(video)
    hideElement('qr', true)
  } else {
    requestAnimationFrame(tick)
  }
}

function stopStreamedVideo (videoElem) {
  const stream = videoElem.srcObject
  const tracks = stream.getTracks()
  tracks.forEach(function (track) {
    track.stop()
  })
  videoElem.srcObject = null
  canvasElement.hidden = true
}

function unpair () {
  webcontrol.unpair(document.getElementById('specialNumberInput').value)
  webcontrol.unpairController(widgetOn(false))
}
window.unpair = unpair
