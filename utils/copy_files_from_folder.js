const fs = require('node:fs')

const copyFilesFromPath = (origin, dest) => {
  const files = fs.readdirSync(origin)

  for (const file of files) {
    try {
      fs.copyFileSync(`${origin}/${file}`, `${dest}/${file}`)
      console.log(`COPIED FILE: FROM '${origin}/${file}' TO '${dest}/${file}'`)
    } catch (err) {
      console.error(err.message)
    }
  }
}

module.exports = copyFilesFromPath