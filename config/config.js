fs = require('node:fs')

// Names of your templates
const BLOG_INDEX = 'blog-index'
const BLOG_POST = 'blog-post'

// Folder path for markdown posts
const POST_PATH = './_posts/'
const posts = fs.readdirSync(POST_PATH)

// Folder path for templates
const TEMPLATES_PATH = './_templates/'
const templates = fs.readdirSync(TEMPLATES_PATH)

// Folder path for style sheets
const STYLE_PATH = './_styles/'

// Output folder
const OUTPUT_PATH = './dist/'
const POST_OUTPUT_PATH = `${OUTPUT_PATH}/posts/`

module.exports = {
  BLOG_INDEX,
  BLOG_POST,
  POST_PATH,
  posts,
  TEMPLATES_PATH,
  templates,
  STYLE_PATH,
  OUTPUT_PATH,
  POST_OUTPUT_PATH,
}