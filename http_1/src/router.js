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
    } else {
      HTTPResponse.status(404)
      HTTPResponse.end()
    }
  }

  get(route, callback = (req, res) => {}) {
    if (!this.registredRouts.GET.has(route)) {
      this.registredRouts.GET.set(route, callback)
    }
  }

  post(route, callback = (req, res) => {}) {
    if (!this.registredRouts.POST.has(route)) {
      this.registredRouts.POST.set(route, callback)
    }
  }

  put(route, callback = (req, res) => {}) {
    if (!this.registredRouts.PUT.has(route)) {
      this.registredRouts.PUT.set(route, callback)
    }
  }

  delete(route, callback = (req, res) => {}) {
    if (!this.registredRouts.DELETE.has(route)) {
      this.registredRouts.DELETE.set(route, callback)
    }
  }
}

module.exports = new Route