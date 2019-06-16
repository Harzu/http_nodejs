class Request {
  constructor(reqParams) {
    this.reqParams = reqParams
    this.bodyParse()
  }

  bodyParse() {
    switch (this.reqParams.headers['Content-Type']) {
      case 'application/json':
        this.reqParams.body = JSON.parse(this.reqParams.body)
        break
    }
  }

  URI() { return this.reqParams.uri }
  Method() { return this.reqParams.method }
  Headers() { return this.reqParams.headers }
  Body() { return this.reqParams.body }
}

module.exports = Request