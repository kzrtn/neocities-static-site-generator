
fs = require('node:fs')

const createFolderPathifNotExists = (path) => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path);
    console.log(`FOLDER CREATED: '${path}'`)
  } else {
    console.log(`FOLDER ALREADY EXISTS: '${path}'`)
  }
}

module.exports = createFolderPathifNotExists