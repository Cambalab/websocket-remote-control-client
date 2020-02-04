
require('normalize.css/normalize.css')
require('./styles/index.scss')

const WebControlScreen = require('websocket-remote-control-client').WebControlScreen
// eslint-disable-next-line no-unused-vars
const webControlScreen = new WebControlScreen('https://localhost:8000', ['urlRedirect'])
