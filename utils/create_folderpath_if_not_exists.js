
fs = require('node:fs')

const createFolderPathifNotExists = (path) => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path)
    // console.log(`FOLDER CREATED: '${path}'`)
    return true
  } else {
    // console.log(`FOLDER ALREADY EXISTS: '${path}'`)
    return false
  }
}

module.exports = createFolderPathifNotExists