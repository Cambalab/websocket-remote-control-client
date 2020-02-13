
require('normalize.css/normalize.css')
require('./styles/index.scss')

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
// will excute widgetOn() after alreadyLinked() with the returned value as param
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
