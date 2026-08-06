#!/usr/bin/env node
const process = require('node:process')
const fs = require('node:fs')
const path = require('node:path')

const nodemon = require('nodemon')
const bs = require('browser-sync').create()

const createFolderPathifNotExists = require(path.join(__dirname, '/utils/create_folderpath_if_not_exists.js'))
const copyFilesFromPath = require(path.join(__dirname, '/utils/copy_files_from_folder.js'))

if (process.argv.length < 3) {
  console.log("Insufficient arguments. Please use 'npx neocities-ssg [argument]'")
  console.log("Available arguments: create 'your-site-name', serve")
  process.exit()
}

else if (process.argv[2] === 'create') {
  if (process.argv.length !== 4) {
    console.log("Insufficient or too many arguments. Please use 'npx neocities-ssg create 'your-site-name'.")
    console.log("Site name needs to be one word long.")
    console.log("E.g.")
    console.log("✓ npx neocities-ssg create mysite")
    console.log("✓ npx neocities-ssg create my-site")
    console.log("✗ npx neocities-ssg create 'my site'")
    console.log("✗ npx neocities-ssg create my site")
    process.exit()
  }

  const siteName = process.argv[3]
    .replace(/[^a-zA-Z0-9\s\'\"\-\_]/g, '') // remove illegal chars

  fs.mkdirSync(siteName)
  createFolderPathifNotExists(path.join(siteName, '_media'))
  createFolderPathifNotExists(path.join(siteName, '_posts'))
  createFolderPathifNotExists(path.join(siteName, '_styles'))
  createFolderPathifNotExists(path.join(siteName, '_templates'))
  createFolderPathifNotExists(path.join(siteName, 'config'))

  copyFilesFromPath(path.join(__dirname, '_media'), path.join(process.cwd(), siteName, '_media'))
  copyFilesFromPath(path.join(__dirname, '_posts'), path.join(process.cwd(), siteName, '_posts'))
  copyFilesFromPath(path.join(__dirname, '_styles'), path.join(process.cwd(), siteName, '_styles'))
  copyFilesFromPath(path.join(__dirname, '_templates'), path.join(process.cwd(), siteName, '_templates'))
  copyFilesFromPath(path.join(__dirname, 'config'), path.join(process.cwd(), siteName, 'config'))
}

else if (process.argv[2] === 'serve') {
  nodemon({
    "watch": ["_posts", "_templates", "_styles", "index.js"],
    "ext": "md,html,css,js",
    "exec": `cd ${__dirname} && node app.js -- ${process.cwd()}`
  })

  nodemon
    .on('start', () => console.log('Nodemon started'))
    .on('quit', () => process.exit())

  const config = require(path.join(process.cwd(), '/config/config.js'))
  bs.init({
    server: config.OUTPUT_PATH,
    startPath: `/${config.BLOG_INDEX}.html`,
    files: ["*/*"],
    notify: false,
    watchEvents: ["change", "add", "unlink", "addDir", "unlinkDir"]
  })
  bs.reload(["*.html", "*.css"])
}

else {
  console.log("Unrecognized arguments. Please use 'npx neocities-ssg [argument]'")
  console.log("Available arguments: create 'your-site-name', serve")
}