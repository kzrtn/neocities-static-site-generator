const bs = require('browser-sync').create()
const {BLOG_INDEX} = require('../config/config.js')

bs.init({
  server: "./dist",
  startPath: `/${BLOG_INDEX}.html`,
  files: ["dist/**/*"],
  notify: false
})
bs.reload(["*.html", "*.css"])