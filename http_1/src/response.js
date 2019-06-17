const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const codeTable = require('../../status-code.json')

class Response {
  constructor(reqParams, socket) {
    this.reqParams = reqParams
    this.socket = socket

    this.responseData = {
      statusCode: 200,
      statusMessage: 'OK',
      headers: {
        Date: new Date(),
        Connection: 'keep-alive'
      },
      body: ''
    }
  }

  status(statusCode) {
    const row = codeTable.find(row => row.code === statusCode)
    if (!statusCode) {
      throw new Error('ivalid status code')
    }
    
    this.responseData.statusCode = statusCode
    this.responseData.statusMessage = row.message
  }

  setHeader(key, value) {
    this.responseData.headers[key] = value
  }

  json(data) {
    this.setHeader('Content-Type', 'application/json')
    this.responseData.body = data
  }

  text(data) {
    this.setHeader('Content-Type', 'text/plain')
    this.responseData.body = String(data)
  }

  sendFile(filePath) {
    const basename = path.basename(filePath)
    const contentType = mime.contentType(basename)
    this.setHeader('Content-Type', contentType)

    try {
      const fileData = fs.readFileSync(filePath)
      this.responseData.body = fileData.toString()
    } catch (error) {
      this.status(500)
      this.responseData.body = error.message
    }
  }

  end() {
    let generateResponse = `HTTP/1.1 ${this.responseData.statusCode} ${this.responseData.statusMessage}`
    for (const header in this.responseData.headers) {
      const headerString = `\n${header}: ${this.responseData.headers[header]}`
      generateResponse += headerString
    }
    
    generateResponse += `\n\n${this.responseData.body}`

    this.socket.write(generateResponse)
    this.socket.pipe(this.socket)
    this.socket.end()
  }
}

module.exports = Response