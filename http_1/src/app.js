const path = require('path')
const net = require('net')
const route = require('./router')
const static = require('./static-files')

const app = net.createServer(requestSocket => {
  requestSocket.on('data', data => route.socketHandler(
      data.toString(),
      requestSocket
  ))
})

route.get('/', (req, res) => {
  res.htmlRender(path.join(__dirname, '../tests/static', 'index.html'))
  res.send()
})

route.get('/text', (req, res) => {
  res.text('Hello')
  res.send()
})

route.get('/json', (req, res) => {
  res.json(JSON.stringify('{a: 1}'))
  res.send()
})

route.post('/set', (req, res) => {
  res.json(JSON.stringify(req.Body()))
  res.send()
})

process.on('SIGINT', () => app.close(err => console.log(err)))
app.listen(3000, '127.0.0.1')