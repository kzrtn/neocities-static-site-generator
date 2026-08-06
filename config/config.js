fs = require('node:fs')

const BLOG_INDEX = 'blog-index' // file name for blog index, excluding the file extension `.html`
const BLOG_POST = 'blog-post' // file name for blog post, excluding the file extension `.html`

const POST_PATH = './_posts/' // Folder path for markdown posts
const TEMPLATES_PATH = './_templates/' // Folder path for templates
const STYLE_PATH = './_styles/' // Folder path for style sheets
const OUTPUT_PATH = './dist/' // Output folder
const POST_OUTPUT_PATH = `${OUTPUT_PATH}/posts/` // Blog posts output folder (Default is ./dist/posts/)

module.exports = {
  BLOG_INDEX,
  BLOG_POST,
  POST_PATH,
  TEMPLATES_PATH,
  STYLE_PATH,
  OUTPUT_PATH,
  POST_OUTPUT_PATH,
}