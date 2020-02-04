require('dotenv').config()
var express = require('express')
var fs = require('fs')
var app = express()
var server = require('https')
var cors = require('cors')
var serverHost = process.env.SERVER_HOST
var port = process.env.PORT
var path = require('path')
app.use(cors())

server = server.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(8000, function () {
  console.log(`listening on *:${port}. Go to: https://${serverHost}:${port}`)
})

const WebControlServer = require('websocket-remote-control-server')
// eslint-disable-next-line no-unused-vars
const webcontrol = new WebControlServer(server)

app.get('/socket.io', function (req, res) {
  res.sendFile(path.join(__dirname, 'node_modules/socket.io-client/dist/socket.io.js'))
})

app.get('/', function (req, res) {
  res.end('hello!')
})
