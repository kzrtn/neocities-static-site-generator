const bs = require('browser-sync').create()
const {BLOG_INDEX} = require('../config/config.js')

bs.init({
  server: "./dist",
  startPath: `/${BLOG_INDEX}.html`,
  files: ["*/*"],
  notify: false,
  watchEvents: ["change", "add", "unlink", "addDir", "unlinkDir"]
})
bs.reload(["*.html", "*.css"])