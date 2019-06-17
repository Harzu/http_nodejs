const net = require('net')
const Route = require('./router')
const staticFiles = require('./static-files')

class App extends Route {
  constructor(options = {}) {
    super()
    this.host = options.host
    this.port = options.port
    this.server = null
  }

  createServer(callback) {
    this.server = net.createServer(requestSocket => {
      requestSocket.on('data', data => this.socketHandler(
        data.toString(),
        requestSocket
      ))
    })

    if (callback) callback()
  }

  closeServer(errorCb = (err) => console.error(err)) {
    this.server.close(errorCb)
  }

  listen(port = this.port, host = this.host, callback = () => {}) {
    this.server.listen(port, host, callback)
  }
  
  static(directoryPath) { staticFiles(directoryPath, this) }
}

module.exports = App