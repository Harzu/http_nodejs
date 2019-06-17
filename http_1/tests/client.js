const net = require('net')
const { expect } = require('chai')
const parser = require('http-string-parser')
const route = require('../src/router')

let app = null
let client = null
const HOST = '127.0.0.1'
const PORT = 3000

describe('http test', () => {
  beforeEach(() => {
    app = net.createServer(requestSocket => {
      requestSocket.on('data', data => route.socketHandler(
          data.toString(),
          requestSocket
      ))
    })

    route.get('/testJson', (req, res) => {
      res.json(JSON.stringify({ a: 1 }))
      res.end()
    })

    route.get('/testtext', (req, res) => {
      res.text('Hello world')
      res.end()
    })

    route.post('/body', (req, res) => {
      const body = req.reqParams.body
      res.json(body)
      res.end() 
    })

    process.on('SIGINT', () => app.close(err => console.log(err)))
    app.listen(PORT, HOST, () => console.log(`server start to http://${HOST}:${PORT}`))

    client = net.connect({
      host: HOST,
      port: PORT
    }, () => console.log(`client connected to http://${HOST}:${PORT} est!`))
  })

  afterEach(() => {
    app.close(err => console.log(err))
    client.removeAllListeners('data')
    client.destroy()
    client.end()

    console.log('Client and server closed')
  })

  it('request/response get text', done => {
    client.on('data', data => {
      const parseData = parser.parseResponse(data.toString())
      expect(parseData.body).to.be.equal('Hello world')
      done()
    })

    client.write(`GET /testtext HTTP/1.1 \r\nHost: ${HOST}:${PORT} \r\nCache-control: no-cache\r\n`)
    client.pipe(client)
  })

  it('request/response get json', done => {
    client.on('data', data => {
      const parseData = parser.parseResponse(data.toString())
      const response = JSON.parse(parseData.body)
      expect(response).to.deep.equal({ a: 1 })
      done()
    })

    client.write(`GET /testJson HTTP/1.1 \r\nHost: ${HOST}:${PORT} \r\nCache-control: no-cache\r\n`)
    client.pipe(client)    
  })

  it('request/response post', done => {
    const postData = JSON.stringify({ origin: 'localhost' })
    client.on('data', data => {
      const parseData = parser.parseResponse(data.toString())
      const response = JSON.parse(parseData.body)
      expect(response).to.deep.equal({ origin: 'localhost' })
      done()
    })

    client.write(`POST /body HTTP/1.1 \r\nHost ${HOST}:${PORT} \r\nCache-control: no-cache \r\n\r\n ${postData}\r\n`)
  })
})