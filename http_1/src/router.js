const parser = require('http-string-parser')
const Request = require('./request')
const Response = require('./response')

class Route {
  constructor() {
    this.registredRouts = {
      GET: new Map(),
      POST: new Map(),
      PUT: new Map(),
      DELETE: new Map()
    }
  }

  socketHandler(data, socket) {
    const requestData = parser.parseRequest(data)
    const HTTPRequest = new Request(requestData)
    const HTTPResponse = new Response(requestData, socket)

    if (this.registredRouts[requestData.method].has(HTTPRequest.URI())) {
      const callback = this.registredRouts[requestData.method].get(HTTPRequest.URI())
      callback(HTTPRequest, HTTPResponse)
    }
  }

  get(route, callback = (req, res) => {}) {
    this.registredRouts.GET.set(route, callback)
  }

  post(route, callback = (req, res) => {}) {
    this.registredRouts.POST.set(route, callback)
  }

  put(route, callback = (req, res) => {}) {
    this.registredRouts.PUT.set(route, callback)
  }

  delete(route, callback = (req, res) => {}) {
    this.registredRouts.DELETE.set(route, callback)
  }
}

module.exports = new Route