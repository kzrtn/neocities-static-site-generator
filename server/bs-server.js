const bs = require('browser-sync').create()

bs.init({
  server: "./dist",
  startPath: "/test.html",
  files: ["dist/**/*"],
  notify: false
})
bs.reload(["*.html", "*.css"])