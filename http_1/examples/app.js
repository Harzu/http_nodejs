const path = require('path')
const App = require('../src/index')

const app = new App
app.createServer()
app.static(path.join(__dirname, './static'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './static', 'index.html'))
  res.end()
})

app.get('/text', (req, res) => {
  res.text('Hello')
  res.end()
})

app.get('/json', (req, res) => {
  res.json(JSON.stringify('{a: 1}'))
  res.end()
})

app.post('/set', (req, res) => {
  res.json(JSON.stringify(req.Body()))
  res.end()
})

process.on('SIGINT', () => app.closeServer())
app.listen(3000, '127.0.0.1', () => console.log('server start'))


