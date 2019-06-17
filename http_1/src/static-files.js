const fs = require('fs')
const path = require('path')

function static(directoryPath, route) {
  if (!fs.existsSync(directoryPath)) {
    throw new Error('static directory is not exists')
  }

  const readDirectory = fs.readdirSync(directoryPath)
  for (const item of readDirectory) {
    const pathToItem = path.join(directoryPath, item)
    const itemInfo = fs.lstatSync(pathToItem)
    if (!itemInfo.isDirectory()) {
      route.get(`/${item}`, (req, res) => {
        res.sendFile(pathToItem)
        res.end()
      })
    } else {
      static(pathToItem, route)
    }
  }
}

module.exports = static