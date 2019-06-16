const fs = require('fs')
const path = require('path')

function static(directoryPath, route) {
  const dir = fs.readdirSync(directoryPath)
  console.log(dir)
}

module.exports = static