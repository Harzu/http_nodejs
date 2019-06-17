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

static(path.join(__dirname, '../tests/static'), route)

route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../tests/static', 'index.html'))
  res.end()
})

route.get('/text', (req, res) => {
  res.text('Hello')
  res.end()
})

route.get('/json', (req, res) => {
  res.json(JSON.stringify('{a: 1}'))
  res.end()
})

route.post('/set', (req, res) => {
  res.json(JSON.stringify(req.Body()))
  res.end()
})

process.on('SIGINT', () => app.close(err => console.log(err)))
app.listen(3000, '127.0.0.1')